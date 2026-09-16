(()=>{
  const boot=()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState.get();
    const approvedVersion=s=>s.approval?(s.approvedVersion||'V4'):null;
    const replaceText=(root,pairs)=>{
      if(!root)return;
      const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
      while(w.nextNode())nodes.push(w.currentNode);
      nodes.forEach(n=>{let v=n.nodeValue;pairs.forEach(([a,b])=>{if(v.includes(a))v=v.split(a).join(b)});n.nodeValue=v});
    };
    const syncCanonicalFeedback=()=>replaceText(document.body,[
      ['产品高光保留现在这版','最后停留多 1 秒'],
      ['产品高光保持上一版方向','最后停留已延长 1 秒'],
      ['产品高光保持 V3 方向','最后停留延长 1 秒']
    ]);

    function syncPost(s){
      if(file!=='post.html')return;
      const action=$('#revisionAction'),submit=$('#submitBtn'),feedback=$$('.appMain section').find(sec=>$('.eyebrow',sec)?.textContent.includes('FEEDBACK'));
      const approved=approvedVersion(s),formalTitle=$('#formalVersionTitle'),formalState=$('#formalVersionState');
      if(approved){
        if(formalTitle)formalTitle.textContent=`${approved} · Approved`;
        if(formalState)formalState.textContent=`${approved} · Approved`;
      }
      if(s.v4ChangesRequested&&!s.approval){
        if(action){action.className='revisionAction waiting';action.innerHTML='<div><small>SECOND REVISION CYCLE</small><b>V4 · Changes Requested</b><span>正式 Version 不应被覆盖。生产级逻辑下一次正式提交应创建 V5；当前概念 Demo 只建模 V3 → V4 这一轮 Revision Cycle。</span></div><a class="btn" href="review.html?stage=versions">查看 V4 客户决策 →</a>';}
        if(submit){submit.disabled=true;submit.textContent='下一正式版本应为 V5 · Demo 未建模';}
        if(feedback)feedback.style.display='none';
        const reviewObj=$('#reviewObj');if(reviewObj){reviewObj.className='versionObj current';const b=$('b',reviewObj),sp=$('span',reviewObj);if(b)b.textContent='V4 · Changes Requested';if(sp)sp.textContent='客户决策已记录 · 下一正式版本应为 V5';}
        const gate=$('#postGate');if(gate){gate.classList.remove('good');gate.innerHTML='<b>V4 · Changes Requested</b><p>正式 Version 不覆盖。V4 保持为已提交并被客户决策过的历史版本；生产级下一正式版本应创建 V5，当前概念 Demo 不继续模拟第二轮 Revision。</p>';}
        const rail=$('.revisionCycle');if(rail){const steps=$$('.revisionStep',rail),last=steps[steps.length-1];if(last){last.className='revisionStep wait';const b=$('b',last),sp=$('span',last);if(b)b.textContent='V4 Changes Requested';if(sp)sp.textContent='下一正式 Version 应创建 V5';}}
      }
    }

    function setVersionSummary(s){
      const side=$('#versionsStage .sidePanel');if(!side)return;
      const blocks=$$('.stateBlock',side);
      const prev=blocks.find(x=>$('b',x)?.textContent.includes('上一轮反馈'))?.querySelector('span');
      const notice=$$('.notice',side).find(x=>$('b',x)?.textContent.includes('修改摘要')||$('b',x)?.textContent.includes('首次正式审阅')||$('b',x)?.textContent.includes('VERSION'));
      const nb=notice?.querySelector('b'),np=notice?.querySelector('p');
      if(s.approval&&s.approvedVersion==='V3'){
        if(prev)prev.textContent='无 · V3 直接通过';if(nb)nb.textContent='VERSION APPROVAL';if(np)np.textContent='V3 在首次正式审阅中直接通过，没有创建 V4 Revision。';return;
      }
      if(s.approval&&s.approvedVersion==='V4'){
        if(prev)prev.textContent='V3 · 3 / 3 已处理';if(nb)nb.textContent='VERSION APPROVAL RECORD';if(np)np.textContent='V4 已由客户确认。V3 的 3 条 Revision Input 已在 V4 中闭合；该 Approval 独立于 V4 Version 对象。';return;
      }
      if(s.v4ChangesRequested){
        if(prev)prev.textContent='V3 · 3 / 3 已处理';if(nb)nb.textContent='V4 · Changes Requested';if(np)np.textContent='客户已对 V4 提出新修改。下一正式版本应创建 V5，而不是覆盖 V4。';return;
      }
      if(s.v4Submitted){
        if(prev)prev.textContent='V3 · 3 / 3 已处理';if(nb)nb.textContent='V4 修改摘要';if(np)np.textContent='人物进入提前；背景层次减弱；最后停留延长 1 秒。';return;
      }
      if(s.v3ChangesRequested){
        if(prev)prev.textContent='V3 · 3 条修改已创建';if(nb)nb.textContent='V3 修改请求';if(np)np.textContent='3 条反馈现在才成为正式 Revision Input，并全部绑定 SHOT 08 · V3。';return;
      }
      if(s.v3Submitted){
        if(prev)prev.textContent='无 · 首次正式审阅';if(nb)nb.textContent='V3 首次正式审阅';if(np)np.textContent='当前可以直接确认 V3，或者提出修改。此时后期还没有 V3 Feedback。';return;
      }
      if(prev)prev.textContent='—';if(nb)nb.textContent='VERSION REVIEW';if(np)np.textContent='等待后期正式提交 Version。内部 Working Composite 不会显示给客户。';
    }

    function guardCreativeRevision(){
      const approve=$('#creativeApprove'),changes=$('#creativeChanges'),form=$('#creativeFeedbackForm');
      [approve,changes].filter(Boolean).forEach(btn=>{
        if(btn.dataset.revisionGuard)return;btn.dataset.revisionGuard='1';
        btn.addEventListener('click',e=>{if(state().creativeChangesRequested){e.preventDefault();e.stopImmediatePropagation();}},true);
      });
      if(form&&!form.dataset.revisionGuard){form.dataset.revisionGuard='1';form.addEventListener('submit',e=>{if(state().creativeChangesRequested){e.preventDefault();e.stopImmediatePropagation();}},true);}
    }

    function syncReview(s){
      if(file!=='review.html')return;
      guardCreativeRevision();
      const creativeApprove=$('#creativeApprove'),creativeChanges=$('#creativeChanges'),creativeForm=$('#creativeFeedbackForm'),creativeStageState=$('#creativeStageState'),creativeBadge=$('#creativeBadge');
      if(s.creativeChangesRequested){
        if(creativeApprove){creativeApprove.disabled=true;creativeApprove.textContent='等待修订版本 →';}
        if(creativeChanges){creativeChanges.disabled=true;creativeChanges.textContent='修改请求已记录 ✓';}
        if(creativeForm)creativeForm.style.display='none';
        if(creativeStageState)creativeStageState.textContent='· Revision 中';
        if(creativeBadge)creativeBadge.textContent='等待修订版本';
      }
      setVersionSummary(s);
      const v=approvedVersion(s)||(s.v4Submitted||s.v4ChangesRequested?'V4':s.v3Submitted||s.v3ChangesRequested?'V3':null);
      const screen=$('#versionsStage .reviewScreen');
      if(screen&&v)screen.style.backgroundImage=`url('assets/${v==='V3'?'shot08-v3.svg':'shot08-v4.svg'}')`;
      const tabs=$('#versionTabs');
      if(tabs){const hasV4=!!(s.v4Submitted||s.v4ChangesRequested||s.approval&&s.approvedVersion==='V4');tabs.style.display=hasV4?'flex':'none';}
      const summary=$('#revisionSummary');if(summary)summary.style.display=(s.v4Submitted||s.v4ChangesRequested||s.approval&&s.approvedVersion==='V4')?'block':'none';
      if(s.v4ChangesRequested&&!s.approval){
        const title=$('#reviewTitle'),version=$('#reviewVersion'),stage=$('#versionStageState');
        if(title)title.textContent='V4 · 已要求修改';
        if(version)version.textContent='SHOT 08 · V4 · Changes Requested';
        if(stage)stage.textContent='· V4 Revision';
        const banner=$('#versionsStage .clientDecisionBanner');
        if(banner){banner.className='clientDecisionBanner changes';banner.innerHTML='<div><small>YOUR DECISION · SHOT 08 · V4</small><b>V4 已要求修改</b><p>反馈已绑定 V4 并同步回 Post。正式 Version 保持不可覆盖；下一次正式提交应创建 V5。</p></div><span class="clientDecisionStatus">CHANGES REQUESTED</span>';}
        const rail=$('#versionsStage .revisionCycle');if(rail){const steps=$$('.revisionStep',rail),last=steps[steps.length-1];if(last){last.className='revisionStep wait';const b=$('b',last),sp=$('span',last);if(b)b.textContent='V4 Changes Requested';if(sp)sp.textContent='下一正式 Version 应创建 V5';}}
      }
    }

    function syncDelivery(s){
      if(file!=='delivery.html'||!s.approval)return;
      const v=approvedVersion(s)||'V4';
      const root=$('.deliveryShell')||document.body;
      replaceText(root,[['SHOT 08 · V4 · Approved',`SHOT 08 · ${v} · Approved`],['Approved V4',`${v} Approved`],['V4 Approved',`${v} Approved`],['Source Version · V4 Approved',`Source Version · ${v} Approved`]]);
      const badge=$('#versionState');if(badge)badge.textContent=`SHOT 08 · ${v} · Approved`;
    }

    function syncGlobalEdge(s){
      if(!s.v4ChangesRequested||s.approval)return;
      const truth=$('.projectTruthBar .ptMain'),presentation=$('.presentationBand'),producer=$('.producerControlBar'),inspector=$('.shotInspector');
      if(truth){const strong=$('strong',truth),p=$('p',truth);if(strong)strong.textContent='V4 已要求修改 · 下一正式版本应为 V5';if(p)p.textContent='正式 Version 不覆盖；当前概念 Demo 暂未建模第二轮 Revision Cycle。';}
      if(presentation){const cells=$$('.presentationCell',presentation);if(cells[1]){const b=$('b',cells[1]),sp=$('span',cells[1]);if(b)b.textContent='后期';if(sp)sp.textContent='Second Revision Cycle · V5';}if(cells[2]){const b=$('b',cells[2]);if(b)b.textContent='V4 Changes Requested · V5 尚未建模';}}
      if(producer){const cells=$$('.producerControlCell',producer);if(cells[0]){const b=$('b',cells[0]);if(b)b.textContent='V4 Changes Requested · 下一正式版本应为 V5';}if(cells[1]){const b=$('b',cells[1]),sp=$('span',cells[1]);if(b)b.textContent='后期';if(sp)sp.textContent='Second Revision Cycle';}}
      if(inspector){const next=$('[data-si="next"]',inspector);if(next){next.href='post.html';const b=$('b',next),sp=$('span',next);if(b)b.textContent='进入第二轮 Revision Cycle';if(sp)sp.textContent='V4 已要求修改。正式版本不可覆盖；生产级下一版应创建 V5。';}}
    }

    function syncClosureCopy(s){
      const v=approvedVersion(s);if(!v)return;
      ['#todayList','#attentionList','.presentationBand','.producerControlBar','.shotInspector','.deliveryTruth'].forEach(sel=>replaceText($(sel),[['Approved V4',`${v} Approved`],['V4 Approved',`${v} Approved`]]));
    }

    function sync(){const s=state();syncPost(s);syncReview(s);syncDelivery(s);syncGlobalEdge(s);syncClosureCopy(s);syncCanonicalFeedback();}
    const schedule=()=>setTimeout(sync,110);
    sync();setTimeout(sync,180);window.addEventListener('reelops:state',schedule);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();