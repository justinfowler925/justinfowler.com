#!/usr/bin/env python3
"""Studio-owned retry caller. Config path is owner-only, outside the repository."""
import fcntl,json,os,time,urllib.request
from pathlib import Path
base=Path.home()/'.config/hollywood-feedback'
with (base/'retry.lock').open('w') as lock:
 try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
 except BlockingIOError:raise SystemExit(0)
 config=json.loads((base/'retry.json').read_text())
 progress=base/'cursor.json'
 cursor=json.loads(progress.read_text()).get('cursor') if progress.exists() else None
 sent=checked=0
 try:
  for _ in range(5):
   req=urllib.request.Request(config['url'],data=json.dumps({'cursor':cursor}).encode(),headers={'Authorization':'Bearer '+config['secret'],'Content-Type':'application/json'},method='POST')
   with urllib.request.urlopen(req,timeout=135) as response:r=json.load(response)
   sent+=r['sent'];checked+=r['checked'];cursor=r.get('cursor') if r.get('hasMore') else None
   progress.write_text(json.dumps({'cursor':cursor}));os.chmod(progress,0o600)
   if not cursor:break
  receipt={'ok':True,'sent':sent,'checked':checked,'more':bool(cursor),'at':time.time()}
 except Exception as e:receipt={'ok':False,'error':type(e).__name__,'at':time.time()}
 (base/'last-run.json').write_text(json.dumps(receipt));os.chmod(base/'last-run.json',0o600)
 print(json.dumps(receipt))
