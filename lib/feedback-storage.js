import {get,put,list,BlobNotFoundError,BlobPreconditionFailedError} from '@vercel/blob';
const prefix=process.env.VERCEL_ENV==='preview'?'hollywood-feedback/preview/':'hollywood-feedback/production/';
export const store={
 async read(key){let result;try{result=await get(prefix+key,{access:'private',useCache:false})}catch(e){if(e instanceof BlobNotFoundError)return null;throw e}if(!result)return null;return {data:await new Response(result.stream).json(),etag:result.blob.etag}},
 async write(key,data,etag){try{await put(prefix+key,JSON.stringify(data),{access:'private',addRandomSuffix:false,contentType:'application/json',...(etag?{ifMatch:etag}:{allowOverwrite:false})});return true}catch(e){if(e instanceof BlobPreconditionFailedError||/already exists/i.test(e.message))return false;throw e}},
 async comments(cursor){const r=await list({prefix:prefix+'comments/',limit:10,cursor});return {keys:r.blobs.map(b=>b.pathname.slice(prefix.length)),cursor:r.cursor,hasMore:r.hasMore}}
};
export async function notifySlack(record){
 const token=process.env.HOLLYWOOD_SLACK_BOT_TOKEN, channel=process.env.HOLLYWOOD_SLACK_DM_ID;
 if(!token||!channel||!/^D[A-Z0-9]+$/.test(channel))return false;
 const key=`comments/${record.id}.json`,entry=await store.read(key);if(!entry)return false;if(entry.data.notification==='sent')return true;
 const now=Date.now();if(entry.data.leaseUntil>now)return false;
 if(!await store.write(key,{...entry.data,leaseUntil:now+60000},entry.etag))return false;
 const locked=await store.read(key);
 const {slackPayload}=await import('./hollywood-feedback.js');
 const {reserve,controlStatus}=await import('./feedback-control.js');
 try{await reserve(store,'deliveries')}catch{return false}
 if((await controlStatus(store)).paused)return false;
 let sent=false;
 try{const r=await fetch('https://slack.com/api/chat.postMessage',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({...slackPayload(record),channel,client_msg_id:record.id}),signal:AbortSignal.timeout(8000)});sent=r.ok&&(await r.json()).ok===true}catch{}
 await store.write(key,{...locked.data,notification:sent?'sent':'queued',leaseUntil:0,lastAttemptAt:new Date().toISOString(),...(sent?{notifiedAt:new Date().toISOString()}:{})},locked.etag);
 return sent;
}
