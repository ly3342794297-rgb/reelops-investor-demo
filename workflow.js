(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const stages=[['project.html','Project'],['studio.html','Studio'],['director.html','导演'],['live-action.html','实拍+AI'],['generation.html','AIGC'],['post.html','后期'],['review.html','客户审阅'],['delivery.html','交付']];
    const internal=['studio.html','producer.html','director.html','live-action.html','generation.html','post.html','delivery.html'];
    const $=(s,r=document)=>r.querySelector(s),state=()=>ReelOpsState.get();
    const phase=s=>ReelOpsState.projectPhase(s),creative=s=>ReelOpsState.creativeLabel(s),shot=s=>ReelOpsState.shotLabel(s),delivery=s=>ReelOpsState.deliveryLabel(s);
    const fmt=v=>{if(!v)return '';try{return new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
    document.body.classList.add('page-enter');

    function nextAction(s){
      if(!s.creativeSubmitted)return {href:'director.html',label:'发布 Creative Direction',detail:'整理并发布客户可见的 Brief、Treatment、Storyboard 与 Reference。'};
      if(s.creativeChangesRequested)return {href:'director.html',label:'修订 Creative Direction',detail:'客户已要求修改创意方向，形成下一版后重新发布。'};
      if(!s.creativeApproval)return {href:'review.html?stage=creative',label:'获取 Creative Approval',detail:'客户确认创意方向后，正式 Production Gate 才打开。'};
      if(!s.aiReady)return {href:'live-action.html',label:'补齐 AI Ready',detail:'Capture Complete 不等于 AI Ready；补齐跟踪、灯光与相机上下文。'};
      if(!s.packageSent)return {href:'live-action.html',label:'发送 AI Production Package',detail:'把 Shot Intent、Preserve / Change 与现场输入一起交给生成制作。'};
      if(!s.genAsset)return {href:'generation.html',label:'选择 Selected Asset',detail:'Variant 被选择并写入 SHOT 08 Assets 后才改变项目状态。'};
      if(!s.workingComposite)return {href:'post.html',label:'建立 Working Composite',detail:'把实拍、AIGC 与 CG/Post Asset 汇入内部工作状态。'};
      if(!s.v3Submitted)return {href:'post.html',label:'正式提交 V3',detail:'Working Composite 不是 Version；先提交 V3 才能进入客户决策。'};
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return {href:'review.html?stage=versions',label:'等待 V3 客户决策',detail:'客户可以直接确认 V3，或者明确提出修改。'};
      if(s.v4ChangesRequested&&!s.approval)return {href:'post.html',label:'进入第二轮 Revision',detail:'V4 已要求修改。正式 Version 不覆盖；生产级下一正式版本应创建 V5。'};
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return {href:'post.html',label:'处理 V3 Feedback',detail:`还有 ${3-(s.feedbackResolved||0)} 条正式反馈未闭合。`};
      if(s.v3ChangesRequested&&!s.v4Draft)return {href:'post.html',label:'生成 V4 Draft',detail:'V3 Feedback 全部闭合后形成下一版 Draft。'};
      if(s.v4Draft&&!s.v4Submitted)return {href:'post.html',label:'正式提交 V4',detail:'Submit 后 V4 才进入 Client Review Space。'};
      if(s.v4Submitted&&!s.approval)return {href:'review.html?stage=versions',label:'获取 V4 Version Approval',detail:'客户对正式 V4 做独立 Version Decision。'};
      if(!s.finalMasterReady)return {href:'delivery.html',label:'生成 Final Master',detail:`${s.approvedVersion||'Approved Version'} 继续进入最终母版。`};
      if((s.deliveryItems||[]).filter(Boolean).length<4)return {href:'delivery.html',label:'补齐 Deliverables',detail:`当前 ${(s.deliveryItems||[]).filter(Boolean).length} / 4 Ready。`};
      if(!s.deliveryRecord)return {href:'delivery.html',label:'创建 Delivery Record',detail:'Ready 不等于 Delivered；客户交付需要独立记录。'};
      if(!s.archiveRecord)return {href:'delivery.html',label:'归档 Project Aurora',detail:'Archive 是项目最后一个生产状态。'};
      return {href:'project.html',label:'项目已闭环',detail:'Project Aurora 已形成完整 Production Record。'};
    }
    const tone=(done,current)=>done?'done':current?'current':'locked';

    function buildInspector(){
      if($('.shotInspector'))return;
      const overlay=document.createElement('div');overlay.className='shotInspectorOverlay';
      const drawer=document.createElement('aside');drawer.className='shotInspector';drawer.setAttribute('aria-label','SHOT 08 生产记录');drawer.innerHTML=`<div class="shotInspectorHead"><div><div class="siEyebrow">SHOT OBJECT · SHARED CONTEXT</div><h2>SHOT 08 · Hero Reveal</h2><p>页面与角色可以变化，但 SHOT 08 始终是同一个生产对象。</p></div><button class="siClose" type="button" aria-label="关闭">×</button></div><div class="shotInspectorBody"><section class="siSection"><div class="siSectionHead"><b>镜头意图</b><span>12s · Live Action + AIGC + CG/Post</span></div><p class="siCopy">主体从暗部进入暖金侧光，在最后两秒完成 Hero Reveal。人物与产品保持真实，环境允许克制延展。</p><div class="siRules"><div><small>必须保留</small><b>人物身份 · 产品结构 · 镜头运动 · 暖金侧光</b></div><div><small>允许改变</small><b>背景空间 · 环境细节 · 空间尺度 · 氛围</b></div></div></section><section class="siSection"><div class="siSectionHead"><b>生产对象链</b><span>Variant ≠ Asset ≠ Composite ≠ Version ≠ Approval</span></div><div class="siLineage" data-si="lineage"></div></section><section class="siSection"><div class="siSectionHead"><b>当前下一动作</b><span>只显示会改变生产状态的动作</span></div><a class="siNext" data-si="next" href="#"><b></b><span></span><i>打开 →</i></a></section><section class="siSection"><div class="siSectionHead"><b>Production Log</b><span>关键状态事件，不是聊天记录</span></div><div class="siLog" data-si="log"></div></section><section class="siSection"><div class="siSectionHead"><b>进入工作位置</b><span>同一 Shot，不同角色视角</span></div><div class="siLinks"><a href="director.html">导演 / 创意</a><a href="live-action.html">实拍 + AI</a><a href="generation.html">AIGC</a><a href="post.html">后期</a><a href="review.html?stage=versions">客户审阅 ↗</a></div></section></div>`;
      document.body.append(overlay,drawer);
      const close=()=>{overlay.classList.remove('open');drawer.classList.remove('open');document.body.classList.remove('shotInspectorOpen')};
      const open=()=>{renderInspector();overlay.classList.add('open');drawer.classList.add('open');document.body.classList.add('shotInspectorOpen')};
      overlay.addEventListener('click',close);$('.siClose',drawer).addEventListener('click',close);window.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.ReelOpsShotInspector={open,close,render:renderInspector};
    }

    function renderInspector(){
      const drawer=$('.shotInspector');if(!drawer)return;const s=state(),reviewCurrent=!!(!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted));
      const lineage=[
        ['Creative',s.creativeApproval?'Approved':s.creativeSubmitted?'In Review':'Internal',!!s.creativeApproval,!!s.creativeSubmitted&&!s.creativeApproval],
        ['AI Ready',s.aiReady?'Ready':'Pending',!!s.aiReady,!!s.creativeApproval&&!s.aiReady],
        ['Asset',s.genAsset?'Selected':'Pending',!!s.genAsset,!!s.packageSent&&!s.genAsset],
        ['Composite',s.workingComposite?'Created':'Pending',!!s.workingComposite,!!s.genAsset&&!s.workingComposite],
        ['Version',shot(s),!!(s.v3Submitted||s.v4Draft||s.v4Submitted||s.approval),!!(!s.approval&&(s.v3Submitted||s.v4Draft||s.v4Submitted||s.v4ChangesRequested))],
        ['Approval',s.approval?`${s.approvedVersion||'V4'} · Recorded`:'Pending',!!s.approval,reviewCurrent],
        ['Delivery',delivery(s),!!(s.deliveryRecord||s.archiveRecord),!!s.approval&&!s.deliveryRecord]
      ];
      $('[data-si="lineage"]',drawer).innerHTML=lineage.map((x,i)=>`<div class="siObj ${tone(x[2],x[3])}"><small>0${i+1} · ${x[0]}</small><b>${x[1]}</b></div>`).join('');
      const n=nextAction(s),next=$('[data-si="next"]',drawer);next.href=n.href;$('b',next).textContent=n.label;$('span',next).textContent=n.detail;
      const events=[
        ['Brief / Shot Intent','已建立',true,''],
        [`Creative Direction ${s.creativeVersion||'V2'}`,s.creativeApproval?'Approved':s.creativeChangesRequested?'Changes Requested':s.creativeSubmitted?'In Review':'Internal Draft',!!(s.creativeSubmitted||s.creativeApproval),fmt(s.creativeApprovalAt||s.creativeChangesAt||s.creativeSubmittedAt)],
        ['AI Ready',s.aiReady?'Ready':'Pending',!!s.aiReady,fmt(s.aiReadyAt)],
        ['AI Production Package',s.packageSent?'Sent':'Pending',!!s.packageSent,fmt(s.packageSentAt)],
        ['Selected Asset',s.genAsset?`Variant ${s.selectedVariant||'B'} · Linked`:'Pending',!!s.genAsset,fmt(s.genAssetAt)],
        ['Working Composite',s.workingComposite?'Created · Internal':'Pending',!!s.workingComposite,fmt(s.workingCompositeAt)],
        ['V3',s.approval&&s.approvedVersion==='V3'?'Approved':s.v3ChangesRequested?'Changes Requested':s.v3Submitted?'In Review':'Not submitted',!!s.v3Submitted,s.approval&&s.approvedVersion==='V3'?fmt(s.approvalAt):fmt(s.v3ChangesAt||s.v3SubmittedAt)],
        ['V4',s.approval&&s.approvedVersion==='V4'?'Approved':s.v4ChangesRequested?'Changes Requested':s.v4Submitted?'In Review':s.v4Draft?'Draft':'Not created',!!(s.v4Draft||s.v4Submitted||s.v4ChangesRequested||s.approval&&s.approvedVersion==='V4'),s.approval&&s.approvedVersion==='V4'?fmt(s.approvalAt):fmt(s.v4ChangesAt||s.v4SubmittedAt)],
        ['Final Master',s.finalMasterReady?'Ready':'Pending',!!s.finalMasterReady,fmt(s.finalMasterAt)],
        ['Delivery Record',s.deliveryRecord?'DLV-AURORA-001 · Complete':'Pending',!!s.deliveryRecord,fmt(s.deliveryRecordAt)],
        ['Archive Record',s.archiveRecord?'ARC-AURORA-001 · Archived':'Pending',!!s.archiveRecord,fmt(s.archiveAt)]
      ];
      $('[data-si="log"]',drawer).innerHTML=events.map(x=>`<div class="siLogRow ${x[2]?'recorded':''}"><span class="siLogDot"></span><div><b>${x[0]}</b><span>${x[1]}</span></div><time>${x[3]||''}</time></div>`).join('');
    }

    if(internal.includes(file)&&!$('.projectContextBar')){
      const header=$('.appTop')||$('.studioTop');if(header){buildInspector();const bar=document.createElement('div');bar.className='projectContextBar';bar.innerHTML=`<a class="pcbProject" href="project.html"><span class="pcbDot"></span><b>Project Aurora</b></a><span class="pcbItem"><small>PHASE</small><b data-pcb="phase"></b></span><span class="pcbItem"><small>CREATIVE</small><b data-pcb="creative"></b></span><button class="pcbShotButton" type="button"><small>SHOT 08</small><b data-pcb="shot"></b><span>⌘</span></button><span class="pcbSpacer"></span><a class="pcbControl" href="producer.html">制片统筹</a>`;header.insertAdjacentElement('afterend',bar);$('.pcbShotButton',bar).addEventListener('click',()=>window.ReelOpsShotInspector?.open?.());const render=()=>{const s=state();$('[data-pcb="phase"]',bar).textContent=phase(s);const c=$('[data-pcb="creative"]',bar);c.textContent=s.creativeApproval?`${s.creativeVersion||'V2'} · Approved`:s.creativeChangesRequested?`${s.creativeVersion||'V2'} · Changes`:s.creativeSubmitted?`${s.creativeVersion||'V2'} · In Review`:`${s.creativeVersion||'V2'} · Draft`;c.dataset.tone=s.creativeApproval?'ok':s.creativeSubmitted||s.creativeChangesRequested?'wait':'muted';const sh=$('[data-pcb="shot"]',bar);sh.textContent=shot(s);sh.dataset.tone=s.approval?'ok':s.v3Submitted||s.v4Draft||s.v4Submitted||s.v4ChangesRequested?'active':s.creativeApproval?'muted':'wait';$('.pcbControl',bar).classList.toggle('active',file==='producer.html');renderInspector()};render();window.addEventListener('reelops:state',render)}
    }

    if(file==='review.html')return;
    const idx=stages.findIndex(([p])=>p===file);if(idx<0||$('.flowDock'))return;
    const nav=document.createElement('nav');nav.className='flowDock';nav.setAttribute('aria-label','ReelOps Golden Path');stages.forEach(([p,label],i)=>{const a=document.createElement('a');a.href=p;a.textContent=label;if(i===idx)a.classList.add('active');if(p==='review.html')a.classList.add('external');nav.appendChild(a)});const meta=document.createElement('span');meta.className='flowMeta';nav.appendChild(meta);document.body.appendChild(nav);
    const renderMeta=()=>meta.textContent=`Project Aurora · ${phase(state())}`;renderMeta();window.addEventListener('reelops:state',renderMeta);
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();document.body.classList.add('is-leaving');setTimeout(()=>location.href=a.href,130)}));window.addEventListener('pageshow',()=>document.body.classList.remove('is-leaving'));
  });
})();