import {authorized} from '../lib/hollywood-feedback.js';
import {store,notifySlack} from '../lib/feedback-storage.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(!authorized(req.headers.authorization,process.env.HOLLYWOOD_FEEDBACK_RETRY_SECRET))return res.status(401).json({error:'Unauthorized'});
 if(req.method!=='POST')return res.status(405).json({error:'POST required'});
 if(!process.env.HOLLYWOOD_SLACK_BOT_TOKEN)return res.status(503).json({error:'Slack destination not configured'});
 const cursor=typeof req.body?.cursor==='string'?req.body.cursor:undefined;
 try{const page=await store.comments(cursor);let sent=0,pending=0;for(const key of page.keys){const item=await store.read(key);if(item&&item.data.notification!=='sent'){if(pending>=10)break;pending++;if(await notifySlack(item.data))sent++}}return res.status(200).json({sent,checked:page.keys.length,hasMore:page.hasMore,cursor:page.cursor||null})}catch{return res.status(503).json({error:'Retry failed; saved comments retained'})}
}
