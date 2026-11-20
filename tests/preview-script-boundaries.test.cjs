'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('prototypes/fourteen-seals/index.html','utf8');
// The managed preview inserts its reload script at SVG closing tags, including
// literal tags inside inline JavaScript. Use a harmless equivalent insertion.
const rewritten=source.replace(/<\/svg>/g,'<script>void 0;</script></svg>');
const parser=String.raw`
import sys,json
from html.parser import HTMLParser
class Scripts(HTMLParser):
 def __init__(self):
  super().__init__();self.scripts=[];self.visible=[];self.current=None
 def handle_starttag(self,tag,attrs):
  if tag=='script':self.current=''
 def handle_endtag(self,tag):
  if tag=='script' and self.current is not None:self.scripts.append(self.current);self.current=None
 def handle_data(self,data):
  if self.current is not None:self.current+=data
  else:self.visible.append(data)
p=Scripts();p.feed(sys.stdin.read());p.close()
print(json.dumps({'scripts':p.scripts,'visible':p.visible}))
`;
test('SVG-aware preview rewriting cannot truncate or expose the cinematic application script',()=>{
 const result=spawnSync('python3',['-c',parser],{input:rewritten,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 const document=JSON.parse(result.stdout);
 const application=document.scripts.find(script=>script.includes('const portalAssets='));
 assert.ok(application,'The application remains one complete script');
 assert.doesNotThrow(()=>new vm.Script(application),'The actual HTML-parsed script remains valid JavaScript');
 assert.ok(application.includes('const data=[['),'The chamber definitions remain inside the script');
 assert.equal(document.visible.some(text=>text.includes('const data=[[')),false,'Application source never becomes page text');
});
test('all fourteen engraved SVGs retain their original complete output',()=>{
 const code=source.slice(source.indexOf('const engravings='),source.indexOf('const data='));
 const context={};vm.createContext(context);vm.runInContext(code,context);
 for(let i=0;i<14;i++){
  const svg=vm.runInContext('portalArt('+i+')',context);
  assert.match(svg,/^<svg /);assert.ok(svg.endsWith('</svg>'));
  assert.ok(svg.includes('<path')||svg.includes('<circle'));
 }
});
