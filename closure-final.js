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
      if(mast&&!$('.clientScopeBar')){const bar=document.createElement('section');bar.className='clientScopeBar';bar.innerHTML='<div class="clientScopeInner"><div class="clientScopeCell primary"><small>CLIENT SCOPE</small><b>只做决策，不进入制作后台</b><span>客户只看到明确发布的创意对象与正式提交的 Version。</span></div><div class="clientScopeCell"><small>HIDDEN FROM CLIENT</small><b>内部过程保持内部</b><span>Prompt · 失败 Variant · Working Composite · 成本 · 供应商 · 内部备注</span></div><div class="clientScopeCell"><small>TWO APPROVALS</small><b>Creative ≠ Version</b><span>先确认制作方向，再单独确认最终成片版本。</span></div></div>';mast.insertAdjacentElement('afterend',bar);}
      const creativeSide=$('#creativeStage .sidePanel'),versionSide=$('#versionsStage .sidePanel');
      const ensureReceipt=(side,id)=>{if(!side||$('#'+id,side))return null;const e=document.createElement('div');e.id=id;e.className='reviewDecisionReceipt pending';side.insertBefore(e,side.querySelector('.reviewActions')||null);return e};
      const cReceipt=ensureReceipt(creativeSide,'creativeReceipt'),vReceipt=ensureReceipt(versionSide,'versionReceipt');
      const creativeSubtitle=$('#creativeStage .reviewHero .small'),versionSubtitle=$('#versionsStage .reviewHero .small');
      const render=()=>{
        const s=state();
        if(creativeSubtitle)creativeSubtitle.textContent=s.creativeApproval?'Creative Approval 已记录 · 成片仍需单独确认':s.creativeChangesRequested?'Changes Requested 已记录 · 等待导演提交修订后的 Creative Direction':s.creativeSubmitted?'Brief → Treatment → Storyboard → Shot Direction → 客户决策':'尚未发布 · 客户空间不会显示内部草稿';
        const current=s.approval?(s.approvedVersion||'V4'):s.v4ChangesRequested?'V4':s.v4Submitted?'V4':s.v3Submitted?'V3':null;
        if(versionSubtitle){
          if(s.approval)versionSubtitle.textContent=`${current} Version Approval 已记录 · 下一步 Final Master / Delivery`;
          else if(s.v4ChangesRequested)versionSubtitle.textContent='V4 已要求修改 · 下一正式 Version 应创建 V5';
          else if(s.v4Submitted)versionSubtitle.textContent=`${s.feedbackResolved||0} / 3 上一轮反馈已处理 · 当前 V4 正式审阅`;
          else if(s.v3ChangesRequested)versionSubtitle.textContent='V3 · Changes Requested · 反馈已进入 Post Revision';
          else if(s.v3Submitted)versionSubtitle.textContent='V3 · In Review · 等待客户确认或提出修改';
          else versionSubtitle.textContent='正式 Version 尚未提交 · Working Composite 对客户不可见';
        }
        if(cReceipt){
          cReceipt.className='reviewDecisionReceipt '+(s.creativeApproval?'':'pending');
          if(s.creativeApproval)cReceipt.innerHTML=`<small>CREATIVE APPROVAL RECORD</small><b>${s.creativeVersion||'V2'} · Approved</b><span>${fmt(s.creativeApprovalAt)} · 制作方向已锁定；这不是 Version Approval。</span>`;
          else if(s.creativeChangesRequested)cReceipt.innerHTML=`<small>CREATIVE DECISION</small><b>${s.creativeVersion||'V2'} · Changes Requested</b><span>本轮客户决策已经记录。旧版本保持可追溯，等待导演形成下一版 Creative Direction 后重新提交。</span>`;
          else cReceipt.innerHTML=`<small>CREATIVE DECISION</small><b>${s.creativeSubmitted?'等待客户确认':'等待导演发布'}</b><span>${s.creativeSubmitted?'确认或要求修改，都会形成明确决策状态。':'内部草稿不会自动进入客户空间。'}</span>`;
        }
        if(vReceipt){
          vReceipt.className='reviewDecisionReceipt '+(s.approval?'':'pending');
          if(s.approval)vReceipt.innerHTML=`<small>VERSION APPROVAL RECORD</small><b>SHOT 08 · ${current} · Approved</b><span>${fmt(s.approvalAt)} · 该记录独立于 ${current} Version 对象。</span>`;
          else if(s.v4ChangesRequested)vReceipt.innerHTML='<small>VERSION DECISION</small><b>V4 · Changes Requested</b><span>该决策已绑定 V4；正式版本不可覆盖，下一次正式提交应创建 V5。</span>';
          else if(s.v3ChangesRequested)vReceipt.innerHTML='<small>VERSION DECISION</small><b>V3 · Changes Requested</b><span>客户修改请求已形成正式 Revision Input，3 条反馈绑定 V3。</span>';
          else if(current)vReceipt.innerHTML=`<small>VERSION DECISION</small><b>等待客户确认 ${current}</b><span>客户可确认或提出修改；反馈只绑定当前正式 Version。</span>`;
          else vReceipt.innerHTML='<small>VERSION DECISION</small><b>等待后期正式提交</b><span>内部 Composite 与测试版本不会显示。</span>';
        }
        const creativeActions=$('#creativeStage .reviewActions'),versionActions=$('#versionsStage .reviewActions');
        if(creativeActions)creativeActions.style.display=s.creativeApproval||s.creativeChangesRequested?'none':'';
        if(versionActions)versionActions.style.display=s.approval||s.v3ChangesRequested&&!s.v4Submitted||s.v4ChangesRequested?'none':'';
      };
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));setTimeout(render,120);
    }

    if(file==='delivery.html'){
      document.body.classList.add('deliveryClosure');
      const hero=$('.deliveryHero');if(hero&&!$('.deliveryTruth')){const truth=document.createElement('section');truth.className='deliveryTruth';hero.insertAdjacentElement('afterend',truth);}
      const panels=$$('.deliveryGrid .stack:first-child > .deliveryPanel');
      const why=$$('.deliveryGrid aside .deliveryPanel').find(p=>$('.eyebrow',p)?.textContent.includes('WHY IT MATTERS'));
      if(why&&!$('.closureWhy',why))why.insertAdjacentHTML('beforeend','<div class="closureWhy"><b>审片工具停在“可以了”。</b><span>ReelOps 继续把客户确认转换成 Final Master、Deliverables、Delivery Record 与 Archive。</span></div>');
      const next=s=>{
        const v=s.approvedVersion||'Approved Version';
        if(!s.approval)return ['客户确认正式 Version','Client Review Space','Version Approval 是进入交付的唯一门槛'];
        if(!s.finalMasterReady)return ['生成 Final Master','制片 / 后期',`${v} Approved 先固化为统一母版`];
        const n=(s.deliveryItems||[]).filter(Boolean).length;
        if(n<4)return ['准备全部 Deliverables','制片 / 交付',`${n} / 4 Ready · 交付件统一来自 Final Master`];
        if(!s.deliveryRecord)return ['完成客户交付','制片统筹','创建独立 Delivery Record，而不是只标记“已发送”'];
        if(!s.archiveRecord)return ['归档 Project Aurora','制片统筹','闭合 Creative → Production → Approval → Delivery 关系'];
        return ['项目已闭环','Archive Record','完整生产与交付记录已形成'];
      };
      const render=()=>{
        const s=state(),n=next(s),ready=(s.deliveryItems||[]).filter(Boolean).length,v=s.approvedVersion||'V4';
        const truth=$('.deliveryTruth');if(truth)truth.innerHTML=`<div class="deliveryTruthCell primary"><small>CURRENT TRUTH</small><b>${window.ReelOpsState.deliveryLabel(s)}</b><span>SHOT 08 · ${s.approval?v+' Approved':'等待 Version Approval'}</span></div><div class="deliveryTruthCell ${s.archiveRecord?'good':'warn'}"><small>NEXT STATE CHANGE</small><b>${n[0]}</b><span>${n[2]}</span></div><div class="deliveryTruthCell"><small>NEXT OWNER</small><b>${n[1]}</b><span>Ready ≠ Delivered · Approved ≠ Archived</span><div class="closureLineage"><span class="closureObj ${s.approval?'done':'current'}">Approval</span><span class="closureArrow">→</span><span class="closureObj ${s.finalMasterReady?'done':s.approval?'current':'locked'}">Final Master</span><span class="closureArrow">→</span><span class="closureObj ${ready===4?'done':s.finalMasterReady?'current':'locked'}">Deliverables</span><span class="closureArrow">→</span><span class="closureObj ${s.deliveryRecord?'done':ready===4?'current':'locked'}">Delivery Record</span><span class="closureArrow">→</span><span class="closureObj ${s.archiveRecord?'done':s.deliveryRecord?'current':'locked'}">Archive</span></div></div>`;
        const done=[!!s.approval,!!s.finalMasterReady,ready===4,!!s.deliveryRecord,!!s.archiveRecord],current=done.findIndex(v=>!v);
        panels.forEach((p,i)=>{p.classList.remove('futureLocked','currentClosure','doneClosure');if(done[i])p.classList.add('doneClosure');else if(i===current)p.classList.add('currentClosure');else if(current>=0&&i>current)p.classList.add('futureLocked');});
      };
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
    }
  });
})();