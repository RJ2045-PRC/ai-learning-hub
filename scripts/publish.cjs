const {execFileSync}=require('child_process');
const path=require('path');
const root=path.resolve(__dirname,'..');
const run=(cmd,args)=>execFileSync(cmd,args,{cwd:root,stdio:'inherit'});
// 先取得远端更新；有冲突则停止，保留本地内容，禁止强推。
run('git',['fetch','origin']);
const ahead=execFileSync('git',['rev-list','--count','HEAD..origin/main'],{cwd:root,encoding:'utf8'}).trim();
if(ahead!=='0')throw Error('远端有新提交，请先合并后再发布；本地文件未删除。');
run('npm',['run','build']);
run('git',['add','README.md','能力路线图.md','package.json','package-lock.json','.gitignore','scripts','docs','日报','概念','日报索引.md','学习进度.md','学习台.html','学习台资源']);
const changed=execFileSync('git',['diff','--cached','--name-only'],{cwd:root,encoding:'utf8'}).trim();
if(changed){const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());run('git',['commit','-m',`Update AI learning journal ${date}`]);}
run('git',['push','origin','main']);
console.log('内容已上传；GitHub Pages部署成功后网址显示新内容。');
