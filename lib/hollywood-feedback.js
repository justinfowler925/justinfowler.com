import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import sections from '../assets/hollywood-feedback/sections.json' with {type:'json'};
export class FeedbackError extends Error {constructor(status,message){super(message);this.status=status}}
const fail=(status,message)=>{throw new FeedbackError(status,message)};
export function validate(body){
 if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'Invalid feedback.');
 if(body.website)fail(400,'Unable to accept this submission.');
 const {page,section,id}=body;
 if(!sections[page]?.[section])fail(400,'Choose a valid page section.');
 if(typeof id!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))fail(400,'Invalid submission ID.');
 const field=(name,max,required=false)=>{const value=body[name]??'';if(typeof value!=='string'||value.length>max)fail(400,`${name} is too long or invalid.`);const clean=value.trim();if(required&&clean.length<5)fail(400,'Please write at least five characters.');return clean};
 const message=field('message',8000,true),name=field('name',100),email=field('email',254);
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'Enter a valid email or leave it blank.');
 return {id,page,section,sectionTitle:sections[page][section],name,email,message};
}
export function digest(value){return createHash('sha256').update(JSON.stringify(value)).digest('hex')}
export function authorized(value,secret){if(!secret||typeof value!=='string')return false;const a=Buffer.from(value),b=Buffer.from(`Bearer ${secret}`);return a.length===b.length&&timingSafeEqual(a,b)}
export function slackPayload(c){
 const label=c.name||'Anonymous visitor',url=`https://justinfowler.com${c.page}#${c.section}`;
 // Visitor content is plain text; Slack mentions, markdown and link unfurls stay disabled.
 return {text:`Hollywood feedback: ${c.sectionTitle}`,unfurl_links:false,unfurl_media:false,blocks:[{type:'header',text:{type:'plain_text',text:'New Hollywood feedback'}},{type:'section',text:{type:'plain_text',text:`${c.sectionTitle}\nFrom: ${label}${c.email?' · '+c.email:''}\nReference: ${c.id}`}},{type:'section',text:{type:'plain_text',text:c.message.slice(0,2900)}},...(c.message.length>2900?[{type:'section',text:{type:'plain_text',text:c.message.slice(2900,5800)}},{type:'section',text:{type:'plain_text',text:c.message.slice(5800)||'End of suggestion.'}}]:[]),{type:'section',text:{type:'mrkdwn',text:`<${url}|Open this section> · <https://justinfowler.com/tools/hollywood-feedback.html|Pause feedback / kill switch>`}}]};
}
export async function acceptFeedback(body,{store,secret,ip,notify,now=Date.now()}){
 const {controlStatus,pauseMessage,reserve}=await import('./feedback-control.js');
 if((await controlStatus(store)).paused)fail(503,pauseMessage);
 const c=validate(body),key=`comments/${c.id}.json`,fingerprint=digest(c);
 let existing=await store.read(key);
 if(existing){if(existing.data.fingerprint!==fingerprint)fail(409,'This submission ID already belongs to different feedback.');return {id:c.id,saved:true,notification:existing.data.notification==='sent'?'sent':'queued'}}
 if(!secret)fail(503,'Feedback is temporarily unavailable. Your text has not been sent.');
 const who=createHmac('sha256',secret).update(ip||'unknown').digest('hex').slice(0,32),hour=Math.floor(now/3600000),rateKey=`rate/${hour}/${who}.json`;
 let admitted=false;
 for(let attempt=0;attempt<6;attempt++){
  const rate=await store.read(rateKey),value=rate?.data||{count:0,last:0};
  if(value.count>=8||now-value.last<10000)fail(429,'Please wait before sending more feedback. Your text is still here.');
  if(await store.write(rateKey,{count:value.count+1,last:now},rate?.etag)){admitted=true;break}
 }
 if(!admitted)fail(429,'Please try again shortly. Your text is still here.');
 await reserve(store,'submissions',now);
 const record={...c,fingerprint,createdAt:new Date(now).toISOString(),notification:'queued',visibility:'private'};
 if(!await store.write(key,record)){
  existing=await store.read(key);if(!existing||existing.data.fingerprint!==fingerprint)fail(409,'Conflicting submission.');
  return {id:c.id,saved:true,notification:existing.data.notification==='sent'?'sent':'queued'};
 }
 // Durability is the success boundary. Notification failure must never erase a comment.
 try {if(await notify(record))return {id:c.id,saved:true,notification:'sent'}}catch{}
 return {id:c.id,saved:true,notification:'queued'};
}
