(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const file=(location.pathname.split('/').pop()||'').toLowerCase();
    if(!['post.html','review.html','delivery.html'].includes(file))return;
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState.get();
    const set=p=>window.ReelOpsState.set(p);
    const fmt=v=>{if(!v)return '—';try{return new Date(v).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return 'Recorded'}};
    const toast=t=>{const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1600)};
    const tone=(done,current,wait=false)=>done?'done':current?(wait?'wait':'current'):'locked';
    const cycleHTML=s=>[
      ['V3 Submitted','正式版本进入客户审阅',s.v3Submitted, s.workingComposite&&!s.v3Submitted,false],
      ['Changes Requested','客户对 V3 提出修改',s.v3ChangesRequested||s.approval&&s.approvedVersion==='V3', s.v3Submitted&&!s.v3ChangesRequested&&!s.approval,true],
      ['Feedback Resolved',`${s.feedbackResolved||0} / 3 已处理`,(s.feedbackResolved||0)===3, s.v3ChangesRequested&&(s.feedbackResolved||0)<3,false],
      ['V4 Draft','后期形成下一正式版本',s.v4Draft, s.v3ChangesRequested&&(s.feedbackResolved||0)===3&&!s.v4Draft,false],
      ['V4 Review',s.approval&&s.approvedVersion==='V4'?'Approved':s.v4Submitted?'In Review':'等待提交',s.v4Submitted||s.approval&&s.approvedVersion==='V4',s.v4Draft&&!s.v4Submitted,false]
    ].map((x,i)=>`<div class="revisionStep ${tone(x[2],x[3],x[4])}"><small>0${i+1}</small><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');

    if(file==='post.html'){
      const side=$('.sidePanel');
      const anchor=$('.productionBoundary')||$('.lineage');
      if(anchor&&!$('.revisionCycle')){const rail=document.createElement('section');rail.className='revisionCycle';anchor.insertAdjacentElement('afterend',rail);}
      const feedbackSection=$$('.appMain section').find(sec=>$('.eyebrow',sec)?.textContent.includes('FEEDBACK'));
      if(feedbackSection&&!$('#revisionAction')){const action=document.createElement('div');action.id='revisionAction';action.className='revisionAction';feedbackSection.insertAdjacentElement('beforebegin',action);}
      const postButtons=$('.postButtons',side);
      if(postButtons&&!$('#submitV3Btn')){
        const b=document.createElement('button');b.id='submitV3Btn';b.className='btn blue';b.textContent='提交 V3 给客户审阅 →';postButtons.insertAdjacentElement('afterbegin',b);
        b.addEventListener('click',()=>{const s=state();if(!s.workingComposite||s.v3Submitted)return;set({v3Submitted:true,v3SubmittedAt:new Date().toISOString(),v3ChangesRequested:false,v3ChangesAt:null,v4Draft:false,v4Submitted:false,v4SubmittedAt:null,v4ChangesRequested:false,feedbackResolvedItems:[false,false,false],newClientFeedback:0});toast('V3 已正式提交 Client Review Space');setTimeout(()=>location.href='review.html?stage=versions',420);});
      }
      const formalBlock=$$('.stateBlock',side).find(x=>$('b',x)?.textContent.includes('当前正式 Version'))?.querySelector('span');
      const render=()=>{
        const s=state(),rail=$('.revisionCycle');if(rail)rail.innerHTML=cycleHTML(s);
        document.body.classList.toggle('waitingV3Decision',!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval));
        const route=$('.productionRoute');
        if(route){
          const outputTitle=s.approval?`${s.approvedVersion||'V4'} · Approved`:s.v4Submitted?'V4 · In Review':s.v4Draft?'V4 Draft':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':s.workingComposite?'Formal Version · V3':'Formal Version';
          const outputSub=s.approval?'Version Approval 已形成':s.v4Submitted?'正式 Version 已进入客户决策':s.v4Draft?'下一版草稿 · 尚未客户可见':s.v3ChangesRequested?'3 条反馈进入 Revision':s.v3Submitted?'等待客户决策':'Composite 不是 Version';
          const workTitle=s.workingComposite?'Working Composite · Created':'Working Composite';
          route.innerHTML=`<div class="productionRouteCell ${s.genAsset?'done':'current'}"><small>01 · INPUT</small><b>${s.genAsset?'Production Assets · Ready':'Waiting for Selected Asset'}</b><span>Live Action + AIGC + CG/Post</span></div><div class="productionRouteCell ${s.workingComposite?'done':s.genAsset?'current':'locked'}"><small>02 · WORK</small><b>${workTitle}</b><span>内部工作状态 · 客户不可见</span></div><div class="productionRouteCell ${s.approval||s.v4Submitted?'done':s.v4Draft||s.v3Submitted?'current':'locked'}"><small>03 · OUTPUT</small><b>${outputTitle}</b><span>${outputSub}</span></div>`;
        }
        const submitV3=$('#submitV3Btn');
        if(submitV3){submitV3.disabled=!s.workingComposite||s.v3Submitted||!!s.approval;submitV3.textContent=s.approval&&s.approvedVersion==='V3'?'V3 已确认 ✓':s.v3ChangesRequested?'V3 · Changes Requested ✓':s.v3Submitted?'V3 · In Review ✓':'提交 V3 给客户审阅 →';}
        if(formalBlock)formalBlock.textContent=s.approval?`${s.approvedVersion||'V4'} · Approved`:s.v4Submitted?'V4 · In Review':s.v4Draft?'V3 · Changes Requested → V4 Draft':s.v3ChangesRequested?'V3 · Changes Requested':s.v3Submitted?'V3 · In Review':s.workingComposite?'尚未提交正式 Version':'尚未进入 Version Revision';
        const action=$('#revisionAction');
        if(action){
          if(!s.workingComposite){action.className='revisionAction';action.innerHTML='<div><small>REVISION CYCLE</small><b>先建立 Working Composite</b><span>内部工作状态准备好以后，才能形成第一个正式 Version。</span></div>';}
          else if(!s.v3Submitted){action.className='revisionAction';action.innerHTML='<div><small>NEXT VERSION EVENT</small><b>把当前工作状态正式提交为 V3</b><span>只有 Submitted Version 才能接收客户正式反馈。</span></div><button class="btn blue" data-rev-submit>提交 V3 →</button>';action.querySelector('[data-rev-submit]')?.addEventListener('click',()=>$('#submitV3Btn')?.click());}
          else if(!s.v3ChangesRequested&&!s.approval){action.className='revisionAction waiting';action.innerHTML='<div><small>WAITING FOR CLIENT</small><b>V3 · In Review</b><span>当前不能提前处理“未来反馈”。等待客户确认或明确提出修改。</span></div><a class="btn" href="review.html?stage=versions">打开客户审阅 →</a>';}
          else if(s.approval&&s.approvedVersion==='V3'){action.className='revisionAction done';action.innerHTML='<div><small>VERSION DECISION</small><b>V3 · Approved</b><span>客户已确认 V3，本轮 Revision Cycle 在此结束，直接进入 Final Master / Delivery。</span></div><a class="btn" href="delivery.html">进入交付 →</a>';}
          else if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3){action.className='revisionAction';action.innerHTML=`<div><small>REVISION INPUT</small><b>V3 · Changes Requested</b><span>客户提出 3 条明确修改。当前已处理 ${s.feedbackResolved||0} / 3。</span></div>`;}
          else if(s.v3ChangesRequested&&!s.v4Draft){action.className='revisionAction done';action.innerHTML='<div><small>REVISION READY</small><b>3 / 3 Feedback Resolved</b><span>所有 V3 反馈已闭合，可以形成 V4 Draft。</span></div>';}
          else if(s.v4Submitted&&!s.approval){action.className='revisionAction waiting';action.innerHTML='<div><small>WAITING FOR CLIENT</small><b>V4 · In Review</b><span>V4 已正式提交。后期不能替客户创建 Version Approval。</span></div><a class="btn" href="review.html?stage=versions">打开 V4 审阅 →</a>';}
          else if(s.approval){action.className='revisionAction done';action.innerHTML=`<div><small>VERSION APPROVAL</small><b>${s.approvedVersion||'V4'} · Approved</b><span>独立 Approval Record 已形成。</span></div><a class="btn" href="delivery.html">进入交付 →</a>`;}
        }
        if(feedbackSection)feedbackSection.style.display=s.v3ChangesRequested&&!s.approval&&s.approvedVersion!=='V3'?'':'none';
        const draft=$('#draftBtn');if(draft&&!s.v3ChangesRequested){draft.disabled=true;draft.textContent='等待 V3 修改请求';}
        const submit=$('#submitBtn');if(submit&&!s.v4Draft)submit.disabled=true;
      };
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));setTimeout(render,90);
    }

    if(file==='review.html'){
      const stage=$('#versionsStage'),hero=$('.reviewHero',stage),content=$('#versionContent');
      if(hero&&!$('.revisionCycle',stage)){const rail=document.createElement('section');rail.className='revisionCycle';hero.insertAdjacentElement('afterend',rail);}
      if(content&&!$('#v3DecisionPanel')){const first=$(':scope > .panel',content)||content.firstElementChild;const panel=document.createElement('section');panel.id='v3DecisionPanel';panel.className='v3DecisionPanel';first?.insertAdjacentElement('afterend',panel);}
      const approve=$('#approve'),changes=$('#changes');
      if(changes)changes.addEventListener('click',e=>{
        const s=state();
        if(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.approval){e.preventDefault();e.stopImmediatePropagation();set({v3ChangesRequested:true,v3ChangesAt:new Date().toISOString(),v4Draft:false,v4Submitted:false,v4SubmittedAt:null,v4ChangesRequested:false,feedbackResolvedItems:[false,false,false],newClientFeedback:3});toast('V3 修改请求已记录，3 条反馈已同步回 Post');setTimeout(()=>location.href='post.html',650);return;}
        if(s.v4Submitted&&!s.approval){e.preventDefault();e.stopImmediatePropagation();set({v4ChangesRequested:true,v4Submitted:false,approval:false,approvedVersion:null,newClientFeedback:Math.max(1,s.newClientFeedback||0)});toast('V4 修改请求已同步回 Post');setTimeout(()=>location.href='post.html',650);}
      },true);
      if(approve)approve.addEventListener('click',e=>{
        const s=state();
        if(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.approval){e.preventDefault();e.stopImmediatePropagation();set({approval:true,approvedVersion:'V3',approvalAt:new Date().toISOString(),v3ChangesRequested:false,changesRequested:false});toast('V3 Version Approval Record 已创建');return;}
        if(s.v4Submitted&&!s.approval){e.preventDefault();e.stopImmediatePropagation();set({approval:true,approvedVersion:'V4',approvalAt:new Date().toISOString(),v4ChangesRequested:false,changesRequested:false});toast('V4 Version Approval Record 已创建');}
      },true);
      const render=()=>{
        const s=state(),rail=$('.revisionCycle',stage);if(rail)rail.innerHTML=cycleHTML(s);
        const v3Pending=!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.approval);
        const v3Changes=!!(s.v3ChangesRequested&&!s.v4Submitted&&!s.approval);
        document.body.classList.toggle('v3ReviewActive',v3Pending);
        document.body.classList.toggle('v3ChangesRecorded',v3Changes);
        const published=!!(s.v3Submitted||s.v4Submitted||s.approval);
        $('#versionLocked').style.display=published?'none':'block';if(content)content.style.opacity=published?'1':'.35';
        const panel=$('#v3DecisionPanel');
        if(panel){
          panel.style.display=(s.v3Submitted&&!s.v4Submitted)?'block':'none';
          panel.innerHTML=v3Changes?'<div class="k">V3 · CHANGES REQUESTED</div><h3>本轮修改已经成为正式生产输入。</h3><p>下面 3 条反馈现在才进入 Post，并且都绑定 SHOT 08 · V3。</p><div class="v3FeedbackPreview"><div><b>00:12</b><span>主体提前一点进入</span></div><div><b>00:18</b><span>背景层次再弱一点</span></div><div><b>00:24</b><span>产品高光保留现在这版</span></div></div><div class="revisionCycleNote">下一步由 Post 逐条处理，再形成 V4 Draft。</div>':'<div class="k">V3 · FIRST FORMAL REVIEW</div><h3>这是本轮 Revision Cycle 的起点。</h3><p>你可以直接确认 V3，或者明确提出修改。只有“需要修改”发生后，后期才会收到正式 Feedback 并进入 V4。</p><div class="revisionCycleNote">此刻 Post 还没有任何 V3 修改任务；系统不会预先制造客户反馈。</div>';
        }
        if(s.approval){
          const v=s.approvedVersion||'V4';$('#reviewTitle').textContent=`${v} · 已确认`;$('#reviewVersion').textContent=`SHOT 08 · ${v} · Approved`;$('#versionStageState').textContent='· 已确认';if(approve){approve.disabled=true;approve.textContent=`${v} 已确认 ✓`;}if(changes)changes.disabled=true;$('#deliveryLink').style.display='inline-flex';
        }else if(s.v4Submitted){
          $('#reviewTitle').textContent='V4 · 待客户确认';$('#reviewVersion').textContent='SHOT 08 · V4 · In Review';$('#versionStageState').textContent='· V4 待确认';if(approve){approve.disabled=false;approve.textContent='确认 V4 →';}if(changes){changes.disabled=false;changes.textContent='需要修改 →';}$('#deliveryLink').style.display='none';
        }else if(s.v3ChangesRequested){
          $('#reviewTitle').textContent='V3 · 已要求修改';$('#reviewVersion').textContent='SHOT 08 · V3 · Changes Requested';$('#versionStageState').textContent='· Revision 中';if(approve)approve.disabled=true;if(changes)changes.disabled=true;$('#deliveryLink').style.display='none';
        }else if(s.v3Submitted){
          $('#reviewTitle').textContent='V3 · 待客户确认';$('#reviewVersion').textContent='SHOT 08 · V3 · In Review';$('#versionStageState').textContent='· V3 待确认';if(approve){approve.disabled=false;approve.textContent='确认 V3 →';}if(changes){changes.disabled=false;changes.textContent='需要修改 →';}$('#deliveryLink').style.display='none';
        }else{
          $('#reviewTitle').textContent='等待正式版本';$('#reviewVersion').textContent='尚未提交';$('#versionStageState').textContent='· 待开始';if(approve)approve.disabled=true;if(changes)changes.disabled=true;
        }
        const feedback=$('#feedbackForm');if(feedback){const foot=$('.composerFoot .small',feedback);if(foot)foot.textContent=s.v4Submitted?'反馈将绑定 V4 · 00:12':s.v3Submitted?'反馈将绑定 V3 · 当前审阅':'等待正式 Version';}
        const banner=$('#versionsStage .clientDecisionBanner');
        if(banner){
          const v=s.approval?(s.approvedVersion||'V4'):s.v4Submitted?'V4':s.v3Submitted?'V3':null;
          banner.className='clientDecisionBanner '+(s.approval?'approved':v3Changes?'changes':'');
          banner.innerHTML=s.approval?`<div><small>YOUR DECISION · SHOT 08 · ${v}</small><b>${v} 已确认</b><p>Version Approval 已形成独立记录；下一步进入 Final Master 与 Delivery。</p></div><span class="clientDecisionStatus">APPROVED</span>`:v3Changes?'<div><small>YOUR DECISION · SHOT 08 · V3</small><b>已要求修改</b><p>3 条反馈已绑定 V3，并同步回 Post。V4 尚未出现。</p></div><span class="clientDecisionStatus">CHANGES REQUESTED</span>':v?`<div><small>YOUR DECISION · SHOT 08 · ${v}</small><b>确认当前正式版本，或提出具体修改</b><p>${v==='V3'?'如果要求修改，反馈将成为下一版 V4 的生产输入。':'当前是修订后的 V4；确认后创建独立 Version Approval。'}</p></div><span class="clientDecisionStatus">DECISION REQUIRED</span>`:'<div><small>YOUR DECISION</small><b>等待正式 Version</b><p>Working Composite 与内部测试不会进入客户空间。</p></div><span class="clientDecisionStatus">WAITING</span>';
        }
        const receipt=$('#versionReceipt');
        if(receipt&&s.approval){const v=s.approvedVersion||'V4';receipt.className='reviewDecisionReceipt';receipt.innerHTML=`<small>VERSION APPROVAL RECORD</small><b>SHOT 08 · ${v} · Approved</b><span>${fmt(s.approvalAt)} · 该 Approval Record 独立于 ${v} Version 对象。</span>`;}
      };
      const sync=()=>setTimeout(render,0);render();window.addEventListener('reelops:state',sync);setTimeout(render,120);
    }

    if(file==='delivery.html'){
      const replaceText=(root,from,to)=>{if(!root||from===to)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{if(n.nodeValue.includes(from))n.nodeValue=n.nodeValue.split(from).join(to)});};
      const render=()=>{
        const s=state(),v=s.approval?(s.approvedVersion||'V4'):null;if(!v)return;
        const vs=$('#versionState');if(vs)vs.textContent=`SHOT 08 · ${v} · Approved`;
        ['#approvalArea','#masterArea','#deliveryRail','.deliveryTruth'].forEach(sel=>replaceText($(sel),'V4',v));
      };
      render();window.addEventListener('reelops:state',()=>setTimeout(render,0));setTimeout(render,140);
    }
  });
})();