(()=>{if(!document.querySelector('script[data-golden-path-qa]')){const s=document.createElement('script');s.src='golden-path-qa.js';s.async=false;s.dataset.goldenPathQa='1';document.head.appendChild(s)}})();
(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState?.get?.()||{};
    const phase=s=>window.ReelOpsState?.projectPhase?.(s)||'Production';
    const shot=s=>window.ReelOpsState?.shotLabel?.(s)||'SHOT 08';
    const once=(cls,build)=>{if(document.querySelector('.'+cls))return null;return build();};
    const activeChanges=s=>!!(s.v4ChangesRequested||(s.v3ChangesRequested&&!s.v4Submitted&&!s.approval));
    const ownerFor=s=>{
      if(!s.creativeSubmitted||s.creativeChangesRequested)return ['导演 / 创意','Director Workspace'];
      if(!s.creativeApproval)return ['客户','Client Creative Review'];
      if(!s.aiReady||!s.packageSent)return ['实拍 + AI','Capture Workspace'];
      if(!s.genAsset)return ['AIGC','Generation Workspace'];
      if(!s.workingComposite)return ['后期','Post Workspace'];
      if(!s.v3Submitted)return ['后期','提交 V3'];
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return ['客户','Client Version Review · V3'];
      if(s.v4ChangesRequested&&!s.approval)return ['后期','Second Revision · V5'];
      if(s.v3ChangesRequested&&((s.feedbackResolved||0)<3||!s.v4Draft||!s.v4Submitted))return ['后期','Post Revision · V3 → V4'];
      if(s.v4Submitted&&!s.approval)return ['客户','Client Version Review · V4'];
      return ['制片 / 交付','Delivery Workspace'];
    };
    const blockerFor=s=>{
      if(!s.creativeSubmitted)return 'Creative Direction 尚未发布';
      if(s.creativeChangesRequested)return '客户要求修改创意方向';
      if(!s.creativeApproval)return '等待 Creative Approval';
      if(!s.aiReady)return 'SHOT 08 尚未 AI Ready';
      if(!s.packageSent)return 'AI 制作包尚未发送';
      if(!s.genAsset)return '尚未产生 Selected Asset';
      if(!s.workingComposite)return '尚未建立 Working Composite';
      if(!s.v3Submitted)return 'V3 尚未正式提交';
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return '等待 V3 客户决策';
      if(s.v4ChangesRequested&&!s.approval)return 'V4 Changes Requested · 下一正式版本应为 V5';
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return `${3-(s.feedbackResolved||0)} 条 V3 反馈未闭合`;
      if(s.v3ChangesRequested&&!s.v4Draft)return 'V4 Draft 尚未生成';
      if(s.v4Draft&&!s.v4Submitted)return 'V4 尚未正式提交';
      if(s.v4Submitted&&!s.approval)return '等待 V4 Version Approval';
      if(!s.finalMasterReady)return 'Final Master 尚未生成';
      if((s.deliveryItems||[]).filter(Boolean).length<4)return 'Deliverables 尚未齐套';
      if(!s.deliveryRecord)return 'Delivery Record 尚未创建';
      if(!s.archiveRecord)return '项目尚未归档';
      return '无阻塞';
    };

    if(file==='project.html'){
      document.body.classList.add('presentationProject');const lead=$('.projectLead');if(lead&&!$('.projectOneLine')){const p=document.createElement('div');p.className='projectOneLine';p.textContent='ReelOps 管的不是文件放在哪里，而是商业影像生产现在到底发生了什么。';lead.appendChild(p)}
      const hero=$('.projectHero');once('presentationBand',()=>{if(!hero)return null;const band=document.createElement('section');band.className='presentationBand';hero.insertAdjacentElement('afterend',band);const render=()=>{const s=state(),o=ownerFor(s);band.innerHTML=`<div class="presentationCell primary"><small>CURRENT TRUTH</small><b>${phase(s)}</b><span>${shot(s)}</span></div><div class="presentationCell"><small>NEXT OWNER</small><b>${o[0]}</b><span>${o[1]}</span></div><div class="presentationCell ${blockerFor(s)==='无阻塞'?'good':'warn'}"><small>BLOCKER</small><b>${blockerFor(s)}</b><span>只记录会阻塞下一状态的事实</span></div>`};render();window.addEventListener('reelops:state',render);return band});
    }

    if(file==='producer.html'){
      document.body.classList.add('presentationProducer');$$('.shotTable .shotRow').forEach(r=>{if(!r.classList.contains('head')&&!r.classList.contains('focus'))r.classList.add('presentationHidden')});const hero=$('.producerHero');once('producerControlBar',()=>{if(!hero)return null;const bar=document.createElement('div');bar.className='producerControlBar';hero.insertAdjacentElement('afterend',bar);const render=()=>{const s=state(),o=ownerFor(s),waiting=(!s.creativeApproval&&s.creativeSubmitted&&!s.creativeChangesRequested)||(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)||(s.v4Submitted&&!s.approval);bar.innerHTML=`<div class="producerControlCell blocker"><small>PRIMARY BLOCKER</small><b>${blockerFor(s)}</b><span>只追踪真正会阻塞下一步的事项</span></div><div class="producerControlCell owner"><small>NEXT OWNER</small><b>${o[0]}</b><span>${o[1]}</span></div><div class="producerControlCell ${waiting?'blocker':'clear'}"><small>CLIENT WAIT</small><b>${waiting?'Yes · 等待客户':'No'}</b><span>${s.creativeChangesRequested?'当前由导演修订，不是等待客户':'Creative Approval 与 Version Approval 分开'}</span></div>`};render();window.addEventListener('reelops:state',render);return bar});
    }

    if(file==='director.html'){
      document.body.classList.add('presentationDirector');const nav=$('.subnav');once('creativePackageBar',()=>{if(!nav)return null;const bar=document.createElement('div');bar.className='creativePackageBar';nav.insertAdjacentElement('afterend',bar);const render=()=>{const s=state(),shared=s.creativeShared||{},count=['brief','treatment','storyboard','reference'].filter(k=>shared[k]).length,decision=s.creativeApproval?'Creative Approved':s.creativeChangesRequested?'Changes Requested · Revision required':s.creativeSubmitted?'Waiting for decision':'Not published';bar.innerHTML=`<div class="creativePackageCell primary"><small>CREATIVE PACKAGE</small><b>${s.creativeVersion||'V2'} · ${count} 个客户可见对象</b><span>Brief / Treatment / Storyboard / Selected Reference</span></div><div class="creativePackageCell ${s.creativeApproval?'good':s.creativeSubmitted?'warn':''}"><small>CLIENT DECISION</small><b>${decision}</b><span>${s.creativeChangesRequested?'旧版本保持记录，下一步提交新 Creative Version':'创意确认只锁定制作方向'}</span></div><div class="creativePackageCell ${s.creativeApproval?'good':'warn'}"><small>PRODUCTION GATE</small><b>${s.creativeApproval?'Open':'Internal preparation only'}</b><span>${s.creativeApproval?'可以进入正式制作':'客户确认前只做内部准备'}</span></div>`};render();window.addEventListener('reelops:state',render);return bar});
    }

    if(file==='review.html'){
      document.body.classList.add('presentationReview');const top=$('.appTop');once('clientMast',()=>{if(!top)return null;const mast=document.createElement('section');mast.className='clientMast';mast.innerHTML='<div class="clientMastInner"><div><small>PROJECT</small><strong>Project Aurora</strong><span>Aion Studio · Client Review Space</span></div><div><small>WHAT YOU SEE</small><strong>仅已发布的创意与正式版本</strong><span>内部备注、失败生成、Prompt、成本与未发布版本不会显示</span></div><span class="clientMastBadge">CLIENT VIEW · DECISION ONLY</span></div>';top.insertAdjacentElement('afterend',mast);return mast});
      const addDecision=(stageSel,type)=>{const stage=$(stageSel);if(!stage||stage.querySelector('.clientDecisionBanner'))return;const main=$('.appMain',stage);if(!main)return;const hero=$('.reviewHero',main),banner=document.createElement('div');banner.className='clientDecisionBanner';hero?.insertAdjacentElement('afterend',banner);const render=()=>{const s=state();if(type==='creative'){const approved=!!s.creativeApproval,changes=!!s.creativeChangesRequested,published=!!s.creativeSubmitted;banner.className='clientDecisionBanner '+(approved?'approved':changes?'changes':'');banner.innerHTML=`<div><small>YOUR DECISION · CREATIVE DIRECTION ${s.creativeVersion||'V2'}</small><b>${approved?'创意方向已确认':changes?'已要求修改':'请确认这是否是可以进入制作的方向'}</b><p>${approved?'Creative Approval 已形成独立记录；成片仍需再次确认。':changes?'导演将基于本轮反馈形成下一版 Creative Direction；当前版本不能再次确认。':'你确认的是制作方向，不是最终成片。确认后，实拍与 AI 制作将按这套规则继续。'}</p></div><span class="clientDecisionStatus">${approved?'APPROVED':changes?'CHANGES REQUESTED':published?'DECISION REQUIRED':'NOT PUBLISHED'}</span>`}else{const version=s.approval?(s.approvedVersion||'V4'):s.v4ChangesRequested?'V4':s.v4Submitted?'V4':s.v3Submitted?'V3':null,changes=activeChanges(s);banner.className='clientDecisionBanner '+(s.approval?'approved':changes?'changes':'');banner.innerHTML=`<div><small>YOUR DECISION${version?' · SHOT 08 · '+version:''}</small><b>${s.approval?version+' 已确认':changes?version+' 已要求修改':version?'请确认当前正式版本，或提出具体修改':'正式版本尚未提交'}</b><p>${s.approval?'Version Approval 已形成独立记录，项目将进入 Final Master 与交付。':changes?'反馈已经绑定当前正式 Version 并回到 Post。':version?'Working Composite 与内部测试不会出现在客户空间。':'后期需要先正式提交 Version，客户才能做版本决策。'}</p></div><span class="clientDecisionStatus">${s.approval?'APPROVED':changes?'CHANGES REQUESTED':version?'DECISION REQUIRED':'WAITING FOR SUBMISSION'}</span>`}};render();window.addEventListener('reelops:state',render)};
      addDecision('#creativeStage','creative');addDecision('#versionsStage','version');const cSide=$('#creativeStage .sidePanel');if(cSide&&!cSide.querySelector('.reviewVisibilityNote'))cSide.insertAdjacentHTML('beforeend','<div class="reviewVisibilityNote">这里是客户决策空间，不是内部制作后台。客户只能看到导演明确发布的创意对象。</div>');const vSide=$('#versionsStage .sidePanel');if(vSide&&!vSide.querySelector('.reviewVisibilityNote'))vSide.insertAdjacentHTML('beforeend','<div class="reviewVisibilityNote">这里仅展示正式提交的 Version。内部 Composite、失败 Variant 与工作过程不会暴露。</div>');
    }
  });
})();