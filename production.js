(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    if(!['live-action.html','generation.html','post.html'].includes(file))return;
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState?.get?.()||{};
    const cls=(done,current)=>done?'done':current?'current':'locked';
    document.body.classList.add('productionWorkspace');

    function mount(anchor){
      if($('.productionRoute'))return $('.productionRoute');
      const route=document.createElement('section');route.className='productionRoute';
      const boundary=document.createElement('div');boundary.className='productionBoundary';
      anchor.insertAdjacentElement('afterend',route);route.insertAdjacentElement('afterend',boundary);
      return route;
    }
    function routeHTML(items){return items.map((x,i)=>`<div class="productionRouteCell ${x.tone}"><small>0${i+1} · ${x.k}</small><b>${x.title}</b><span>${x.sub}</span></div>`).join('')}
    function setBoundary(text,right){const el=$('.productionBoundary');if(el)el.innerHTML=`<b>${text}</b><span>${right}</span>`}

    if(file==='live-action.html'){
      document.body.classList.add('productionCapture');
      const anchor=$('.subnav')||$('.appTitle');mount(anchor);
      const boundary=$('.productionBoundary');
      if(boundary&&!$('.captureFrameCard')){
        const frame=document.createElement('section');frame.className='captureFrameCard';
        frame.innerHTML='<div class="captureFrameMedia"><div class="captureFrameOverlay"><span>A-CAM · TAKE 04</span><b>SHOT 08 · Hero Reveal</b><small>50mm · 24fps · Preserve identity / performance / product</small></div></div><div class="captureFrameMeta"><div><small>DIRECTOR SELECT</small><b>人物表演 + 产品主体</b></div><div><small>AI USE</small><b>环境延展 only</b></div><div><small>HANDOFF TARGET</small><b>Generation Job #018</b></div></div>';
        boundary.insertAdjacentElement('afterend',frame);
      }
      const side=$('.sidePanel');
      const gate=document.createElement('div');gate.className='productionGateStrip';side?.insertAdjacentElement('afterbegin',gate);
      const shootState=$$('.stateBlock',side).find(x=>$('b',x)?.textContent.includes('拍摄状态'))?.querySelector('span');
      const packageEl=$('#package'),packageBtn=$('#packageBtn'),sendBtn=$('#sendBtn'),tracking=$('#tracking'),camera=$('#camera');
      const inputCount=()=>$$('.checkGrid input[type="checkbox"]').filter(i=>i.checked).length;
      const render=()=>{
        const s=state(),readyInputs=inputCount()===6;
        if(s.packageSent){if(tracking){tracking.checked=true;tracking.disabled=true}if(camera){camera.checked=true;camera.disabled=true}}
        const route=$('.productionRoute');if(route)route.innerHTML=routeHTML([
          {k:'INPUT',title:s.creativeApproval?`Creative ${s.creativeVersion||'V2'} · Approved`:'Creative Approval Pending',sub:'已确认方向才允许正式制作交接',tone:cls(!!s.creativeApproval,!s.creativeApproval)},
          {k:'WORK',title:s.aiReady?'AI Ready':'Capture + AI Ready',sub:s.aiReady?'现场输入已齐套':'主体 / Clean Plate / Tracking / Lighting / Camera',tone:cls(!!s.aiReady,!!s.creativeApproval&&!s.aiReady)},
          {k:'OUTPUT',title:s.packageSent?'AI Package · Sent':s.creativeApproval&&s.aiReady?'AI Package · Ready':'AI Production Package',sub:s.packageSent?'已进入 AIGC 制作':s.creativeApproval&&s.aiReady?'等待正式发送':'Shot Context + Preserve / Change + Capture Inputs',tone:cls(!!s.packageSent,!!s.aiReady&&!!s.creativeApproval&&!s.packageSent)}
        ]);
        setBoundary('这一页的输出不是“拍完了”，而是可进入生成与合成的生产上下文。','CLIENT VISIBLE · NO · 内部制作状态');
        if(shootState)shootState.textContent=!s.creativeApproval?'技术准备 / 示例素材':s.captureComplete?'主体拍摄完成':'正式拍摄准备中';
        gate.className='productionGateStrip '+(s.creativeApproval?'good':'');
        gate.innerHTML=s.creativeApproval?'<span class="dot"></span><div><b>Creative Approval 已锁定</b><span>现在可以把 AI Ready 素材正式交接给 AIGC。</span></div><a href="director.html">查看已确认方向 →</a>':'<span class="dot"></span><div><b>当前仅允许技术准备</b><span>可以检查 AI Ready，但正式 AI 制作包必须等待客户确认 Creative Direction。</span></div><a href="review.html?stage=creative">去创意审阅 →</a>';
        if(packageBtn){
          packageBtn.disabled=true;
          packageBtn.textContent=s.packageSent?'AI 制作包已发送 ✓':!s.creativeApproval?'等待 Creative Approval':!s.aiReady?'补齐 AI Ready 后生成':'AI 制作包已就绪 ↓';
        }
        if(packageEl)packageEl.style.display=(s.creativeApproval&&s.aiReady)||s.packageSent?'block':'none';
        if(sendBtn){
          const canSend=!!(s.creativeApproval&&s.aiReady&&!s.packageSent);
          sendBtn.style.pointerEvents=s.packageSent?'auto':canSend?'auto':'none';sendBtn.style.opacity=(canSend||s.packageSent)?'1':'.45';
          sendBtn.textContent=s.packageSent?'进入 AIGC 制作 →':'发送至 AIGC 制作 →';
        }
        if(!s.packageSent&&s.aiReady!==readyInputs)window.ReelOpsState.set({aiReady:readyInputs,captureComplete:s.captureComplete||readyInputs});
      };
      if(sendBtn)sendBtn.addEventListener('click',e=>{const s=state();if(s.packageSent)return;if(!(s.creativeApproval&&s.aiReady)){e.preventDefault();e.stopImmediatePropagation();return;}window.ReelOpsState.set({packageSent:true,packageSentAt:new Date().toISOString()});},true);
      [tracking,camera].filter(Boolean).forEach(i=>i.addEventListener('change',()=>setTimeout(render,0)));
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
    }

    if(file==='generation.html'){
      document.body.classList.add('productionGeneration');
      const anchor=$('.subnav')||$('.genHero');mount(anchor);
      const aside=$('.sidePanel');
      if(aside&&!$('.productionNext',aside)){const n=document.createElement('div');n.className='productionNext';aside.insertAdjacentElement('afterbegin',n);}
      const render=()=>{
        const s=state(),asset=!!s.genAsset,ready=!!s.packageSent;
        const route=$('.productionRoute');if(route)route.innerHTML=routeHTML([
          {k:'INPUT',title:ready?'AI Package · Received':'Waiting for AI Package',sub:'Shot Intent + Capture Inputs + Preserve / Change',tone:cls(ready,!ready)},
          {k:'WORK',title:ready?(asset?'Job #018 · Selection Locked':'Job #018 · Variants Ready'):'Generation Locked',sub:'模型只是执行层；Job 属于 SHOT 08',tone:cls(asset,ready&&!asset)},
          {k:'OUTPUT',title:asset?`Selected Asset · ${s.selectedVariant||'B'}`:'Selected Asset',sub:asset?'已进入 SHOT 08 Assets':'Variant 被选择并写入项目后才成为 Asset',tone:cls(asset,ready&&!asset)}
        ]);
        setBoundary('这一页的输出是 Asset，不是 Version。','MODEL / PROVIDER 可替换 · Production Record 不变');
        const n=$('.productionNext',aside);if(n)n.innerHTML=asset?'<div><small>NEXT HANDOFF</small><b>进入 Post · 建立 Working Composite</b></div><span>Selected Asset 已经成为 SHOT 08 的正式素材</span>':'<div><small>CURRENT DECISION</small><b>选择哪个 Variant 进入真实生产？</b></div><span>Candidate ≠ Asset</span>';
      };
      render();window.addEventListener('reelops:state',render);
    }

    if(file==='post.html'){
      document.body.classList.add('productionPost');
      const anchor=$('.subnav')||$('.postHero');mount(anchor);
      const feedbackSection=$('#feedbackSection')||$$('.appMain section').find(sec=>$('.eyebrow',sec)?.textContent.includes('FEEDBACK'));
      const locked=document.createElement('div');locked.className='productionLockedMessage';locked.innerHTML='<b>Post 尚未获得正式生产素材。</b><p>先从 AIGC / Capture 获得 Selected Asset。只有进入 SHOT 08 Assets 的素材，才能建立 Working Composite 并提交正式 Version。</p>';
      if(feedbackSection)feedbackSection.insertAdjacentElement('beforebegin',locked);
      const formalBlock=$$('.stateBlock',$('.sidePanel')).find(x=>$('b',x)?.textContent.includes('当前正式 Version'))?.querySelector('span');
      const liveLineage=$('#liveLineage')||$('.lineage .lineageCard:first-child'),aigcLineage=$('#aigcLineage');
      const render=()=>{
        const s=state(),hasAsset=!!s.genAsset,res=s.feedbackResolved||0,approved=s.approval?(s.approvedVersion||'V4'):null;
        document.body.classList.toggle('preAsset',!hasAsset);
        const formal=approved?`${approved} · Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · In Review':s.v4Draft?'V4 Draft · Internal':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':s.workingComposite?'尚未提交正式 Version':'尚未进入 Version';
        const outputTitle=approved?`${approved} · Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · In Review':s.v4Draft?'V4 Draft':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':s.workingComposite?'Formal Version · V3':'Formal Version';
        const outputSub=approved?'Version Approval 已形成':s.v4ChangesRequested?'下一正式 Version 应创建 V5':s.v4Submitted?'正式 Version 已进入客户决策':s.v4Draft?'下一版草稿 · 尚未客户可见':s.v3ChangesRequested?'正式 Feedback 已进入 Revision':s.v3Submitted?'等待客户首次版本决策':'Composite 不是 Version';
        const route=$('.productionRoute');if(route)route.innerHTML=routeHTML([
          {k:'INPUT',title:hasAsset?'Production Assets · Ready':'Waiting for Selected Asset',sub:'Live Action + AIGC + CG/Post',tone:cls(hasAsset,!hasAsset)},
          {k:'WORK',title:s.workingComposite?'Working Composite · Created':'Working Composite',sub:s.workingComposite?(s.v3ChangesRequested?`${res} / 3 V3 Feedback resolved`:'内部工作状态 · 客户不可见'):'内部工作状态 · 客户不可见',tone:cls(!!s.workingComposite,hasAsset&&!s.workingComposite)},
          {k:'OUTPUT',title:outputTitle,sub:outputSub,tone:cls(!!s.approval,!!(s.v3Submitted||s.v4Draft||s.v4Submitted||s.v4ChangesRequested)&&!s.approval)}
        ]);
        setBoundary('这一页负责把不同来源的 Asset 变成可审阅的正式 Version。','CLIENT VISIBLE · 仅正式提交的 Version');
        const revisionInput=!!(s.v3ChangesRequested&&!s.approval&&approved!=='V3');
        if(feedbackSection)feedbackSection.style.display=revisionInput?'block':'none';locked.style.display=hasAsset?'none':'block';
        if(formalBlock)formalBlock.textContent=formal;
        if(liveLineage){liveLineage.className='lineageCard '+(s.captureComplete?'ready':'locked');const desc=liveLineage.querySelector('span');if(desc)desc.textContent=s.captureComplete?'Capture Asset · Ready':'等待正式 Capture Asset';}
        if(aigcLineage)aigcLineage.className='lineageCard '+(s.genAsset?'ready':s.packageSent?'current':'locked');
      };
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
    }
  });
})();