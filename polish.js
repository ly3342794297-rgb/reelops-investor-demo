(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState?.get?.()||{},set=p=>window.ReelOpsState?.set?.(p);
    const make=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
    const byEyebrow=text=>$$('.eyebrow').find(e=>e.textContent.trim().includes(text))?.closest('section,.projectPanel,.producerPanel')||null;

    function nextAction(s){
      if(!s.creativeSubmitted)return {title:'发布 Creative Direction',detail:'由导演整理客户可见内容，并正式提交创意审阅。',href:'director.html'};
      if(s.creativeChangesRequested)return {title:'修订 Creative Direction',detail:'客户已要求修改；创建下一 Creative Version 后重新提交。',href:'director.html'};
      if(!s.creativeApproval)return {title:'等待 Creative Approval',detail:'客户确认后，正式 Production Gate 才打开。',href:'review.html?stage=creative'};
      if(!s.aiReady)return {title:'补齐 AI Ready',detail:'Capture Complete 不等于 AI Ready；补齐现场输入。',href:'live-action.html'};
      if(!s.packageSent)return {title:'发送 AI Production Package',detail:'把 Shot Context、Preserve / Change 与现场输入正式交给 AIGC。',href:'live-action.html'};
      if(!s.genAsset)return {title:'创建 Selected Asset',detail:'Variant 只有写入 SHOT 08 Assets 后才改变项目记录。',href:'generation.html'};
      if(!s.workingComposite)return {title:'建立 Working Composite',detail:'多来源 Asset 先进入内部工作状态。',href:'post.html'};
      if(!s.v3Submitted)return {title:'正式提交 V3',detail:'Working Composite 不是 Version；先提交 V3 才能进入客户决策。',href:'post.html'};
      if(s.v3Submitted&&!s.v3ChangesRequested&&!s.approval)return {title:'等待 V3 客户决策',detail:'客户可以直接确认 V3，或明确提出修改。',href:'review.html?stage=versions'};
      if(s.v4ChangesRequested&&!s.approval)return {title:'第二轮 Revision · 下一版 V5',detail:'正式 Version 不覆盖；当前概念 Demo 不继续模拟第二轮。',href:'post.html'};
      if(s.v3ChangesRequested&&(s.feedbackResolved||0)<3)return {title:'闭合 V3 客户反馈',detail:`还有 ${3-(s.feedbackResolved||0)} 条正式 Feedback 未处理。`,href:'post.html'};
      if(s.v3ChangesRequested&&!s.v4Draft)return {title:'生成 V4 Draft',detail:'3 条 V3 Feedback 闭合后形成下一版草稿。',href:'post.html'};
      if(s.v4Draft&&!s.v4Submitted)return {title:'正式提交 V4',detail:'Submit 后 V4 才进入 Client Review Space。',href:'post.html'};
      if(s.v4Submitted&&!s.approval)return {title:'等待 V4 Version Approval',detail:'客户对正式 V4 创建独立 Version Decision。',href:'review.html?stage=versions'};
      if(!s.finalMasterReady)return {title:'生成 Final Master',detail:`${s.approvedVersion||'Approved Version'} 需要先固化为统一交付母版。`,href:'delivery.html'};
      if((s.deliveryItems||[]).filter(Boolean).length<4)return {title:'准备 Deliverables',detail:`当前 ${(s.deliveryItems||[]).filter(Boolean).length} / 4 Ready。`,href:'delivery.html'};
      if(!s.deliveryRecord)return {title:'创建 Delivery Record',detail:'Ready 不等于 Delivered；客户交付需要独立记录。',href:'delivery.html'};
      if(!s.archiveRecord)return {title:'归档 Project Aurora',detail:'Archive 是项目最后一个生产状态。',href:'delivery.html'};
      return {title:'Project Aurora 已闭环',detail:'完整 Production Record 已形成。',href:'project.html'};
    }

    if(file==='project.html'){
      document.body.classList.add('projectFocused');
      const hero=$('.projectHero');
      if(hero&&!$('.projectTruthBar')){const truth=make('section','projectTruthBar');hero.insertAdjacentElement('afterend',truth);const render=()=>{const s=state(),n=nextAction(s),phase=window.ReelOpsState?.projectPhase?.(s)||'Pre-production';truth.innerHTML=`<div class="ptLead"><span>PROJECT TRUTH</span><b>${phase}</b></div><div class="ptMain"><small>NEXT STATE CHANGE</small><strong>${n.title}</strong><p>${n.detail}</p></div><a href="${n.href}">打开当前动作 →</a>`};render();window.addEventListener('reelops:state',render)}
      byEyebrow('PRODUCTION HEALTH')?.classList.add('secondaryPanel');byEyebrow('WORKSPACES')?.classList.add('secondaryPanel');
    }

    if(file==='producer.html'){
      document.body.classList.add('producerFocused');
      const hero=$('.producerHero');if(hero&&!$('.producerThesis'))hero.insertAdjacentHTML('afterend','<div class="producerThesis"><span>PRODUCER RULE</span><b>看阻塞、追依赖、确认责任。</b><p>制片统筹不替导演做创意，不替客户做 Approval，也不把“文件存在”当成“生产状态完成”。</p></div>');
      byEyebrow('PROJECT LIFECYCLE')?.classList.add('secondaryPanel');
      const mini=byEyebrow('DELIVERABLES')?.querySelector('.deliverableMini');
      if(mini){const names=['30s · 16:9 Master','30s · Web H.264','15s · 9:16 Social','6s · 1:1 Cutdown'];const render=()=>{const s=state(),items=s.deliveryItems||[false,false,false,false];mini.innerHTML=names.map((name,i)=>{const done=!!items[i],label=done?'Ready':s.finalMasterReady?'Pending':'Locked';return `<div class="deliveryMiniRow ${!s.finalMasterReady&&!done?'isLocked':''}"><span>${name}</span><b class="${done?'miniReady':''}">${label}</b></div>`}).join('')};render();window.addEventListener('reelops:state',render)}
    }

    if(file==='director.html'){
      document.body.classList.add('directorPage');
      $('.mediaWide')?.classList.add('cinematicMedia');
      const subtitle=$('.appMain > .small');
      if(subtitle&&!$('.directorMeta')){const meta=make('div','directorMeta');subtitle.insertAdjacentElement('afterend',meta);const render=()=>{const s=state();meta.innerHTML=`<span class="pill">Creative Direction · ${s.creativeVersion||'V2'}</span><span class="pill">SHOT 08 · 12s</span><span class="pill">Live Action + AIGC + CG / 后期</span>`};render();window.addEventListener('reelops:state',render)}
      const versionBtn=$$('.subnav button').find(b=>b.textContent.includes('版本审阅'));versionBtn?.classList.add('directorDeferredTab');
      const versionSection=$$('section').find(sec=>$('h2',sec)?.textContent.includes('V3 客户反馈'));
      if(versionSection){versionSection.classList.add('directorVersionContext');const head=$('h2',versionSection)?.parentElement;if(head&&!head.querySelector('.eyebrow'))head.insertAdjacentHTML('afterbegin','<div class="eyebrow">VERSION CONTEXT · 非创意确认</div>')}
      const firstNotice=$('.sidePanel .notice');if(firstNotice&&!$('.visibilityHeader',firstNotice)){const title=$('b',firstNotice);if(title){const head=make('div','visibilityHeader');title.replaceWith(head);head.appendChild(title);head.insertAdjacentHTML('beforeend','<span class="small">发布，而不是开放后台权限</span>')}}
      const creativeState=$('#creativeState');if(creativeState&&!$('.creativeStatusRail')){const rail=make('div','creativeStatusRail');creativeState.closest('.stateBlock')?.insertAdjacentElement('afterend',rail);const render=()=>{const s=state(),decisionLabel=s.creativeChangesRequested?'Revision Requested':'Creative Approval';rail.innerHTML=`<span class="${s.creativeSubmitted?'done':'active'}">Internal Draft</span><span class="${s.creativeSubmitted&&!s.creativeApproval&&!s.creativeChangesRequested?'active':s.creativeApproval?'done':''}">Client Review</span><span class="${s.creativeApproval?'done':s.creativeChangesRequested?'active':''}">${decisionLabel}</span>`;versionSection?.classList.toggle('isSuppressed',!s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Draft&&!s.v4Submitted&&!s.approval)};render();window.addEventListener('reelops:state',render)}
      const submit=$('#submitCreative');if(submit)submit.onclick=e=>{e.preventDefault();const s=state();if(s.creativeSubmitted&&!s.creativeApproval&&!s.creativeChangesRequested){location.href='review.html?stage=creative';return}if(s.creativeChangesRequested||s.creativeApproval)return;set({creativeSubmitted:true,creativeSubmittedAt:new Date().toISOString(),creativeApproval:false,creativeApprovalAt:null,creativeChangesRequested:false,newCreativeFeedback:0});const t=$('#toast');if(t){t.textContent='Creative Direction '+(s.creativeVersion||'V2')+' 已发布给客户';t.classList.add('show')}setTimeout(()=>location.href='review.html?stage=creative',480)};
    }

    if(file==='review.html'){
      document.body.classList.add('clientReviewSpace');
      $('#shareStoryboard .mediaWide')?.classList.add('storyboardMedia');
      const compare=$$('#versionsStage .reviewPanel[data-panel="compare"] .mediaWide');compare[0]?.classList.add('cinematicMedia','compareOld');compare[1]?.classList.add('cinematicMedia','compareNew');
      const stageWrap=$('.stageBtn')?.parentElement;
      if(stageWrap?.parentElement&&!$('.clientProgress')){const progress=make('div','clientProgress');stageWrap.parentElement.appendChild(progress);const render=()=>{const s=state(),hasVersion=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Draft||s.v4Submitted||s.v4ChangesRequested||s.approval),delivered=!!(s.deliveryRecord||s.delivered),creativeState=s.creativeApproval?'Creative Approved':s.creativeChangesRequested?'Changes Requested · Waiting for revision':s.creativeSubmitted?'Waiting for decision':'Not published',versionState=s.approval?`${s.approvedVersion||'V4'} Approved`:s.v4ChangesRequested?'V4 Changes Requested':s.v4Submitted?'V4 In Review':s.v3ChangesRequested?'V3 Changes Requested':s.v3Submitted?'V3 In Review':'Not submitted';progress.innerHTML=`<div class="step ${s.creativeApproval?'done':s.creativeSubmitted?'current':''}"><b>01 创意审阅</b><span>${creativeState}</span></div><div class="step ${s.creativeApproval&&!hasVersion?'current':hasVersion?'done':'locked'}"><b>02 制作中</b><span>${s.creativeApproval?'Direction locked':'After creative approval'}</span></div><div class="step ${hasVersion&&!s.approval?'current':s.approval?'done':'locked'}"><b>03 成片审阅</b><span>${versionState}</span></div><div class="step ${s.approval&&!delivered?'current':delivered?'done':'locked'}"><b>04 最终交付</b><span>${delivered?'Delivered':s.approval?'Ready for delivery':'After version approval'}</span></div>`};render();window.addEventListener('reelops:state',render)}
      $$('.eyebrow').forEach(e=>{if(e.textContent.includes('客户可见')&&!$('.clientVisibleMark',e))e.insertAdjacentHTML('beforeend','<span class="clientVisibleMark">CLIENT VISIBLE</span>')});
    }

    if(file==='live-action.html'){
      document.body.classList.add('hybridCapturePage');
      const right=$('.appTop .right');if(right&&!$('.creativeCapturePill',right)){const p=make('span','pill creativeCapturePill');right.prepend(p);const render=()=>{const s=state();p.textContent=s.creativeApproval?`${s.creativeVersion||'V2'} · Creative Approved`:`${s.creativeVersion||'V2'} · Creative Pending`;p.style.background=s.creativeApproval?'var(--green2)':'#fffaf2'};render();window.addEventListener('reelops:state',render)}
    }

    if(file==='studio.html')document.body.classList.add('studioPolished');
  });
})();