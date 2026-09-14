(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const stages=[['project.html','Project'],['studio.html','Studio'],['director.html','导演'],['live-action.html','实拍+AI'],['generation.html','AIGC'],['post.html','后期'],['review.html','客户审阅'],['delivery.html','交付']];
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const internalFiles=['studio.html','producer.html','director.html','live-action.html','generation.html','post.html','delivery.html'];
    const $=(s,r=document)=>r.querySelector(s);
    document.body.classList.add('page-enter');
    function state(){try{return window.ReelOpsState?.get?.()||{}}catch(e){return {}}}
    function phase(s){try{return window.ReelOpsState?.projectPhase?.(s)||'Production'}catch(e){return 'Production'}}
    function creativeText(s){const v=s.creativeVersion||'V2';if(s.creativeApproval)return `${v} · Approved`;if(s.creativeChangesRequested)return `${v} · Changes`;if(s.creativeSubmitted)return `${v} · In Review`;return `${v} · Draft`}
    function creativeTone(s){return s.creativeApproval?'ok':(s.creativeSubmitted||s.creativeChangesRequested)?'wait':'muted'}
    function shotText(s){if(!s.creativeApproval)return s.creativeSubmitted?'Creative · In Review':'Creative · Pending';try{return window.ReelOpsState?.shotLabel?.(s)||'Production'}catch(e){return 'Production'}}
    function shotTone(s){return !s.creativeApproval?(s.creativeSubmitted?'wait':'muted'):s.approval?'ok':(s.v4Submitted||s.v3Submitted&&!s.v3ChangesRequested)?'wait':(s.v4Draft||s.v3ChangesRequested||s.workingComposite)?'active':'muted'}
    function deliveryText(s){try{return window.ReelOpsState?.deliveryLabel?.(s)||'Waiting'}catch(e){return 'Waiting'}}
    function fmt(v){if(!v)return '';try{return new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
    function nextAction(s){
      if(!s.creativeSubmitted)return {href:'director.html',label:'发布 Creative Direction',detail:'先由导演选择客户可见的 Brief、Treatment、Storyboard 与 Reference。'};
      if(s.creativeChangesRequested)return {href:'director.html',label:'处理创意修改',detail:'客户已经要求调整创意方向，形成下一版 Creative Direction。'};
      if(!s.creativeApproval)return {href:'review.html?stage=creative',label:'等待 / 获取 Creative Approval',detail:'创意方向需要由客户单独确认，正式制作 Gate 才打开。'};
      if(!s.aiReady)return {href:'live-action.html',label:'补齐 AI Ready',detail:'拍摄完成不等于 AI Ready；先补齐现场输入与参考。'};
      if(!s.packageSent)return {href:'live-action.html',label:'发送 AI 制作包',detail:'把 Shot Intent、Preserve / Change 和现场素材一起交给 AIGC。'};
      if(!s.genAsset)return {href:'generation.html',label:'选择生产 Asset',detail:'Variant 只是候选结果；选择后加入 SHOT 08 Assets。'};
      if(!s.workingComposite)return {href:'post.html',label:'建立 Working Composite',detail:'把实拍、AIGC 和 CG/Post 素材汇入内部工作状态。'};
      if(!s.v3Submitted)return {href:'post.html',label:'正式提交 V3',detail:'Working Composite 不是 Version；先提交 V3，客户反馈才有明确版本归属。'};
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return {href:'review.html?stage=versions',label:'等待 V3 客户决策',detail:'客户可以确认 V3，或明确提出修改。后期不能预先制造反馈。'};
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return {href:'post.html',label:'处理 V3 客户反馈',detail:`还有 ${3-(s.feedbackResolved||0)} 条正式反馈未闭合。`};
      if(s.v3ChangesRequested&&!s.v4Draft)return {href:'post.html',label:'生成 V4 Draft',detail:'3 条 V3 反馈闭合后，再形成下一版草稿。'};
      if(s.v4Draft&&!s.v4Submitted)return {href:'post.html',label:'提交 V4 给客户',detail:'提交后 V4 才进入 In Review。'};
      if(s.v4Submitted&&!s.approval)return {href:'review.html?stage=versions',label:'等待 V4 Version Approval',detail:'客户对正式 V4 做最终版本决策。'};
      if(!s.finalMasterReady)return {href:'delivery.html',label:'生成 Final Master',detail:'Approved Version 继续进入最终母版。'};
      if((s.deliverables||0)<4)return {href:'delivery.html',label:'补齐 Deliverables',detail:`当前 ${s.deliverables||0} / 4 Ready。`};
      if(!s.deliveryRecord)return {href:'delivery.html',label:'创建 Delivery Record',detail:'Ready 不等于 Delivered，完成交付需要独立记录。'};
      if(!s.archiveRecord)return {href:'delivery.html',label:'归档 Project Aurora',detail:'保留 Creative、Production、Version、Approval 与 Delivery 的完整关系。'};
      return {href:'project.html',label:'项目已闭环',detail:'Project Aurora 已归档，完整生产记录已形成。'};
    }
    function objectTone(done,current){return done?'done':current?'current':'locked'}
    function buildInspector(){
      if(document.querySelector('.shotInspector'))return;
      const overlay=document.createElement('div');overlay.className='shotInspectorOverlay';
      const drawer=document.createElement('aside');drawer.className='shotInspector';drawer.setAttribute('aria-label','SHOT 08 生产记录');drawer.innerHTML=`<div class="shotInspectorHead"><div><div class="siEyebrow">SHOT OBJECT · SHARED CONTEXT</div><h2>SHOT 08 · Hero Reveal</h2><p>同一个 Shot 在导演、实拍、AIGC、后期与客户审阅之间保持同一身份。</p></div><button class="siClose" type="button" aria-label="关闭">×</button></div><div class="shotInspectorBody"><section class="siSection"><div class="siSectionHead"><b>镜头意图</b><span>12s · Live Action + AIGC + CG/Post</span></div><p class="siCopy">主体从暗部进入暖金侧光，在最后两秒完成 Hero Reveal。人物与产品保持真实，环境允许克制延展。</p><div class="siRules"><div><small>必须保留</small><b>人物身份 · 产品结构 · 镜头运动 · 暖金侧光</b></div><div><small>允许改变</small><b>背景空间 · 环境细节 · 空间尺度 · 氛围</b></div></div></section><section class="siSection"><div class="siSectionHead"><b>生产对象链</b><span>Variant ≠ Asset ≠ Composite ≠ Version ≠ Approval</span></div><div class="siLineage" data-si="lineage"></div></section><section class="siSection"><div class="siSectionHead"><b>当前下一动作</b><span>只显示会改变生产状态的动作</span></div><a class="siNext" data-si="next" href="#"><b></b><span></span><i>打开 →</i></a></section><section class="siSection"><div class="siSectionHead"><b>Production Log</b><span>关键状态事件，不是聊天记录</span></div><div class="siLog" data-si="log"></div></section><section class="siSection"><div class="siSectionHead"><b>进入工作位置</b><span>同一 Shot，不同角色视角</span></div><div class="siLinks"><a href="director.html">导演 / 创意</a><a href="live-action.html">实拍 + AI</a><a href="generation.html">AIGC</a><a href="post.html">后期</a><a href="review.html?stage=versions">客户审阅 ↗</a></div></section></div>`;
      document.body.append(overlay,drawer);
      const close=()=>{drawer.classList.remove('open');overlay.classList.remove('open');document.body.classList.remove('shotInspectorOpen')};
      const open=()=>{renderInspector();drawer.classList.add('open');overlay.classList.add('open');document.body.classList.add('shotInspectorOpen')};
      overlay.addEventListener('click',close);drawer.querySelector('.siClose').addEventListener('click',close);window.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.ReelOpsShotInspector={open,close,render:renderInspector};
    }
    function renderInspector(){
      const drawer=document.querySelector('.shotInspector');if(!drawer)return;const s=state();
      const hasVersion=!!(s.v3Submitted||s.v4Draft||s.v4Submitted||s.approval);
      const versionCurrent=!!(!s.approval&&(s.v3Submitted||s.v4Draft||s.v4Submitted));
      const approvalCurrent=!!(!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted));
      const lineage=[['Creative',creativeText(s),s.creativeApproval,s.creativeSubmitted&&!s.creativeApproval],['AI Ready',s.aiReady?'Ready':'Pending',s.aiReady,s.creativeApproval&&!s.aiReady],['Asset',s.genAsset?'Selected':'Pending',s.genAsset,s.packageSent&&!s.genAsset],['Composite',s.workingComposite?'Created':'Pending',s.workingComposite,s.genAsset&&!s.workingComposite],['Version',s.creativeApproval?shotText(s):'Locked',hasVersion,versionCurrent],['Approval',s.approval?`${s.approvedVersion||'V4'} · Recorded`:'Pending',s.approval,approvalCurrent],['Delivery',deliveryText(s),!!s.deliveryRecord||!!s.archiveRecord,!!s.approval&&!s.deliveryRecord]];
      drawer.querySelector('[data-si="lineage"]').innerHTML=lineage.map((x,i)=>`<div class="siObj ${objectTone(x[2],x[3])}"><small>0${i+1} · ${x[0]}</small><b>${x[1]}</b></div>`).join('');
      const next=nextAction(s),nextEl=drawer.querySelector('[data-si="next"]');nextEl.href=next.href;nextEl.querySelector('b').textContent=next.label;nextEl.querySelector('span').textContent=next.detail;
      const events=[['Brief / Shot Intent','已建立',true,''],['Creative Direction '+(s.creativeVersion||'V2'),s.creativeApproval?'客户已确认':s.creativeSubmitted?'已发布客户':'内部草稿',s.creativeSubmitted||s.creativeApproval,s.creativeApprovalAt?fmt(s.creativeApprovalAt):''],['AI Ready Package',s.packageSent?'已发送 AIGC':s.aiReady?'已就绪':'待补齐',s.aiReady||s.packageSent,''],['AIGC Selected Asset',s.genAsset?'Variant '+(s.selectedVariant||'B')+' 已加入 Assets':'尚未选择',s.genAsset,''],['Working Composite',s.workingComposite?'已建立 · Internal':'尚未建立',s.workingComposite,''],['V3',s.approval&&s.approvedVersion==='V3'?'Approved':s.v3ChangesRequested?'Changes Requested':s.v3Submitted?'In Review':'尚未提交',s.v3Submitted,s.approval&&s.approvedVersion==='V3'?fmt(s.approvalAt):s.v3ChangesAt?fmt(s.v3ChangesAt):s.v3SubmittedAt?fmt(s.v3SubmittedAt):''],['V4',s.approval&&s.approvedVersion==='V4'?'Approved':s.v4Submitted?'In Review':s.v4Draft?'Draft':'尚未创建',s.v4Draft||s.v4Submitted||s.approval&&s.approvedVersion==='V4',s.approval&&s.approvedVersion==='V4'?fmt(s.approvalAt):s.v4SubmittedAt?fmt(s.v4SubmittedAt):''],['Final Master',s.finalMasterReady?'Ready':'Pending',s.finalMasterReady,''],['Delivery Record',s.deliveryRecord?'DLV-AURORA-001 · Complete':'Pending',s.deliveryRecord,s.deliveryRecordAt?fmt(s.deliveryRecordAt):''],['Archive Record',s.archiveRecord?'ARC-AURORA-001 · Archived':'Pending',s.archiveRecord,s.archiveAt?fmt(s.archiveAt):'']];
      drawer.querySelector('[data-si="log"]').innerHTML=events.map(x=>`<div class="siLogRow ${x[2]?'recorded':''}"><span class="siLogDot"></span><div><b>${x[0]}</b><span>${x[1]}</span></div><time>${x[3]||''}</time></div>`).join('');
    }
    if(internalFiles.includes(file)&&!document.querySelector('.projectContextBar')){
      const header=$('.appTop')||$('.studioTop');if(header){buildInspector();const bar=document.createElement('div');bar.className='projectContextBar';bar.innerHTML=`<a class="pcbProject" href="project.html"><span class="pcbDot"></span><b>Project Aurora</b></a><span class="pcbItem"><small>PHASE</small><b data-pcb="phase">Production</b></span><span class="pcbItem"><small>CREATIVE</small><b data-pcb="creative">V2 · Draft</b></span><button class="pcbShotButton" type="button" aria-label="打开 SHOT 08 生产记录"><small>SHOT 08</small><b data-pcb="shot">Creative · Pending</b><span>⌘</span></button><span class="pcbSpacer"></span><a class="pcbControl" href="producer.html">制片统筹</a>`;header.insertAdjacentElement('afterend',bar);bar.querySelector('.pcbShotButton').addEventListener('click',()=>window.ReelOpsShotInspector?.open?.());const renderContext=()=>{const s=state(),p=$('[data-pcb="phase"]',bar),c=$('[data-pcb="creative"]',bar),sh=$('[data-pcb="shot"]',bar);if(p)p.textContent=phase(s);if(c){c.textContent=creativeText(s);c.dataset.tone=creativeTone(s)}if(sh){sh.textContent=shotText(s);sh.dataset.tone=shotTone(s)}bar.querySelector('.pcbControl')?.classList.toggle('active',file==='producer.html');renderInspector()};renderContext();window.addEventListener('reelops:state',renderContext)}
    }
    if(file==='review.html')return;
    const idx=stages.findIndex(([p])=>p===file);if(idx<0||document.querySelector('.flowDock'))return;const nav=document.createElement('nav');nav.className='flowDock';nav.setAttribute('aria-label','ReelOps Golden Path');stages.forEach(([p,label],i)=>{const a=document.createElement('a');a.href=p;a.textContent=label;if(i===idx)a.classList.add('active');if(p==='review.html')a.classList.add('external');nav.appendChild(a)});const meta=document.createElement('span');meta.className='flowMeta';nav.appendChild(meta);document.body.appendChild(nav);const renderMeta=()=>{const s=state();meta.textContent='Project Aurora · '+phase(s)};renderMeta();window.addEventListener('reelops:state',renderMeta);nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const href=a.getAttribute('href');if(!href)return;e.preventDefault();document.body.classList.add('is-leaving');setTimeout(()=>location.href=href,135)}));window.addEventListener('pageshow',()=>document.body.classList.remove('is-leaving'));
  });
})();