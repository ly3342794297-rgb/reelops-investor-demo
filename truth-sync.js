(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();if(!['project.html','producer.html'].includes(file))return;
    const $=s=>document.querySelector(s), state=()=>window.ReelOpsState.get();
    const next=s=>{
      if(!s.creativeSubmitted)return ['director.html','发布 Creative Direction','由导演整理并发布客户可见的创意对象。','导演 / 创意'];
      if(s.creativeChangesRequested)return ['director.html','处理 Creative Direction 修改','形成下一版创意方向并重新提交客户。','导演 / 创意'];
      if(!s.creativeApproval)return ['review.html?stage=creative','等待 Creative Approval','客户确认创意方向后，正式 Production Gate 才打开。','客户'];
      if(!s.aiReady)return ['live-action.html','补齐 AI Ready','拍摄完成不等于 AI Ready；补齐跟踪、灯光与相机信息。','实拍 + AI'];
      if(!s.packageSent)return ['live-action.html','发送 AI Production Package','把 Shot Context、Preserve / Change 与现场输入正式交给 AIGC。','实拍 + AI'];
      if(!s.genAsset)return ['generation.html','创建 Selected Asset','Variant 被选择并写入 SHOT 08 Assets 后才改变项目状态。','AIGC'];
      if(!s.workingComposite)return ['post.html','建立 Working Composite','先把不同来源的 Assets 汇入内部工作状态。','后期'];
      if(!s.v3Submitted)return ['post.html','正式提交 V3','Working Composite 不是 Version；先提交 V3 才能进入客户正式审阅。','后期'];
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return ['review.html?stage=versions','等待 V3 客户决策','客户可以确认 V3，或者明确提出修改。','客户'];
      if(s.v4ChangesRequested&&!s.approval)return ['post.html','进入第二轮 Revision Cycle','V4 已要求修改。正式 Version 不覆盖；生产级下一次正式提交应创建 V5，当前概念 Demo 暂未建模。','后期'];
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return ['post.html','处理 V3 正式反馈',`还有 ${3-(s.feedbackResolved||0)} / 3 条反馈未闭合。`,'后期'];
      if(s.v3ChangesRequested&&!s.v4Draft)return ['post.html','生成 V4 Draft','V3 的 3 条反馈已闭合，可以形成下一正式版本草稿。','后期'];
      if(s.v4Draft&&!s.v4Submitted)return ['post.html','正式提交 V4','提交后才创建 V4 · In Review。','后期'];
      if(s.v4Submitted&&!s.approval)return ['review.html?stage=versions','等待 V4 Version Approval','客户对修订后的正式版本做最终版本决策。','客户'];
      if(!s.finalMasterReady)return ['delivery.html','生成 Final Master',`${s.approvedVersion||'Approved Version'} 先固化为统一交付母版。`,'制片 / 交付'];
      if((s.deliveryItems||[]).filter(Boolean).length<4)return ['delivery.html','准备全部 Deliverables',`${(s.deliveryItems||[]).filter(Boolean).length} / 4 Ready。`,'制片 / 交付'];
      if(!s.deliveryRecord)return ['delivery.html','创建 Delivery Record','Ready 不等于 Delivered；完成交付需要独立记录。','制片统筹'];
      if(!s.archiveRecord)return ['delivery.html','归档 Project Aurora','Delivery Record 完成后闭合整个项目上下文。','制片统筹'];
      return ['project.html','Project Aurora 已闭环','Archive Record 已形成。','—'];
    };
    const cls=(el,done,current)=>{if(el)el.className='recordObj '+(done?'done':current?'live':'')};
    const renderProject=s=>{
      const a=next(s),list=$('#todayList');
      if(list)list.innerHTML=`<div class="todayItem primaryAction chronologyTruth"><div class="todayNum">01</div><div><b>${a[1]}</b><p>${a[2]}</p></div><a href="${a[0]}">打开 →</a></div>`;
      const summary=$('#summaryShot');if(summary)summary.textContent=window.ReelOpsState.shotLabel(s);
      const hero=$('#heroShot');if(hero)hero.textContent='SHOT 08 · '+window.ReelOpsState.shotLabel(s);
      const delivery=$('#summaryDelivery');if(delivery)delivery.textContent=window.ReelOpsState.deliveryLabel(s);
      const client=$('#summaryClient');if(client)client.textContent=s.approval?`${s.approvedVersion||'V4'} · Version Approved`:s.v4ChangesRequested?'V4 · Changes Requested':s.v4Submitted?'V4 · Waiting for client':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · Waiting for client':s.creativeChangesRequested?'Creative Direction · Changes Requested':s.creativeApproval?'Creative Approved · 成片未提交':s.creativeSubmitted?'Creative Direction · Waiting for client':'Creative Direction · Not published';
      const reviewCurrent=!s.approval&&((s.v3Submitted&&!s.v3ChangesRequested)||s.v4Submitted);
      cls($('#recordAsset'),!!s.genAsset,!!s.packageSent&&!s.genAsset);
      cls($('#recordComposite'),!!s.workingComposite,!!s.genAsset&&!s.workingComposite);
      cls($('#recordVersion'),!!(s.v3Submitted||s.v4Draft||s.v4Submitted||s.approval),!!s.workingComposite&&!s.v3Submitted);
      cls($('#recordApproval'),!!s.approval,reviewCurrent);
      cls($('#recordDelivery'),!!(s.deliveryRecord||s.archiveRecord),!!s.approval&&!s.deliveryRecord);
    };
    const renderProducer=s=>{
      const a=next(s),list=$('#attentionList');
      if(list)list.innerHTML=`<div class="attentionItem high chronologyTruth"><div class="num">01</div><div><b>${a[1]}</b><p>${a[2]}</p></div><a class="go" href="${a[0]}">打开 →</a></div>`;
      const status=$('#shot08Status'),n=$('#shot08Next');if(status)status.textContent=window.ReelOpsState.shotLabel(s);if(n)n.textContent=a[1];
      const riskTitle=$('#riskTitle'),riskText=$('#riskText');if(riskTitle)riskTitle.textContent=a[1];if(riskText)riskText.textContent=a[2];
      const client=$('#clientPulseValue'),clientSub=$('#clientPulseSub');const waiting=a[3]==='客户';if(client)client.textContent=waiting?'等待客户':'无客户阻塞';if(clientSub)clientSub.textContent=waiting?a[1]:'当前下一责任人 · '+a[3];
    };
    const render=()=>{const s=state();if(file==='project.html')renderProject(s);else renderProducer(s)};
    render();window.addEventListener('reelops:state',()=>setTimeout(render,0));setTimeout(render,100);
  });
})();