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

    function project(s){
      if(file!=='project.html')return;
      const hero=$('#heroShot'),summary=$('#summaryShot'),delivery=$('#summaryDelivery'),phase=$('#summaryPhase'),header=$('#headerPhase');
      const shot=ReelOpsState.shotLabel(s),p=ReelOpsState.projectPhase(s);
      if(hero)hero.textContent='SHOT 08 · '+shot;if(summary)summary.textContent=shot;if(delivery)delivery.textContent=ReelOpsState.deliveryLabel(s);if(phase)phase.textContent=p;if(header)header.textContent=p;
      const record=$('.recordChain');
      if(record&&!$('.finalHierarchyNote'))record.insertAdjacentHTML('afterend','<div class="finalHierarchyNote">Project Overview 只保留项目事实：当前阶段、下一责任人、阻塞与生产对象关系。具体工作留在角色工作区。</div>');
    }

    function producer(s){
      if(file!=='producer.html')return;
      $$('.shotTable .shotRow').forEach(r=>{if(!r.classList.contains('head')&&!r.classList.contains('focus'))r.classList.add('finalHidden')});
      const cp=$('#creativePulseValue'),cps=$('#creativePulseSub'),sp=$('#shotPulseValue'),sps=$('#shotPulseSub'),dp=$('#deliveryPulseValue'),dps=$('#deliveryPulseSub');
      if(cp)cp.textContent=s.creativeApproval?'Approved':s.creativeSubmitted?'等待客户':'Internal';if(cps)cps.textContent=ReelOpsState.creativeLabel(s);
      if(sp)sp.textContent=ReelOpsState.shotLabel(s);const n=next(s);if(sps)sps.textContent=n[2];
      if(dp)dp.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${s.deliverables||0} / 4`:'Pending';if(dps)dps.textContent=ReelOpsState.deliveryLabel(s);
    }

    function studio(s){
      if(file!=='studio.html')return;
      const phase=$('#projectPhase'),creative=$('#creativeState'),shot=$('#shotState'),core=$('#studioCoreState'),title=$('#nextTitle'),copy=$('#nextCopy'),link=$('#nextLink');
      const shotLabel=ReelOpsState.shotLabel(s),n=next(s);
      if(phase)phase.textContent=ReelOpsState.projectPhase(s);if(creative)creative.textContent=ReelOpsState.creativeLabel(s);if(shot)shot.textContent=shotLabel;if(core)core.textContent=shotLabel;
      if(title)title.textContent=n[0];if(copy)copy.textContent=n[2];if(link){link.href=n[1];link.textContent=s.archiveRecord?'回到 Project Overview →':'进入下一工作位置 →';}
    }

    function director(s){
      if(file!=='director.html')return;
      const versionBtn=$$('.subnav button').find(b=>b.textContent.includes('版本审阅'));
      if(versionBtn)versionBtn.classList.toggle('finalDeferred',!s.v3Submitted&&!s.v4Draft&&!s.v4Submitted&&!s.approval);
    }

    function review(s){
      if(file!=='review.html')return;
      const tabs=$$('.stageBtn');
      tabs.forEach(b=>{if(b.dataset.stage==='versions'){const hasVersion=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Submitted||s.v4ChangesRequested||s.approval);b.style.opacity=hasVersion?'1':'.58';}});
    }

    function render(){const s=state();project(s);producer(s);studio(s);director(s);review(s)}
    render();setTimeout(render,120);window.addEventListener('reelops:state',()=>setTimeout(render,30));
  });
})();
