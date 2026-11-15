import json,re
from pathlib import Path
p=Path('sites/archi website2');raw=json.loads((p/'src/reference-data.json').read_text(encoding='utf8'))
def asset(u): return '/assets/'+u.split('?')[0].rsplit('/',1)[-1] if u else ''
def media(m): return {'src':asset(m.get('src','')) if m['tag']=='img' else '', 'video':m.get('src','') if m['tag']=='video' else '', 'poster':asset(m.get('poster','')), 'alt':m.get('alt','Interior design by Korda Studio')}
projects=[];articles=[]
for path,d in raw.items():
 t=d['text'];ms=d['media']
 if path.startswith('/projects/'):
  i=next(i for i,x in enumerate(t) if x['tag']=='h1'); title=t[i]['text'];end=next(i for i,x in enumerate(t) if x['text']=='More from the studio.')
  projects.append({'slug':path.split('/')[-1],'title':title,'location':t[i-3]['text'],'year':t[i-1]['text'],'description':t[i+2]['text'],'size':t[i+8]['text'],'hero':media(ms[0]),'gallery':[media(m) for m in ms[1:7]],'body':[{k:x[k] for k in ['tag','text']} for x in t[i+9:end]],'related':list(dict.fromkeys(l.split('/')[-1] for l in d['links'] if '/projects/' in l))[:3]})
 if path.startswith('/articles/'):
  i=next(i for i,x in enumerate(t) if x['tag']=='h2');end=next(i for i,x in enumerate(t) if x['text']=='More insights to explore.')
  start=next(i for i,x in enumerate(t) if x['text']=='Contact us')+1
  articles.append({'slug':path.split('/')[-1],'title':t[i]['text'],'category':t[i-1]['text'],'read':t[i-2]['text'],'description':t[i+1]['text'],'author':t[i+2]['text'],'role':t[i+3]['text'],'hero':media(ms[0]),'portrait':media(ms[1]),'body':[{k:x[k] for k in ['tag','text']} for x in t[start:end]]})
order=['why-we-draw-the-daylight-before-the-plan','the-case-for-lime-plaster-in-coastal-houses','how-we-scope-a-project-in-four-weeks','the-harbor-house-reduced-to-its-frame','two-weeks-of-pencil-before-the-first-file','four-oak-floors-thirty-years-later']
dates=['Sep 18, 2026','Aug 7, 2026','Apr 14, 2026','Jun 11, 2026','Jul 2, 2026','May 20, 2026']
articles=sorted(articles,key=lambda a:order.index(a['slug']))
for a,date in zip(articles,dates):a['date']=date
about=[media(m) for m in raw['/about']['media']];home=[media(m) for m in raw['/']['media']]
(p/'src/data.json').write_text(json.dumps({'projects':projects,'articles':articles,'aboutMedia':about,'homeMedia':home},ensure_ascii=False),encoding='utf8')
print([(x['title'],x['size']) for x in projects])
