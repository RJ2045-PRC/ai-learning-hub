const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs');
fs.mkdirSync(out,{recursive:true});
for(const dir of ['日报','概念'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
for(const file of ['学习台.html','学习进度.md','日报索引.md','能力路线图.md'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.copyFileSync(path.join(root,'学习台.html'),path.join(out,'index.html'));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('公开站点已构建到 docs/，保留 Markdown 下载及相对链接。');
