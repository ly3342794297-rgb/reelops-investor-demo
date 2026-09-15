(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    if(!['post.html','review.html','delivery.html'].includes(file))return;
    const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],state=()=>ReelOpsState.get();
    const tone=(done,current,wait=false)=>done?'done':current?(wait?'wait':'current'):'locked';
    const cycleHTML=s=>{
      const v3Approved=s.approval&&s.approvedVersion==='V3',v4Approved=s.approval&&s.approvedVersion==='V4';
      const rows=[
        ['V3 Submitted','正式 Version 进入客户审阅',!!s.v3Submitted,!!s.workingComposite&&!s.v3Submitted,false],
        ['Client Decision',v3Approved?'V3 Approved':s.v3ChangesRequested?'Changes Requested':'等待客户',v3Approved||!!s.v3ChangesRequested,!!s.v3Submitted&&!s.v3ChangesRequested&&!s.approval,true],
        ['Feedback Resolved',v3Approved?'本轮无需 Revision':`${s.feedbackResolved||0} / 3 已处理`,v3Approved||(s.feedbackResolved||0)===3,!!s.v3ChangesRequested&&(s.feedbackResolved||0)<3,false],
        ['V4 Draft',v3Approved?'Skipped':s.v4Draft?'Created':'等待 Revision 闭合',v3Approved||!!s.v4Draft,!!s.v3ChangesRequested&&(s.feedbackResolved||0)===3&&!s.v4Draft,false],
        ['V4 Decision',v3Approved?'Not needed':v4Approved?'Approved':s.v4ChangesRequested?'Changes Requested':s.v4Submitted?'In Review':'等待提交',v3Approved||v4Approved,!!s.v4Submitted&&!s.approval||!!s.v4ChangesRequested,true]
      ];
      return rows.map((x,i)=>`<div class="revisionStep ${tone(x[2],x[3],x[4])}"><small>0${i+1}</small><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
    };
    const sync=render=>{queueMicrotask(render);setTimeout(render,0)};

    if(file==='post.html'){
      const anchor=$('.productionBoundary')||$('.lineage');
      if(anchor&&!$('.revisionCycle')){const rail=document.createElement('section');rail.className='revisionCycle';anchor.insertAdjacentElement('afterend',rail)}
      const feedback=$('#feedbackSection')||$$('.appMain section').find(sec=>$('.eyebrow',sec)?.textContent.includes('FEEDBACK'));
      if(feedback&&!$('#revisionAction')){const a=document.createElement('div');a.id='revisionAction';a.className='revisionAction';feedback.insertAdjacentElement('beforebegin',a)}
      const render=()=>{
        const s=state(),rail=$('.revisionCycle'),a=$('#revisionAction'),revisionInput=!!(s.v3ChangesRequested&&!s.v4ChangesRequested&&!s.approval&&s.approvedVersion!=='V3');
        if(rail)rail.innerHTML=cycleHTML(s);
        document.body.classList.toggle('waitingV3Decision',!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval));
        document.body.classList.toggle('hasRevisionInput',revisionInput);
        document.body.classList.toggle('secondRevisionActive',!!(s.v4ChangesRequested&&!s.approval));
        document.body.classList.add('postRuntimeReady');
        if(feedback)feedback.style.display=revisionInput?'block':'none';
        const reviewObj=$('#reviewObj');
        if(reviewObj&&s.v4ChangesRequested&&!s.approval){
          reviewObj.className='versionObj current';
          const b=$('b',reviewObj),sp=$('span',reviewObj);
          if(b)b.textContent='V4 · Changes Requested';
          if(sp)sp.textContent='客户决策已记录 · 下一正式版本应为 V5';
        }
        if(a){
          a.className='revisionAction';
          if(!s.workingComposite)a.innerHTML='<div><small>REVISION CYCLE</small><b>先建立 Working Composite</b><span>内部工作状态不是正式 Version。</span></div>';
          else if(!s.v3Submitted)a.innerHTML='<div><small>NEXT VERSION EVENT</small><b>正式提交 V3</b><span>只有 Submitted Version 才能接收客户正式 Feedback。</span></div>';
          else if(s.approval&&s.approvedVersion==='V3'){a.className='revisionAction done';a.innerHTML='<div><small>VERSION DECISION</small><b>V3 · Approved</b><span>Revision Cycle 在 V3 结束，可直接进入交付。</span></div><a class="btn" href="delivery.html">进入交付 →</a>'}
          else if(!s.v3ChangesRequested&&!s.approval){a.className='revisionAction waiting';a.innerHTML='<div><small>WAITING FOR CLIENT</small><b>V3 · In Review</b><span>Post 不能提前制造“未来反馈”。</span></div><a class="btn" href="review.html?stage=versions">打开客户审阅 →</a>'}
          else if(s.v4ChangesRequested){a.className='revisionAction waiting';a.innerHTML='<div><small>SECOND REVISION CYCLE</small><b>V4 · Changes Requested</b><span>正式 Version 不覆盖；下一正式版本应创建 V5。当前概念 Demo 不继续模拟第二轮。</span></div>'}
          else if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3){a.innerHTML=`<div><small>REVISION INPUT</small><b>V3 · Changes Requested</b><span>当前已处理 ${s.feedbackResolved||0} / 3 条正式 Feedback。</span></div>`}
          else if(s.v3ChangesRequested&&!s.v4Draft){a.className='revisionAction done';a.innerHTML='<div><small>REVISION READY</small><b>3 / 3 Feedback Resolved</b><span>可以形成 V4 Draft。</span></div>'}
          else if(s.v4Draft&&!s.v4Submitted&&!s.v4ChangesRequested){a.innerHTML='<div><small>NEXT VERSION EVENT</small><b>正式提交 V4</b><span>Draft 对客户不可见；Submit 后才进入 Client Review。</span></div>'}
          else if(s.v4Submitted&&!s.approval){a.className='revisionAction waiting';a.innerHTML='<div><small>WAITING FOR CLIENT</small><b>V4 · In Review</b><span>Post 不能替客户创建 Version Approval。</span></div><a class="btn" href="review.html?stage=versions">打开 V4 审阅 →</a>'}
          else if(s.approval){a.className='revisionAction done';a.innerHTML=`<div><small>VERSION APPROVAL</small><b>${s.approvedVersion||'V4'} · Approved</b><span>独立 Approval Record 已形成。</span></div><a class="btn" href="delivery.html">进入交付 →</a>`}
        }
      };
      render();window.addEventListener('reelops:state',()=>sync(render));
    }

    if(file==='review.html'){
      const hero=$('#versionsStage .reviewHero');if(hero&&!$('#versionsStage .revisionCycle')){const rail=document.createElement('section');rail.className='revisionCycle';hero.insertAdjacentElement('afterend',rail)}
      const render=()=>{const rail=$('#versionsStage .revisionCycle');if(rail)rail.innerHTML=cycleHTML(state())};render();window.addEventListener('reelops:state',()=>sync(render));
    }

    if(file==='delivery.html'){
      const replace=(root,from,to)=>{if(!root||from===to)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode())if(w.currentNode.nodeValue.includes(from))w.currentNode.nodeValue=w.currentNode.nodeValue.split(from).join(to)};
      const render=()=>{const s=state();if(!s.approval)return;const v=s.approvedVersion||'V4',root=$('.deliveryShell')||document.body;replace(root,'V4 Approved',v+' Approved');replace(root,'Approved V4',v+' Approved');replace(root,'SHOT 08 · V4 · Approved','SHOT 08 · '+v+' · Approved');const vs=$('#versionState');if(vs)vs.textContent='SHOT 08 · '+v+' · Approved'};render();window.addEventListener('reelops:state',()=>sync(render));
    }
  });
})();