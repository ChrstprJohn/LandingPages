import urllib.request, urllib.parse, re, json, os, concurrent.futures
from html.parser import HTMLParser
from pathlib import Path
root=Path(__file__).parent
class Node:
 def __init__(self,tag='',attrs=[]): self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self): return ''.join(c.text() if isinstance(c,Node) else c for c in self.children)
 def walk(self):
  yield self
  for c in self.children:
   if isinstance(c,Node): yield from c.walk()
class Parser(HTMLParser):
 def __init__(self,s): super().__init__();self.root=Node();self.stack=[self.root];self.feed(s)
 def handle_starttag(self,t,a):
  n=Node(t,a);self.stack[-1].children.append(n)
  if t not in ['img','meta','link','input','br','hr','source','wbr','area','base','embed']: self.stack.append(n)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,d): self.stack[-1].children.append(d)
def get(url):
 return urllib.request.urlopen(url,timeout=45).read()
def page(path):
 url='https://korda.framer.media'+path
 raw=get(url).decode();(root/'reference'/((path.strip('/').replace('/','__') or 'home')+'.html')).write_text(raw,encoding='utf8')
 nodes=list(Parser(raw).root.walk());main=next((n for n in nodes if n.tag=='main'),None); nodes=list(main.walk()) if main else nodes
 text=[{'tag':n.tag,'text':n.text(),'attrs':n.attrs} for n in nodes if n.tag in ['h1','h2','h3','h4','h5','h6','p']]
 media=[{'tag':n.tag,**n.attrs} for n in nodes if n.tag in ['img','video']]
 links=[urllib.parse.urljoin(url,n.attrs.get('href','')) for n in nodes if n.tag=='a']
 return path,{'text':text,'media':media,'links':links},raw
paths=['/','/projects','/about','/articles']; results={};raws=[]
for path in paths:
 p,d,r=page(path);results[p]=d;raws.append(r)
links=set(l for d in results.values() for l in d['links'] if l.startswith('https://korda.framer.media/projects/') or l.startswith('https://korda.framer.media/articles/'))
for url in list(links):
 p,d,r=page(urllib.parse.urlparse(url).path);results[p]=d;raws.append(r)
# Include detail pages reachable from related project cards.
extra=set(l for d in results.values() for l in d['links'] if l.startswith('https://korda.framer.media/projects/') and urllib.parse.urlparse(l).path not in results)
for url in extra:
 p,d,r=page(urllib.parse.urlparse(url).path);results[p]=d;raws.append(r)
assets=set()
for d in results.values():
 for m in d['media']:
  for key in ['src','poster']:
   u=m.get(key,'')
   if u.startswith('https://framerusercontent.com/images/'): assets.add(u.split('?')[0])
for raw in raws:
 assets.update(re.findall(r'https://framerusercontent.com/assets/[^\s"\)]+\.woff2',raw))
 # CSS background images and video posters.
 assets.update(re.findall(r'https://framerusercontent.com/images/[a-zA-Z0-9]+\.(?:png|jpg|jpeg|webp|svg)',raw))
def download(u):
 dest=root/'public'/'assets'/u.rsplit('/',1)[-1]
 try:
  if not dest.exists(): dest.write_bytes(get(u))
  return True
 except Exception as e: print('asset failed',u,str(e));return False
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: done=list(pool.map(download,assets))
(root/'src'/'reference-data.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print('Pages',len(results),'Assets',sum(done)); print('\n'.join(results))
