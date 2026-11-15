import json,urllib.request,concurrent.futures
from pathlib import Path
p=Path('sites/archi website2');data=json.loads((p/'src/data.json').read_text(encoding='utf8'))
urls=set(m['video'] for x in data['projects'] for m in [x['hero'],*x['gallery']] if m.get('video'))
def download(u):
 name=u.rsplit('/',1)[-1];dest=p/'public/assets'/name
 if not dest.exists():dest.write_bytes(urllib.request.urlopen(u,timeout=90).read())
 return u,'/assets/'+name
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: mapping=dict(pool.map(download,urls))
text=(p/'src/data.json').read_text(encoding='utf8')
for u,v in mapping.items():text=text.replace(u,v)
(p/'src/data.json').write_text(text,encoding='utf8');print('Downloaded',len(mapping),'videos')
