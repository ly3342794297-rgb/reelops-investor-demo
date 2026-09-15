(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>ReelOpsState.get();

    function syncMiniDeliverables(s){
      if(file!=='producer.html')return;
      const items=Array.isArray(s.deliveryItems)?s.deliveryItems:[false,false,false,false];
      $$('.deliverableMini .deliveryMiniRow').forEach((row,i)=>{const b=$('b',row);if(!b)return;const done=!!items[i];b.textContent=done?'Ready':s.finalMasterReady?'Pending':'Locked';b.classList.toggle('miniReady',done);row.classList.toggle('isLocked',!s.finalMasterReady&&!done)});
    }

    function renderProject(s){
      if(file!=='project.html')return;
      const summary=$('#summaryDelivery');if(summary)summary.textContent=ReelOpsState.deliveryLabel(s);
      if(!s.approval)return;
      const v=s.approvedVersion||'V4',health=$('#healthGrid');
      if(health){const cards=[...health.querySelectorAll('.health')],d=cards[cards.length-1];if(d){d.classList.remove('good','attn','wait');d.classList.add(s.archiveRecord||s.deliveryRecord?'good':'attn');const strong=d.querySelector('strong'),span=d.querySelector('span');if(strong)strong.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${s.deliverables||0}/4 Ready`:'Final Master Pending';if(span)span.textContent=s.archiveRecord?'项目记录已闭合':s.deliveryRecord?'Delivery Record 已完成':s.finalMasterReady?'完成交付矩阵后创建记录':`从 ${v} Approved 创建最终母版`;}}
    }

    function renderProducer(s){
      if(file!=='producer.html')return;
      syncMiniDeliverables(s);
      if(!s.approval)return;
      const v=s.approvedVersion||'V4',value=$('#deliveryPulseValue'),sub=$('#deliveryPulseSub');
      if(value)value.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${s.deliverables||0} / 4`:'Final Master';
      if(sub)sub.textContent=s.archiveRecord?'Project closure complete':s.deliveryRecord?'Delivery Record complete':s.finalMasterReady?'Deliverables Ready':`Pending from ${v} Approved`;
    }

    const render=()=>{const s=state();renderProject(s);renderProducer(s)};
    render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
  });
})();