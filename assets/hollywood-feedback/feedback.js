(async()=>{
 const response=await fetch('/assets/hollywood-feedback/sections.json');if(!response.ok)return;
 const config=await response.json(),sections=config[location.pathname];if(!sections)return;
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n};
 for(const [id,title] of Object.entries(sections)){
  const target=document.getElementById(id);if(!target)continue;
  const box=make('details',null,'section-feedback'),summary=make('summary','Suggest an improvement');summary.setAttribute('aria-label','Suggest an improvement: '+title);box.append(summary);
  const form=make('form'),intro=make('p','Feedback on '+title,'feedback-context');
  const disclosure=make('p','Sent privately to Justin, with a Slack notification. Nothing is posted publicly. Please do not paste passwords or sensitive information.','feedback-note');
  form.append(intro,disclosure);
  const fields={};
  for(const [key,label,max,type] of [['message','Your suggestion',8000,'textarea'],['name','Name (optional)',100,'text'],['email','Email for a reply (optional)',254,'email']]){
   const fieldId='feedback-'+id+'-'+key,lab=make('label',label);lab.htmlFor=fieldId;
   const input=make(type==='textarea'?'textarea':'input');input.id=fieldId;input.name=key;input.maxLength=max;
   if(type==='textarea'){input.rows=6;input.required=true;input.minLength=5;input.placeholder='What would you change, and why? Paste notes, code, links or timestamps.'}else{input.type=type;input.autocomplete=key}
   fields[key]=input;form.append(lab,input);
  }
  const trap=make('input');trap.name='website';trap.tabIndex=-1;trap.autocomplete='off';trap.setAttribute('aria-hidden','true');trap.className='feedback-honeypot';form.append(trap);
  const button=make('button','Send suggestion','primary'),status=make('p','','feedback-status');button.type='submit';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(button,status);
  const privacy=make('a','Privacy policy');privacy.href='/privacy.html#hollywood-feedback';form.append(privacy);
  let requestId=crypto.randomUUID(),lastBody='';
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const payload={page:location.pathname,section:id,message:fields.message.value,name:fields.name.value,email:fields.email.value,website:trap.value};
   const signature=JSON.stringify(payload);if(lastBody&&signature!==lastBody)requestId=crypto.randomUUID();lastBody=signature;
   button.disabled=true;status.textContent='Saving your suggestion…';status.classList.remove('feedback-error');
   try{
    const r=await fetch('/api/hollywood-feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,id:requestId}),signal:AbortSignal.timeout(20000)});
    const result=await r.json().catch(()=>({error:'Could not save your suggestion. Your text is still here; please retry.'}));if(!r.ok||!result.saved)throw new Error(result.error||'Could not save your suggestion. Please retry.');
    status.textContent='Thanks—your suggestion is saved privately for Justin.';fields.message.value='';requestId=crypto.randomUUID();lastBody='';
   }catch(e){status.textContent=e.name==='TimeoutError'?'The connection timed out. Your text is still here; retrying will not create a duplicate.':e.name==='TypeError'?'Could not connect. Your text is still here; please retry.':e.message;status.classList.add('feedback-error')}
   finally{button.disabled=false}
  });
  box.append(form);target.append(box);
 }
})().catch(()=>{});
