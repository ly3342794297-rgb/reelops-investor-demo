(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState.get();
    document.body.classList.add('reelopsFinalPass');

    function next(s){
      if(!s.creativeSubmitted||s.creativeChangesRequested)return ['导演 / 创意','director.html','发布或修订 Creative Direction'];
      if(!s.creativeApproval)return ['客户创意审阅','review.html?stage=creative','完成 Creative Approval'];
      if(!s.aiReady)return ['实拍 + AI','live-action.html','补齐 AI Ready'];
      if(!s.packageSent)return ['实拍 + AI','live-action.html','发送 AI Production Package'];
      if(!s.genAsset)return ['AIGC 生成','generation.html','选择并写入 Selected Asset'];
      if(!s.workingComposite)return ['后期制作','post.html','建立 Working Composite'];
      if(!s.v3Submitted)return ['后期制作','post.html','正式提交 V3'];
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return ['客户成片审阅','review.html?stage=versions','V3 客户决策'];
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return ['后期制作','post.html',`处理 V3 Feedback · ${s.feedbackResolved||0}/3`];
      if(s.v3ChangesRequested&&!s.v4Draft)return ['后期制作','post.html','生成 V4 Draft'];
      if(s.v4Draft&&!s.v4Submitted&&!s.v4ChangesRequested)return ['后期制作','post.html','正式提交 V4'];
      if(s.v4Submitted&&!s.approval)return ['客户成片审阅','review.html?stage=versions','V4 Version Approval'];
      if(s.v4ChangesRequested&&!s.approval)return ['后期制作','post.html','第二轮 Revision · 下一正式版本应为 V5'];
      if(!s.finalMasterReady)return ['交付与归档','delivery.html','生成 Final Master'];
      if((s.deliveryItems||[]).filter(Boolean).length<4)return ['交付与归档','delivery.html','补齐 Deliverables'];
      if(!s.deliveryRecord)return ['交付与归档','delivery.html','创建 Delivery Record'];
      if(!s.archiveRecord)return ['交付与归档','delivery.html','创建 Archive Record'];
      return ['Project Overview','project.html','Project Aurora 已闭环'];
    }
    const stage=(title,done,current,detail)=>`<div class="stage ${done?'done':current?'current':'locked'}"><div class="n"></div><b>${title}</b><span>${detail}</span></div>`;
    const pstage=(title,done,current,detail,i)=>`<div class="stageCard ${done?'done':current?'current':'locked'}"><span class="n">0${i}</span><b>${title}</b><span>${detail}</span></div>`;

    function project(s){
      if(file!=='project.html')return;
      const hero=$('#heroShot'),summary=$('#summaryShot'),delivery=$('#summaryDelivery'),phase=$('#summaryPhase'),header=$('#headerPhase'),client=$('#summaryClient');
      const shot=ReelOpsState.shotLabel(s),p=ReelOpsState.projectPhase(s),n=next(s),approved=s.approvedVersion||'V4',ready=(s.deliveryItems||[]).filter(Boolean).length;
      if(hero)hero.textContent='SHOT 08 · '+shot;if(summary)summary.textContent=shot;if(delivery)delivery.textContent=ReelOpsState.deliveryLabel(s);if(phase)phase.textContent=p;if(header)header.textContent=p;
      if(client)client.textContent=s.approval?`${approved} · Version Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · Waiting for client':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · Waiting for client':s.creativeChangesRequested?'Creative Direction · Changes Requested':s.creativeApproval?'Creative Approved · 成片未提交':s.creativeSubmitted?'Creative Direction · Waiting for client':'Creative Direction · Not published';
      const truth=$('.projectTruthBar');if(truth)truth.innerHTML=`<div class="ptLead"><span>PROJECT TRUTH</span><b>${p}</b></div><div class="ptMain"><small>NEXT STATE CHANGE</small><strong>${n[2]}</strong><p>下一责任人 · ${n[0]}</p></div><a href="${n[1]}">打开当前动作 →</a>`;
      const rail=$('#stageRail');if(rail){const reviewNow=!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted),postNow=!!(s.genAsset&&!s.v3Submitted||s.v3ChangesRequested&&!s.v4Submitted||s.v4Draft&&!s.v4Submitted||s.v4ChangesRequested);rail.innerHTML=[stage('Creative',!!s.creativeApproval,!s.creativeApproval,'Brief / Treatment / Creative Approval'),stage('Production',!!s.genAsset,!!s.creativeApproval&&!s.genAsset,'Capture / AI Ready / Selected Asset'),stage('Post',!!s.approval||!!s.v4Submitted||!!(s.v3Submitted&&!s.v3ChangesRequested),postNow,'Working Composite / Revision / Version'),stage('Client Decision',!!s.approval,reviewNow,'V3 / V4 · Review & Approval'),stage('Delivery',!!s.archiveRecord,!!s.approval&&!s.archiveRecord,'Final Master / Delivery / Archive')].map((x,i)=>x.replace('<div class="n"></div>',`<div class="n">0${i+1}</div>`)).join('')}
      const health=$('#healthGrid');if(health){const versionState=s.approval?[`good`,`${approved} Approved`,'Version Approval Record 已形成']:s.v4ChangesRequested?['attn','V4 Changes','下一正式版本应创建 V5']:s.v4Submitted?['wait','V4 In Review','等待客户版本决策']:s.v4Draft?['attn','V4 Draft','尚未正式提交']:s.v3ChangesRequested?['attn','V3 Changes','Revision 正在处理']:s.v3Submitted?['wait','V3 In Review','等待客户首次版本决策']:s.workingComposite?['attn','Composite','内部工作状态']:['','Not ready','尚未形成正式 Version'];const creative=s.creativeApproval?['good','Approved',`${s.creativeVersion||'V2'} 已锁定`]:s.creativeChangesRequested?['attn','Changes Requested','等待导演形成并重新提交下一版 Creative Direction']:s.creativeSubmitted?['wait','Waiting','等待客户创意决策']:['attn','Not published','创意方向尚未发布'];const capture=s.aiReady?['good','AI Ready',s.packageSent?'AI Production Package 已发送':'现场输入已齐套']:s.creativeApproval?['attn','Missing inputs','AI Ready 尚未闭合']:['','Locked','等待 Creative Approval'];const d=s.archiveRecord?['good','Archived','项目记录已闭环']:s.deliveryRecord?['good','Delivered','Delivery Record 已完成']:s.finalMasterReady?['attn',`${ready}/4 Ready`,'Deliverables 尚未闭合']:s.approval?['attn','Final Master Pending',`${approved} Approved → Final Master`]:['','Locked','等待 Version Approval'];health.innerHTML=[["CREATIVE",...creative],["AI READY",...capture],["VERSION",...versionState],["DELIVERY",...d]].map(x=>`<div class="health ${x[1]}"><div class="k">${x[0]}</div><strong>${x[2]}</strong><span>${x[3]}</span></div>`).join('')}
      const record=$('.recordChain');if(record&&!$('.finalHierarchyNote'))record.insertAdjacentHTML('afterend','<div class="finalHierarchyNote">Project Overview 只保留项目事实：当前阶段、下一责任人、阻塞与生产对象关系。具体工作留在角色工作区。</div>');
      const asset=$('#recordAsset'),composite=$('#recordComposite'),version=$('#recordVersion'),approval=$('#recordApproval'),recordDelivery=$('#recordDelivery'),reviewNow=!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted);if(asset)asset.className='recordObj '+(s.genAsset?'done':s.packageSent?'live':'');if(composite)composite.className='recordObj '+(s.workingComposite?'done':s.genAsset?'live':'');if(version)version.className='recordObj '+(s.v3Submitted||s.v4Submitted||s.v4ChangesRequested||s.approval?'done':s.workingComposite?'live':'');if(approval)approval.className='recordObj '+(s.approval?'done':reviewNow?'live':'');if(recordDelivery)recordDelivery.className='recordObj '+(s.deliveryRecord||s.archiveRecord?'done':s.approval?'live':'');
    }

    function producer(s){
      if(file!=='producer.html')return;
      $$('.shotTable .shotRow').forEach(r=>{if(!r.classList.contains('head')&&!r.classList.contains('focus'))r.classList.add('finalHidden')});
      const cp=$('#creativePulseValue'),cps=$('#creativePulseSub'),sp=$('#shotPulseValue'),sps=$('#shotPulseSub'),dp=$('#deliveryPulseValue'),dps=$('#deliveryPulseSub'),client=$('#clientPulseValue'),clientSub=$('#clientPulseSub'),vApproval=$('#versionApprovalState'),cApproval=$('#creativeApprovalState');
      if(cp)cp.textContent=s.creativeApproval?'Approved':s.creativeChangesRequested?'Needs revision':s.creativeSubmitted?'等待客户':'Internal';if(cps)cps.textContent=ReelOpsState.creativeLabel(s);if(cApproval)cApproval.textContent=s.creativeApproval?`${s.creativeVersion||'V2'} · Approved`:s.creativeChangesRequested?'Changes Requested':s.creativeSubmitted?'In Review':'Not submitted';
      const n=next(s),ready=(s.deliveryItems||[]).filter(Boolean).length;if(sp)sp.textContent=ReelOpsState.shotLabel(s);if(sps)sps.textContent=n[2];
      if(dp)dp.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${ready} / 4`:'Pending';if(dps)dps.textContent=ReelOpsState.deliveryLabel(s);
      const waitingClient=n[0].startsWith('客户');if(client)client.textContent=waitingClient?'等待客户':'无客户阻塞';if(clientSub)clientSub.textContent=waitingClient?n[2]:`下一责任人 · ${n[0]}`;
      if(vApproval)vApproval.textContent=s.approval?`${s.approvedVersion||'V4'} · Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · In Review':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':'Not submitted';
      const pipe=$('#pipeline');if(pipe){const revision=!!(s.v3ChangesRequested&&!s.v4Submitted||s.v4ChangesRequested),review=!!(!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted));pipe.innerHTML=[pstage('Creative',!!s.creativeApproval,!s.creativeApproval,'方向确认',1),pstage('Production',!!s.genAsset,!!s.creativeApproval&&!s.genAsset,'Capture + AIGC',2),pstage('Post',!!s.v3Submitted,!!s.genAsset&&!s.v3Submitted||revision,'Composite / Revision',3),pstage('Client Review',!!s.approval,review,'Version Decision',4),pstage('Delivery',!!s.deliveryRecord,!!s.approval&&!s.deliveryRecord,'Master / Deliverables',5),pstage('Archive',!!s.archiveRecord,!!s.deliveryRecord&&!s.archiveRecord,'Project Closure',6)].join('')}
    }

    function studio(s){
      if(file!=='studio.html')return;
      const phase=$('#projectPhase'),creative=$('#creativeState'),shot=$('#shotState'),core=$('#studioCoreState'),title=$('#nextTitle'),copy=$('#nextCopy'),link=$('#nextLink'),client=$('.studioZone.z6');const shotLabel=ReelOpsState.shotLabel(s),n=next(s);
      if(phase)phase.textContent=ReelOpsState.projectPhase(s);if(creative)creative.textContent=ReelOpsState.creativeLabel(s);if(shot)shot.textContent=shotLabel;if(core)core.textContent=shotLabel;if(title)title.textContent=n[0];if(copy)copy.textContent=n[2];if(link){link.href=n[1];link.textContent=s.archiveRecord?'回到 Project Overview →':'进入下一工作位置 →'}
      if(client){const hasFormalVersion=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Submitted||s.v4ChangesRequested||s.approval);client.href=hasFormalVersion?'review.html?stage=versions':'review.html?stage=creative';}
    }
    function director(s){if(file!=='director.html')return;const versionBtn=$$('.subnav button').find(b=>b.textContent.includes('版本审阅')),top=$('#topState'),status=$('#shotStatus'),version=$('#versionStatus');if(versionBtn)versionBtn.classList.toggle('finalDeferred',!s.v3Submitted&&!s.v4Draft&&!s.v4Submitted&&!s.approval);const shot=ReelOpsState.shotLabel(s);if(top)top.textContent=shot;if(status)status.textContent=shot;if(version)version.textContent=s.approval?`${s.approvedVersion||'V4'} · Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · In Review':s.v4Draft?'V4 Draft · Internal':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':'尚未提交正式 Version'}
    function review(s){
      if(file!=='review.html')return;
      const hasVersion=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Submitted||s.v4ChangesRequested||s.approval),formal=s.approval?(s.approvedVersion||'V4'):(s.v4Submitted||s.v4ChangesRequested?'V4':s.v3Submitted?'V3':null);
      $$('.stageBtn').forEach(b=>{if(b.dataset.stage==='versions')b.style.opacity=hasVersion?'1':'.58'});
      const screen=$('#versionsStage .reviewScreen');if(screen)screen.style.backgroundImage=formal?`url('assets/${formal==='V3'?'shot08-v3.svg':'shot08-v4.svg'}')`:'none';
      const progress=$('.clientProgress');if(progress){const delivered=!!s.deliveryRecord,creativeText=s.creativeApproval?'Creative Approved':s.creativeChangesRequested?'Changes Requested · Waiting for revision':s.creativeSubmitted?'Waiting for decision':'Not published',versionState=s.approval?`${s.approvedVersion||'V4'} Approved`:s.v4ChangesRequested?'V4 Changes Requested':s.v4Submitted?'V4 In Review':s.v3ChangesRequested?'V3 Changes Requested':s.v3Submitted?'V3 In Review':'Not submitted';progress.innerHTML=`<div class="step ${s.creativeApproval?'done':s.creativeSubmitted?'current':''}"><b>01 创意审阅</b><span>${creativeText}</span></div><div class="step ${s.creativeApproval&&!hasVersion?'current':hasVersion?'done':!s.creativeApproval?'locked':''}"><b>02 制作中</b><span>${s.creativeApproval?'Direction locked':'After creative approval'}</span></div><div class="step ${hasVersion&&!s.approval?'current':s.approval?'done':'locked'}"><b>03 成片审阅</b><span>${versionState}</span></div><div class="step ${s.approval&&!delivered?'current':delivered?'done':'locked'}"><b>04 最终交付</b><span>${delivered?'Delivered':s.approval?'Ready for delivery':'After version approval'}</span></div>`}
    }

    function render(){const s=state();project(s);producer(s);studio(s);director(s);review(s)}
    render();document.body.classList.add('stateHydrated');setTimeout(render,180);window.addEventListener('reelops:state',()=>setTimeout(render,160));setTimeout(()=>{if(sessionStorage.getItem('reelops_investor_demo_mode')==='1')document.querySelector('.demoGuide')?.classList.add('open')},420);
  });
})();