/* 从 Markdown 重建自包含 HTML；无需联网或启动服务即可阅读。 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const {marked} = require('marked');
const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function render(s) {
  s = s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').replace(/<!--[\s\S]*?-->/g, '');
  // 知识库不依赖 Markdown 原始 HTML，避免将意外标签带入学习台。
  s = s.replace(/<[^>]*>/g, t => escape(t));
  return marked.parse(s);
}
const read = rel => fs.readFileSync(path.join(root,rel),'utf8');
const files = dir => fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.md'));
const visuals = JSON.parse(read('学习台资源/图解.json'));
const entries = files('日报').sort().reverse().map(file => {
 const md=read('日报/'+file), date=file.replace('.md','');
 const title=(md.match(/^# (.+)$/m)||[])[1]||date;
 const tags=((md.match(/^tags:\s*\[(.*?)\]/m)||[])[1]||'').split(',').map(s=>s.trim()).filter(Boolean);
 return {date,title,tags,html:render(md),text:md,path:'日报/'+file,visual:visuals[date]||null};
});
const concepts=files('概念').map(file=>({title:(read('概念/'+file).match(/^# (.+)$/m)||[])[1]||file,html:render(read('概念/'+file)),path:'概念/'+file}));
const progressText=read('学习进度.md');
const data={entries,concepts,roadmap:JSON.parse(read('学习台资源/学习路线.json')),progress:render(progressText),updated: new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'medium',timeStyle:'short'}).format(new Date())};
let html=read('学习台资源/模板.html');
html=html.replace('/*__KNOWLEDGE_DATA__*/', JSON.stringify(data).replace(/</g,'\\u003c'));
fs.writeFileSync(path.join(root,'学习台.html'),html);
console.log(`学习台已更新：${entries.length} 期日报，${concepts.length} 篇概念笔记。`);
