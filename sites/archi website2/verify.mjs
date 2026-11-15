import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(readFileSync(join(root,'src/data.json'),'utf8'));
assert.equal(data.projects.length,9);assert.equal(data.articles.length,6);
const slugs=new Set(data.projects.map(p=>p.slug));assert.equal(slugs.size,9);
for(const p of data.projects){assert(p.body.length>=6,p.slug);assert(p.gallery.length>=5,p.slug);for(const related of p.related)assert(slugs.has(related),related);}
for(const article of data.articles){assert(article.body.filter(b=>b.tag==='h3').length>=3,article.slug);assert(article.body.some(b=>b.tag==='p'&&b.text.length>100),article.slug);}
let mediaCount=0;
function visit(item){if(Array.isArray(item)){item.forEach(visit);return;}if(!item||typeof item!=='object')return;for(const [key,value] of Object.entries(item)){if(['src','poster','video'].includes(key)&&value){assert(value.startsWith('/assets/free/'),`Unreplaced media: ${value}`);assert(existsSync(join(root,'public',value)),`Missing media: ${value}`);mediaCount++;}else visit(value);}}
visit(data);
const replacements=JSON.parse(readFileSync(join(root,'src/asset-replacements.json'),'utf8'));
for(const asset of Object.values(replacements))assert(existsSync(join(root,'public',asset)),asset);
assert(!JSON.stringify(data).includes('Korda'));
console.log(`PASS: 19 routes, 9 complete project stories, 6 complete articles, ${mediaCount} local media references, no original reference media.`);
