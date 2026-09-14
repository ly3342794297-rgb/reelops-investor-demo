(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    if(!['review.html','delivery.html'].includes(file))return;
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState.get();
    const fmt=v=>{if(!v)return '—';try{return new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return 'Recorded'}};

    if(file==='review.html'){
      document.body.classList.add('clientClosure');
      const mast=$('.clientMast')||$('.appTop');
      if(mast&&!$('.clientScopeBar')){
        const bar=document.createElement('section');bar.className='clientScopeBar';bar.innerHTML='<div class="clientScopeInner"><div class="clientScopeCell primary"><small>CLIENT SCOPE</small><b>只做决策，不进入制作后台</b><span>客户只看到明确发布的创意对象与正式提交的 Version。</span></div><div class="clientScopeCell"><small>HIDDEN FROM CLIENT</small><b>内部过程保持内部</b><span>Prompt · 失败 Variant · Working Composite · 成本 · 供应商 · 内部备注</span></div><div class="clientScopeCell"><small>TWO APPROVALS</small><b>Creative ≠ Version</b><span>先确认制作方向，再单独确认最终成片版本。</span></div></div>';
        mast.insertAdjacentElement('afterend',bar);
      }
      const creativeSide=$('#creativeStage .sidePanel'),versionSide=$('#versionsStage .sidePanel');
      const ensureReceipt=(side,id)=>{if(!side||$('#'+id,side))return null;const e=document.createElement('div');e.id=id;e.className='reviewDecisionReceipt pending';side.insertBefore(e,side.querySelector('.reviewActions')||null);return e};
      const cReceipt=ensureReceipt(creativeSide,'creativeReceipt'),vReceipt=ensureReceipt(versionSide,'versionReceipt');
      const creativeSubtitle=$('#creativeStage .reviewHero .small');
      const versionSubtitle=$('#versionsStage .reviewHero .small');
      const render=()=>{
        const s=state();
        if(creativeSubtitle)creativeSubtitle.textContent=s.creativeApproval?'Creative Approval 已记录 · 成片仍需单独确认':s.creativeSubmitted?'Brief → Treatment → Storyboard → Shot Direction → 客户决策':'尚未发布 · 客户空间不会显示内部草稿';
        if(versionSubtitle)versionSubtitle.textContent=s.approval?'Version Approval 已记录 · 下一步 Final Master / Delivery':s.v4Submitted?`${s.feedbackResolved||0} / 3 上一轮反馈已处理 · 当前 V4 正式审阅`:'正式 Version 尚未提交 · Working Composite 对客户不可见';
        if(cReceipt){cReceipt.className='reviewDecisionReceipt '+(s.creativeApproval?'':'pending');cReceipt.innerHTML=s.creativeApproval?`<small>CREATIVE APPROVAL RECORD</small><b>${s.creativeVersion||'V2'} · Approved</b><span>${fmt(s.creativeApprovalAt)} · 制作方向已锁定；这不是 Version Approval。</span>`:`<small>CREATIVE DECISION</small><b>${s.creativeSubmitted?'等待客户确认':'等待导演发布'}</b><span>${s.creativeSubmitted?'确认或要求修改，都会形成明确决策状态。':'内部草稿不会自动进入客户空间。'}</span>`;}
        if(vReceipt){vReceipt.className='reviewDecisionReceipt '+(s.approval?'':'pending');vReceipt.innerHTML=s.approval?`<small>VERSION APPROVAL RECORD</small><b>SHOT 08 · V4 · Approved</b><span>${fmt(s.approvalAt)} · 该记录独立于 V4 Version 对象。</span>`:`<small>VERSION DECISION</small><b>${s.v4Submitted?'等待客户确认 V4':'等待后期正式提交'}</b><span>${s.v4Submitted?'客户可确认或提出修改；反馈绑定当前正式 Version。':'内部 Composite 与测试版本不会显示。'}</span>`;}
        const creativeActions=$('#creativeStage .reviewActions'),versionActions=$('#versionsStage .reviewActions');
        if(creativeActions)creativeActions.style.display=s.creativeApproval?'none':'';
        if(versionActions)versionActions.style.display=s.approval?'none':'';
      };
      render();window.addEventListener('reelops:state',()=>queueMicrotask(render));
    }

    if(file==='delivery.html'){
      document.body.classList.add('deliveryClosure');
      const hero=$('.deliveryHero');
      if(hero&&!$('.deliveryTruth')){
        const truth=document.createElement('section');truth.className='deliveryTruth';hero.insertAdjacentElement('afterend',truth);
      }
      const panels=$$('.deliveryGrid .stack:first-child > .deliveryPanel');
      const why=$$('.deliveryGrid aside .deliveryPanel').find(p=>$('.eyebrow',p)?.textContent.includes('WHY IT MATTERS'));
      if(why&&!$('.closureWhy',why))why.insertAdjacentHTML('beforeend','<div class="closureWhy"><b>审片工具停在“可以了”。</b><span>ReelOps 继续把客户确认转换成 Final Master、Deliverables、Delivery Record 与 Archive。</span></div>');
      const next= s=>{
        if(!s.approval)return ['客户确认 V4','Client Review Space','Version Approval 是进入交付的唯一门槛'];
        if(!s.finalMasterReady)return ['生成 Final Master','制片 / 后期','Approved V4 先固化为统一母版'];
        const n=(s.deliveryItems||[]).filter(Boolean).length;
        if(n<4)return ['准备全部 Deliverables','制片 / 交付',`${n} / 4 Ready · 交付件统一来自 Final Master`];
        if(!s.deliveryRecord)return ['完成客户交付','制片统筹','创建独立 Delivery Record，而不是只标记“已发送”'];
        if(!s.archiveRecord)return ['归档 Project Aurora','制片统筹','闭合 Creative → Production → Approval → Delivery 关系'];
        return ['项目已闭环','Archive Record','完整生产与交付记录已形成'];
      };
      const render=()=>{
        const s=state(),n=next(s),ready=(s.deliveryItems||[]).filter(Boolean).length;
        const truth=$('.deliveryTruth');if(truth)truth.innerHTML=`<div class="deliveryTruthCell primary"><small>CURRENT TRUTH</small><b>${window.ReelOpsState.deliveryLabel(s)}</b><span>SHOT 08 · ${s.approval?'V4 Approved':'等待 Version Approval'}</span></div><div class="deliveryTruthCell ${s.archiveRecord?'good':'warn'}"><small>NEXT STATE CHANGE</small><b>${n[0]}</b><span>${n[2]}</span></div><div class="deliveryTruthCell"><small>NEXT OWNER</small><b>${n[1]}</b><span>Ready ≠ Delivered · Approved ≠ Archived</span><div class="closureLineage"><span class="closureObj ${s.approval?'done':'current'}">Approval</span><span class="closureArrow">→</span><span class="closureObj ${s.finalMasterReady?'done':s.approval?'current':'locked'}">Final Master</span><span class="closureArrow">→</span><span class="closureObj ${ready===4?'done':s.finalMasterReady?'current':'locked'}">Deliverables</span><span class="closureArrow">→</span><span class="closureObj ${s.deliveryRecord?'done':ready===4?'current':'locked'}">Delivery Record</span><span class="closureArrow">→</span><span class="closureObj ${s.archiveRecord?'done':s.deliveryRecord?'current':'locked'}">Archive</span></div></div>`;
        const done=[!!s.approval,!!s.finalMasterReady,ready===4,!!s.deliveryRecord,!!s.archiveRecord];
        const current=done.findIndex(v=>!v);
        panels.forEach((p,i)=>{p.classList.remove('futureLocked','currentClosure','doneClosure');if(done[i])p.classList.add('doneClosure');else if(i===current)p.classList.add('currentClosure');else if(current>=0&&i>current)p.classList.add('futureLocked');});
      };
      render();window.addEventListener('reelops:state',()=>queueMicrotask(render));
    }
  });
})();