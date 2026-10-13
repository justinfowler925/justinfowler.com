import {FeedbackError} from './hollywood-feedback.js';
export const CONTROL_KEY='control/state.json';
export const HOURLY_LIMIT=10;
export const pauseMessage='Feedback is paused. Your text has not been sent; please keep a copy and try later.';
export async function controlStatus(store){return (await store.read(CONTROL_KEY))?.data||{paused:false}}
export async function setPaused(store,paused,now=Date.now()){
 for(let i=0;i<8;i++){
  const row=await store.read(CONTROL_KEY),old=row?.data||{};
  const next={...old,paused,reason:paused?'owner':'',changedAt:new Date(now).toISOString()};
  if(await store.write(CONTROL_KEY,next,row?.etag))return next;
 }
 throw new FeedbackError(503,'Control is busy. Please retry.');
}
// Both fresh submissions and queued deliveries share one durable circuit breaker.
// Reserve before the operation, so concurrent callers cannot overshoot the limit.
export async function reserve(store,kind,now=Date.now()){
 for(let i=0;i<8;i++){
  const row=await store.read(CONTROL_KEY),old=row?.data||{};
  if(old.paused)throw new FeedbackError(503,pauseMessage);
  const hour=Math.floor(now/3600000),current=old.hour===hour?old:{...old,hour,submissions:0,deliveries:0};
  if((current[kind]||0)>=HOURLY_LIMIT){
   if(await store.write(CONTROL_KEY,{...current,paused:true,reason:'automatic-limit',changedAt:new Date(now).toISOString()},row?.etag))throw new FeedbackError(503,pauseMessage);
  }else if(await store.write(CONTROL_KEY,{...current,[kind]:(current[kind]||0)+1},row?.etag))return;
 }
 throw new FeedbackError(503,'Feedback is busy. Please retry shortly.');
}
