import {acceptFeedback,FeedbackError} from '../lib/hollywood-feedback.js';
import {store,notifySlack} from '../lib/feedback-storage.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'POST required.'})}
 const allowed=new Set(['https://justinfowler.com','https://www.justinfowler.com']);
 if(process.env.VERCEL_ENV==='preview'&&process.env.VERCEL_URL)allowed.add('https://'+process.env.VERCEL_URL);
 if(!allowed.has(req.headers.origin))return res.status(403).json({error:'Please submit from the Hollywood page.'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required.'});
 try{
  if(Number(req.headers['content-length'])>24000||Buffer.byteLength(JSON.stringify(req.body??''))>24000)return res.status(413).json({error:'Please shorten the suggestion.'});
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
  const result=await acceptFeedback(body,{store,secret:process.env.HOLLYWOOD_FEEDBACK_SECRET,ip:String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0].trim(),notify:notifySlack});
  return res.status(200).json(result);
 }catch(e){if(e instanceof FeedbackError)return res.status(e.status).json({error:e.message});if(e instanceof SyntaxError)return res.status(400).json({error:'Invalid request.'});console.error('Feedback storage failure',e.name);return res.status(503).json({error:'Could not save feedback. Your text is still here; please retry.'})}
}
