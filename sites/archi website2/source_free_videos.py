import urllib.request,re,json
from pathlib import Path
p=Path('sites/archi website2/reference')
for slug,id in [('a-minimalist-living-room',7239171),('modern-kitchen-interior',10216191)]:
 u=f'https://www.pexels.com/video/{slug}-{id}/'
 try:
  raw=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read().decode();(p/f'pexels-video-{id}.html').write_text(raw,encoding='utf8')
  urls=list(dict.fromkeys(re.findall(r'https[^\s"<>]+\.mp4[^\s"<>]*',raw)));print(id,urls[:5])
 except Exception as e:print(id,str(e))
