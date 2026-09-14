(()=>{
  const boot=()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

    if(!window.ReelOpsState.__qaWrapped){
      const originalSet=window.ReelOpsState.set.bind(window.ReelOpsState);
      window.ReelOpsState.set=(patch={})=>{
        let next={...patch};
        const current=window.ReelOpsState.get();
        if(next.v4Submitted===true){
          next.v4ChangesRequested=false;
          next.changesRequested=false;
          next.v4SubmittedAt=new Date().toISOString();
        }
        if(next.approval===true&&!next.approvedVersion){
          next.approvedVersion=current.v4Submitted?'V4':(current.v3Submitted&&!current.v3ChangesRequested?'V3':current.approvedVersion||'V4');
        }
        return originalSet(next);
      };
      window.ReelOpsState.__qaWrapped=true;
    }

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
        if(action){action.className='revisionAction waiting';action.innerHTML=`<div><small>V4 REVISION</small><b>V4 · Changes Requested</b><span>客户已对 V4 提出新修改。当前 Version 回到 Post；处理完成后重新提交 V4，而不是创建 V5。</span></div><a class="btn" href="review.html?stage=versions">查看客户决策 →</a>`;}
        if(submit){submit.disabled=!s.v4Draft||(s.feedbackResolved||0)<3;submit.textContent='重新提交 V4 给客户审阅 →';}
        if(feedback)feedback.style.display='none';
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
        if(banner){banner.className='clientDecisionBanner changes';banner.innerHTML='<div><small>YOUR DECISION · SHOT 08 · V4</small><b>V4 已要求修改</b><p>反馈已绑定 V4 并同步回 Post。重新提交前，客户空间不会把内部工作状态当成新的正式 Version。</p></div><span class="clientDecisionStatus">CHANGES REQUESTED</span>';}
      }
    }

    function syncDelivery(s){
      if(file!=='delivery.html'||!s.approval)return;
      const v=approvedVersion(s)||'V4';
      const root=$('.deliveryShell')||document.body;
      replaceText(root,[['SHOT 08 · V4 · Approved',`SHOT 08 · ${v} · Approved`],['Approved V4',`${v} Approved`],['V4 Approved',`${v} Approved`],['Source Version · V4 Approved',`Source Version · ${v} Approved`]]);
      const badge=$('#versionState');if(badge)badge.textContent=`SHOT 08 · ${v} · Approved`;
    }

    function syncClosureCopy(s){
      const v=approvedVersion(s);if(!v)return;
      ['#todayList','#attentionList','.presentationBand','.producerControlBar','.shotInspector','.deliveryTruth'].forEach(sel=>replaceText($(sel),[['Approved V4',`${v} Approved`],['V4 Approved',`${v} Approved`]]));
    }

    function sync(){const s=state();syncPost(s);syncReview(s);syncDelivery(s);syncClosureCopy(s);}
    const schedule=()=>setTimeout(sync,70);
    sync();setTimeout(sync,140);window.addEventListener('reelops:state',schedule);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
})();