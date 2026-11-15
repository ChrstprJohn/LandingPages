import urllib.request,concurrent.futures,json
from pathlib import Path
p=Path('sites/archi website2');items=[('living-room','https://videos.pexels.com/video-files/7239171/7239171-uhd_2560_1440_25fps.mp4'),('kitchen','https://videos.pexels.com/video-files/10216191/10216191-hd_1920_1080_25fps.mp4')]
def dl(row):
 name,url=row;dest=p/'public/assets/free'/f'{name}.mp4';req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':'https://www.pexels.com/'})
 if not dest.exists():dest.write_bytes(urllib.request.urlopen(req,timeout=90).read())
 print(name,dest.stat().st_size)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(dl,items))
d=json.loads((p/'src/data.json').read_text(encoding='utf8'))
def visit(x):
 if isinstance(x,dict):
  if x.get('motionStill'):
   x['video']='/assets/free/living-room.mp4' if '6890399' in x['src'] else '/assets/free/kitchen.mp4';x['poster']=x['src'];x['src']='';x.pop('motionStill',None)
  for v in x.values():visit(v)
 elif isinstance(x,list):
  for v in x:visit(v)
visit(d);(p/'src/data.json').write_text(json.dumps(d,ensure_ascii=False),encoding='utf8')
with (p/'ASSET-CREDITS.md').open('a',encoding='utf8') as f:f.write('\n## Video loops\n\n- [Max Vakhtbovych — minimalist living room](https://www.pexels.com/video/a-minimalist-living-room-7239171/)\n- [Modern kitchen — Pexels](https://www.pexels.com/video/modern-kitchen-interior-10216191/)\n')
