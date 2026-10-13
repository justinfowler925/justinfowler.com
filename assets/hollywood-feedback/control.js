(()=>{
 let secret='';const $=id=>document.getElementById(id);
 async function request(paused){
  $('error').textContent='';for(const b of document.querySelectorAll('button'))b.disabled=true;
  try{
   const r=await fetch('/api/hollywood-feedback-control',{method:paused===undefined?'GET':'POST',headers:{Authorization:'Bearer '+secret,'Content-Type':'application/json'},...(paused===undefined?{}:{body:JSON.stringify({paused})}),signal:AbortSignal.timeout(20000)});
   const data=await r.json();if(!r.ok)throw Error(data.error||'Unable to confirm status.');
   $('login').hidden=true;$('controls').hidden=false;
   $('status').textContent=data.paused?'PAUSED — new suggestions and Slack deliveries are blocked'+(data.reason==='automatic-limit'?' by the automatic spam limit.':'.'):'ACTIVE — accepting private suggestions and sending Slack DMs.';
  }catch(e){$('error').textContent=e.name==='TimeoutError'?'Timed out. Refresh to confirm the current state.':e.message}
  finally{for(const b of document.querySelectorAll('button'))b.disabled=false}
 }
 $('login').addEventListener('submit',e=>{e.preventDefault();secret=$('password').value;$('password').value='';request()});
 $('pause').onclick=()=>request(true);$('resume').onclick=()=>request(false);$('refresh').onclick=()=>request();
 $('lock').onclick=()=>{secret='';$('controls').hidden=true;$('login').hidden=false;$('error').textContent=''};
})();
