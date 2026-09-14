(()=>{
  const file=(location.pathname.split('/').pop()||'project.html').toLowerCase();
  const qs=new URLSearchParams(location.search);
  const allowed=['project.html','studio.html','producer.html','director.html','live-action.html','generation.html','post.html','review.html','delivery.html'];
  if(!allowed.includes(file))return;

  const DEMO_KEY='reelops_investor_demo_mode';
  const isEntry=file==='project.html';
  if(qs.get('demo')==='1')sessionStorage.setItem(DEMO_KEY,'1');
  let enabled=sessionStorage.getItem(DEMO_KEY)==='1';
  if(!isEntry&&!enabled)return;

  const chapters=[
    {n:1,k:'PROJECT TRUTH',title:'先讲项目，而不是功能。',point:'ReelOps 先回答项目现在在哪里、谁要动作、哪些确认还没闭环。',files:['project.html','studio.html','producer.html']},
    {n:2,k:'CREATIVE DECISION',title:'客户确认创意，但不进入导演后台。',point:'内部 Director Workspace 很复杂；客户只看到发布后的 Brief、Treatment、Storyboard 与 Shot Direction。',files:['director.html']},
    {n:3,k:'HYBRID PRODUCTION',title:'实拍与 AI 是同一个 Shot 的不同生产来源。',point:'AI Ready → Generation Job → Variant → Selected Asset。ReelOps 不把生成结果直接叫 Version。',files:['live-action.html','generation.html']},
    {n:4,k:'VERSION RECORD',title:'Working Composite 不是正式版本。',point:'Asset → Working Composite → V4 Draft → V4 In Review → Version Approval。',files:['post.html','review.html']},
    {n:5,k:'DELIVERY CLOSURE',title:'Approved 之后，项目仍然没有结束。',point:'Final Master → Deliverables → Delivery Record → Archive，项目才真正闭环。',files:['delivery.html']}
  ];

  function state(){try{return window.ReelOpsState?.get?.()||{}}catch(e){return {}}}
  function reviewStage(){return qs.get('stage')==='creative'?'creative':'versions'}
  function currentChapter(){
    if(file==='review.html') return reviewStage()==='creative'?chapters[1]:chapters[3];
    return chapters.find(c=>c.files.includes(file))||chapters[0];
  }
  function nextFor(){
    const s=state();
    if(file==='project.html'||file==='studio.html'||file==='producer.html')return {href:'director.html',label:'进入导演 / 创意 →',ready:true,need:'先从 Project Truth 开始。'};
    if(file==='director.html')return {href:'review.html?stage=creative&demo=1',label:'进入客户创意审阅 →',ready:!!s.creativeSubmitted,need:'先选择客户可见内容，并点击「提交客户创意审阅」。'};
    if(file==='review.html'&&reviewStage()==='creative')return {href:'live-action.html?demo=1',label:'进入实拍 + AI →',ready:!!s.creativeApproval,need:'先点击「确认创意方向」，创建 Creative Approval Record。'};
    if(file==='live-action.html')return {href:'generation.html?demo=1',label:'进入 AIGC 制作 →',ready:!!s.packageSent,need:'先补齐 AI Ready，并把 SHOT 08 AI 制作包发送给 AIGC。'};
    if(file==='generation.html')return {href:'post.html?demo=1',label:'进入后期制作 →',ready:!!s.genAsset,need:'先选择 Variant，并明确加入 SHOT 08 Assets。'};
    if(file==='post.html')return {href:'review.html?stage=versions&demo=1',label:'进入客户成片审阅 →',ready:!!s.v4Submitted,need:'先建立 Working Composite、处理反馈、生成 V4 Draft，再正式提交 V4。'};
    if(file==='review.html'&&reviewStage()==='versions')return {href:'delivery.html?demo=1',label:'进入交付与归档 →',ready:!!s.approval,need:'先点击「确认 V4」，创建独立 Version Approval Record。'};
    if(file==='delivery.html')return {href:'project.html?demo=1',label:'回到 Project Overview',ready:!!s.archived,need:'完成 Final Master、Deliverables、Delivery Record 与 Archive。'};
    return {href:'project.html?demo=1',label:'回到 Project',ready:true,need:''};
  }

  const launch=document.createElement('button');
  launch.className='demoLaunch';launch.type='button';launch.textContent=enabled?'投资人演示':'开启投资人演示';
  const guide=document.createElement('aside');guide.className='demoGuide';guide.setAttribute('aria-label','投资人演示讲解');
  document.body.append(launch,guide);

  function setEnabled(v){enabled=v;if(v){sessionStorage.setItem(DEMO_KEY,'1');document.body.classList.add('demoMode');launch.textContent='投资人演示';}else{sessionStorage.removeItem(DEMO_KEY);document.body.classList.remove('demoMode');launch.textContent='开启投资人演示';guide.classList.remove('open')}}
  if(enabled)document.body.classList.add('demoMode');

  function render(){
    const c=currentChapter(),next=nextFor();
    guide.innerHTML=`<div class="demoGuideHead"><div class="demoGuideHeadTop"><b>ReelOps · 3–5 分钟投资人 Demo</b><span>${c.n} / 5</span></div><div class="demoGuideProgress"><i style="width:${c.n/5*100}%"></i></div></div><div class="demoGuideBody"><div class="k">${c.k}</div><h3>${c.title}</h3><p>${c.point}</p><div class="demoGuidePoint"><b>${next.ready?'本页主动作已完成':'本页先做这一件事'}</b>${next.ready?'可以继续下一段演示。':next.need}</div></div><div class="demoGuideFoot"><button class="quiet" data-action="reset">重置</button><button data-action="close">收起</button>${next.ready?`<a class="primary" href="${next.href}">${next.label}</a>`:`<button class="primary" disabled style="opacity:.38">完成主动作后继续</button>`}</div><div class="demoGuideHotkey">G：展开 / 收起 · 演示模式不会自动替你创建 Approval</div>`;
    guide.querySelector('[data-action="close"]')?.addEventListener('click',()=>guide.classList.remove('open'));
    guide.querySelector('[data-action="reset"]')?.addEventListener('click',()=>{window.ReelOpsState?.reset?.();sessionStorage.removeItem('reelops_startup_seen');sessionStorage.setItem(DEMO_KEY,'1');location.href='project.html?demo=1'});
  }

  launch.addEventListener('click',()=>{
    if(!enabled){setEnabled(true);render();guide.classList.add('open');return}
    render();guide.classList.toggle('open');
  });
  window.addEventListener('reelops:state',()=>{if(enabled)render()});
  window.addEventListener('keydown',e=>{if((e.key==='g'||e.key==='G')&&!e.metaKey&&!e.ctrlKey&&!e.altKey){if(!enabled)setEnabled(true);render();guide.classList.toggle('open')}});
  setEnabled(enabled);
  if(qs.get('demo')==='1'){render();setTimeout(()=>guide.classList.add('open'),220)}
})();
