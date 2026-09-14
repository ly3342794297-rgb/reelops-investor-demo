(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s);
    const state=()=>ReelOpsState.get();
    function closureAction(s){
      if(!s.approval)return null;
      const v=s.approvedVersion||'V4';
      if(!s.finalMasterReady)return ['生成 Final Master',`${v} Approved 需要先固化为交付母版。`];
      if((s.deliverables||0)<4)return ['补齐交付件矩阵',`${s.deliverables||0} / 4 Ready · Final Master 已就绪。`];
      if(!s.deliveryRecord)return ['完成客户交付','4 / 4 Ready · 创建独立 Delivery Record。'];
      if(!s.archiveRecord)return ['归档 Project Aurora','Delivery Record 已完成，等待项目归档。'];
      return ['项目已闭环','Archive Record 已创建。'];
    }
    function renderProject(){
      if(file!=='project.html')return;const s=state(),action=closureAction(s);if(!action)return;const v=s.approvedVersion||'V4';
      const summary=$('#summaryDelivery');if(summary)summary.textContent=ReelOpsState.deliveryLabel(s);
      const list=$('#todayList');if(list){const old=$('.deliveryClosureAction',list);if(old)old.remove();if(!s.archiveRecord){const row=document.createElement('div');row.className='todayItem primaryAction deliveryClosureAction';row.innerHTML=`<div class="todayNum">D</div><div><b>${action[0]}</b><p>${action[1]}</p></div><a href="delivery.html">打开 →</a>`;list.prepend(row)}}
      const health=$('#healthGrid');if(health){const cards=[...health.querySelectorAll('.health')];const d=cards[cards.length-1];if(d){d.classList.remove('good','attn','wait');d.classList.add(s.deliveryRecord?'good':'attn');const strong=d.querySelector('strong'),span=d.querySelector('span');if(strong)strong.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${s.deliverables||0}/4 Ready`:'Final Master Pending';if(span)span.textContent=s.archiveRecord?'项目记录已闭合':s.deliveryRecord?'Delivery Record 已完成':s.finalMasterReady?'完成交付矩阵后创建记录':`从 ${v} Approved 创建最终母版`;}}
    }
    function renderProducer(){
      if(file!=='producer.html')return;const s=state(),action=closureAction(s);if(!action)return;const v=s.approvedVersion||'V4';
      const value=$('#deliveryPulseValue'),sub=$('#deliveryPulseSub');if(value)value.textContent=s.archiveRecord?'Archived':s.deliveryRecord?'Delivered':s.finalMasterReady?`${s.deliverables||0} / 4`:'Final Master';if(sub)sub.textContent=s.archiveRecord?'Project closure complete':s.deliveryRecord?'Delivery Record complete':s.finalMasterReady?'Deliverables Ready':`Pending from ${v} Approved`;
      const riskTitle=$('#riskTitle'),riskText=$('#riskText');if(riskTitle)riskTitle.textContent=action[0];if(riskText)riskText.textContent=action[1];
      const list=$('#attentionList');if(list){const old=$('.deliveryClosureAttention',list);if(old)old.remove();if(!s.archiveRecord){const row=document.createElement('div');row.className='attentionItem high deliveryClosureAttention';row.innerHTML=`<div class="num">D</div><div><b>${action[0]}</b><p>${action[1]}</p></div><a class="go" href="delivery.html">打开 →</a>`;list.prepend(row)}}
      const last=$('#miniLast');if(last)last.textContent=(s.deliveryItems||[])[3]?'Ready':'Pending';
    }
    const render=()=>{renderProject();renderProducer()};render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
  });
})();