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

    function syncPost(s){
      if(file!=='post.html')return;
      const action=$('#revisionAction'),submit=$('#submitBtn'),feedback=$$('.appMain section').find(sec=>$('.eyebrow',sec)?.textContent.includes('FEEDBACK'));
      if(s.v4ChangesRequested&&!s.approval){
        if(action){action.className='revisionAction waiting';action.innerHTML='<div><small>SECOND REVISION CYCLE</small><b>V4 · Changes Requested</b><span>正式 Version 不应被覆盖。生产级逻辑下一次正式提交应创建 V5；当前概念 Demo 只建模 V3 → V4 这一轮 Revision Cycle。</span></div><a class="btn" href="review.html?stage=versions">查看 V4 客户决策 →</a>';}
        if(submit){submit.disabled=true;submit.textContent='下一正式版本应为 V5 · Demo 未建模';}
        if(feedback)feedback.style.display='none';
        const rail=$('.revisionCycle');if(rail){const steps=$$('.revisionStep',rail),last=steps[steps.length-1];if(last){last.className='revisionStep wait';const b=$('b',last),sp=$('span',last);if(b)b.textContent='V4 Changes Requested';if(sp)sp.textContent='下一正式 Version 应创建 V5';}}
      }
    }

    function syncReview(s){
      if(file!=='review.html')return;
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

    function sync(){const s=state();syncPost(s);syncReview(s);syncDelivery(s);syncGlobalEdge(s);syncClosureCopy(s);}
    const schedule=()=>setTimeout(sync,90);
    sync();setTimeout(sync,160);window.addEventListener('reelops:state',schedule);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();