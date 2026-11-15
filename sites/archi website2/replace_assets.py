import json,re
from pathlib import Path
p=Path('sites/archi website2');d=json.loads((p/'src/data.json').read_text(encoding='utf8'));photos=json.loads((p/'src/free-photos.json').read_text(encoding='utf8'));available={x['id'] for x in photos}
def photo(id):
 assert id in available
 return '/assets/free/pexels-'+str(id)+'.jpg'
media=[]
def collect(x):
 if isinstance(x,dict):
  if 'src' in x:media.append(x)
  for v in x.values():collect(v)
 elif isinstance(x,list):
  for v in x:collect(v)
collect(d);old=list(dict.fromkeys(m['src'] for m in media if m.get('src')))
pool=[8123029,30609234,6890399,17840537,6436757,37070073,36287488,29672793,26571206,17919765,3952048,4916281,40574006,35374088,10780943]
mapping={s:photo(pool[i%len(pool)]) for i,s in enumerate(old)}
mapping['/assets/pYEBYDcgGJnub0zFaM9EJQLC7k.png']=photo(10780943)
projectPics={'vale-house':8123029,'meridian':30609234,'birch-lane':6890399,'croft-end':17840537,'the-granary':6436757,'westport':37070073,'studio-six':36287488,'the-mill':29672793,'elmwood':26571206}
for pr in d['projects']:
 if pr['hero'].get('src'):mapping[pr['hero']['src']]=photo(projectPics[pr['slug']])
for a,id in zip(d['articles'],[10780943,40574006,36167549,36287488,17919765,3952048]):mapping[a['hero']['src']]=photo(id)
# Replace every portrait and all seven placeholder client marks, including duplicate source instances.
unique=[]
for m in d['aboutMedia']:
 if m['src'] and m['src'] not in unique:unique.append(m['src'])
for i,(s,name) in enumerate(zip(unique[:7],['FORM','MATERIAL','ATELIER','ARC','OBJECT','STILL','LINE'])):
 path=p/'public/assets/free'/f'mark-{i}.svg';path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><text x="200" y="118" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="700" letter-spacing="-3">{name}</text></svg>',encoding='utf8');mapping[s]='/assets/free/'+path.name
for s,id in zip(unique[13:19],[36167549,20022690,29407201,19039585,16478898,23228228]):mapping[s]=photo(id)
mapping[unique[7]]=photo(36287488);mapping[unique[8]]=photo(30609234)
for a,id in zip(d['articles'],[36167549,20022690,23228228,36167549,23228228,20022690]):mapping[a['portrait']['src']]=photo(id)
for m in media:
 if m.get('video'):
  fallback=6890399 if '5823583' in m['video'] else 36287488
  m['src']=photo(fallback);m['video']='';m['poster']='';m['alt']='Minimalist interior — free stock photography';m['motionStill']=True
 else:
  m['src']=mapping.get(m['src'],m['src']);m['poster']=mapping.get(m.get('poster',''),m.get('poster',''));m['alt']='Decode — interior and architecture photography' if 'mark-' not in m['src'] else 'Studio concept mark'
text=json.dumps(d,ensure_ascii=False).replace('Korda Studio','Decode').replace('Korda','Decode').replace('KORDA','DECODE');(p/'src/data.json').write_text(text,encoding='utf8')
(p/'src/asset-replacements.json').write_text(json.dumps(mapping),encoding='utf8')
credits='# DECODE photo credits\n\nReplacement stock photography is used for this concept website; the pictured people and spaces are not claimed as DECODE staff or completed projects. All photographs are offered under the [Pexels License](https://www.pexels.com/license/). The seven typographic studio marks were created locally for this demo.\n\n'
for row in photos:credits+=f"- [{row['photographer']} — photo {row['id']}]({row['source']})\n"
(p/'ASSET-CREDITS.md').write_text(credits,encoding='utf8')
html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>DECODE — Photography credits</title><style>body{font:18px/1.5 Arial;max-width:850px;margin:64px auto;padding:24px}a{color:inherit}li{margin:12px 0}</style><h1>Photography credits</h1><p>Stock photography for the DECODE concept website. The people and spaces shown do not represent actual DECODE staff or completed projects.</p><p><a href="https://www.pexels.com/license/">Pexels License</a></p><ul>'+''.join(f'<li><a href="{r["source"]}">{r["photographer"]} — {r["id"]}</a></li>' for r in photos)+'</ul><p><a href="/">Return to DECODE</a></p></html>'
(p/'public/asset-credits.html').write_text(html,encoding='utf8');print('Replaced',len(mapping),'original image references with',len(photos),'free photos and 7 locally created marks')
