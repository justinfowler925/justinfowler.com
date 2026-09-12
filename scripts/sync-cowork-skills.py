#!/usr/bin/env python3
"""Mirror only the three public Cowork editions from the canonical Nucleus sources."""
from pathlib import Path
import argparse,hashlib,json,shutil
p=argparse.ArgumentParser();p.add_argument('--nucleus',required=True,type=Path);a=p.parse_args()
root=Path(__file__).resolve().parents[1];dest=root/'assets/cowork-skills'
receipt=json.loads((a.nucleus/'company-tools/releases/cowork.json').read_text())
assert {i['name'] for i in receipt['skills']}=={'shine','unfog','strike-package'}
for i in receipt['skills']:
 data=(a.nucleus/i['zip']).read_bytes();assert hashlib.sha256(data).hexdigest()==i['sha256']
 shutil.copytree(a.nucleus/'company-tools/cowork'/i['name'],dest/i['name'],dirs_exist_ok=True)
 (dest/Path(i['zip']).name).write_bytes(data)
(dest/'release.json').write_text(json.dumps({'edition':'Cowork guidance','upstreamMethodsUnchanged':True,'artifacts':[{**i,'zip':Path(i['zip']).name} for i in receipt['skills']]},indent=2)+'\n')
print('Verified and mirrored 3 public Cowork editions; SLED excluded.')
