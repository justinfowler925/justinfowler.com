import {authorized,FeedbackError} from '../lib/hollywood-feedback.js';
import {store} from '../lib/feedback-storage.js';
import {controlStatus,setPaused,HOURLY_LIMIT} from '../lib/feedback-control.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(!authorized(req.headers.authorization,process.env.HOLLYWOOD_FEEDBACK_ADMIN_SECRET))return res.status(401).json({error:'Enter your feedback control password.'});
 try{
  if(req.method==='GET')return res.status(200).json({...await controlStatus(store),hourlyLimit:HOURLY_LIMIT});
  if(req.method!=='POST')return res.status(405).json({error:'GET or POST required.'});
  if(typeof req.body?.paused!=='boolean')return res.status(400).json({error:'Choose pause or resume.'});
  return res.status(200).json({...await setPaused(store,req.body.paused),hourlyLimit:HOURLY_LIMIT});
 }catch(e){return res.status(e instanceof FeedbackError?e.status:503).json({error:'Unable to confirm control state. Please retry.'})}
}
