(()=>{
  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState?.get?.()||{};
    const set=(p)=>window.ReelOpsState?.set?.(p);
    const make=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
    const byEyebrow=(text)=>$$('.eyebrow').find(e=>e.textContent.trim().includes(text))?.closest('section,.projectPanel,.producerPanel')||null;

    function nextProjectAction(s){
      if(!s.creativeSubmitted)return {k:'CREATIVE',title:'发布 Creative Direction',detail:'由导演整理客户可见内容，并正式提交创意审阅。',href:'director.html'};
      if(s.creativeChangesRequested)return {k:'CREATIVE',title:'处理客户创意修改',detail:'形成下一版 Creative Direction，再次提交客户。',href:'director.html'};
      if(!s.creativeApproval)return {k:'CLIENT DECISION',title:'等待 Creative Approval',detail:'客户确认后，正式制作方向才被锁定。',href:'review.html?stage=creative'};
      if(!s.aiReady)return {k:'CAPTURE',title:'补齐 AI Ready',detail:'确认跟踪、灯光与 Camera / Lens 等现场输入。',href:'live-action.html'};
      if(!s.packageSent)return {k:'HANDOFF',title:'发送 AI 制作包',detail:'把 Shot Context 与 Preserve / Change 规则交给生成制作。',href:'live-action.html'};
      if(!s.genAsset)return {k:'AIGC',title:'选择 Selected Asset',detail:'Variant 只有被选择并加入 Shot，才成为项目素材。',href:'generation.html'};
      if(!s.workingComposite)return {k:'POST',title:'建立 Working Composite',detail:'把实拍、AIGC 与 CG / Post 汇入同一镜头工作状态。',href:'post.html'};
      if((s.feedbackResolved||0)<3)return {k:'REVISION',title:'闭合 V3 客户反馈',detail:`还有 ${3-(s.feedbackResolved||0)} 条反馈未处理。`,href:'post.html'};
      if(!s.v4Draft)return {k:'VERSION',title:'生成 V4 Draft',detail:'反馈闭合后才能形成下一正式版本草稿。',href:'post.html'};
      if(!s.v4Submitted)return {k:'VERSION',title:'正式提交 V4',detail:'提交后才创建 V4 · In Review。',href:'post.html'};
      if(!s.approval)return {k:'CLIENT DECISION',title:'等待 Version Approval',detail:'客户确认 V4 后才产生独立 Approval Record。',href:'review.html?stage=versions'};
      if(!s.finalMasterReady)return {k:'DELIVERY',title:'生成 Final Master',detail:'Approved Version 不是最终交付母版。',href:'delivery.html'};
      if((s.deliveryItems||[]).filter(Boolean).length<4)return {k:'DELIVERY',title:'准备交付件',detail:'从 Final Master 生成并确认全部 Deliverables。',href:'delivery.html'};
      if(!s.deliveryRecord)return {k:'DELIVERY',title:'创建 Delivery Record',detail:'4 / 4 Ready 之后，正式记录客户交付。',href:'delivery.html'};
      if(!s.archiveRecord)return {k:'ARCHIVE',title:'归档 Project Aurora',detail:'保留创意、生产、版本、确认与交付的完整关系。',href:'delivery.html'};
      return {k:'CLOSED',title:'Project Aurora 已闭环',detail:'完整生产记录已经形成。',href:'project.html'};
    }

    if(file==='project.html'){
      document.body.classList.add('projectFocused');
      const hero=$('.projectHero');
      if(hero&&!$('.projectTruthBar')){
        const truth=make('section','projectTruthBar');
        hero.insertAdjacentElement('afterend',truth);
        const render=()=>{
          const s=state(),n=nextProjectAction(s),phase=window.ReelOpsState?.projectPhase?.(s)||'Production';
          truth.innerHTML=`<div class="ptLead"><span>PROJECT TRUTH</span><b>${phase}</b></div><div class="ptMain"><small>NEXT STATE CHANGE</small><strong>${n.title}</strong><p>${n.detail}</p></div><a href="${n.href}">打开当前动作 →</a>`;
        };
        render();window.addEventListener('reelops:state',render);
      }
      const record=$('.recordChain');
      if(record&&!$('#recordComposite')){
        const version=$('#recordVersion');
        if(version){
          const arrow=make('span','recordArrow','→');
          const comp=make('span','recordObj','Working Composite');comp.id='recordComposite';
          version.insertAdjacentElement('beforebegin',comp);comp.insertAdjacentElement('beforebegin',arrow);
        }
        const note=record.nextElementSibling;
        if(note?.classList.contains('small'))note.textContent='Variant ≠ Asset · Asset ≠ Working Composite · Working Composite ≠ Version · Version ≠ Approval。';
        const render=()=>{const s=state(),c=$('#recordComposite');if(!c)return;c.className='recordObj '+(s.workingComposite?'done':s.genAsset?'live':'');};
        render();window.addEventListener('reelops:state',render);
      }
      byEyebrow('PRODUCTION HEALTH')?.classList.add('secondaryPanel');
      byEyebrow('WORKSPACES')?.classList.add('secondaryPanel');
    }

    if(file==='producer.html'){
      document.body.classList.add('producerFocused');
      const hero=$('.producerHero');
      if(hero&&!$('.producerThesis'))hero.insertAdjacentHTML('afterend','<div class="producerThesis"><span>PRODUCER RULE</span><b>看阻塞、追依赖、确认责任。</b><p>制片统筹不替导演做创意，不替客户做 Approval，也不把“文件存在”当成“生产状态完成”。</p></div>');
      const shotPanel=byEyebrow('SHOT BOARD');
      if(shotPanel){const h=$('h2',shotPanel);if(h)h.textContent='Demo focus · SHOT 08';const p=$('.panelHead p',shotPanel);if(p)p.textContent='只展示当前演示镜头，避免用虚构数量制造“完整系统”错觉。';}
      byEyebrow('PROJECT LIFECYCLE')?.classList.add('secondaryPanel');
      const deliveryPanel=byEyebrow('DELIVERABLES');
      const mini=deliveryPanel?.querySelector('.deliverableMini');
      if(mini){
        const names=['30s · 16:9 Master','30s · Web H.264','15s · 9:16 Social','6s · 1:1 Cutdown'];
        const render=()=>{const s=state(),items=s.deliveryItems||[false,false,false,false];mini.innerHTML=names.map((n,i)=>`<div class="deliveryMiniRow"><span>${n}</span><b class="${items[i]?'miniReady':''}">${items[i]?'Ready':'Pending'}</b></div>`).join('');};
        render();window.addEventListener('reelops:state',render);
      }
    }

    if(file==='director.html'){
      document.body.classList.add('directorPage');
      const media=$('.mediaWide'); if(media) media.classList.add('cinematicMedia');
      const subtitle=$('.appMain > .small');
      if(subtitle){
        const meta=make('div','directorMeta','<span class="pill">Creative Direction · V2</span><span class="pill">SHOT 08 · 12s</span><span class="pill">Live Action + AIGC + CG / 后期</span>');
        subtitle.insertAdjacentElement('afterend',meta);
      }
      const subnav=$('.subnav');
      if(subnav){const versionBtn=$$('button',subnav).find(b=>b.textContent.includes('版本审阅'));if(versionBtn)versionBtn.classList.add('directorDeferredTab');}
      const versionSection=$$('section').find(sec=>$('h2',sec)?.textContent.includes('V3 客户反馈'));
      if(versionSection){
        versionSection.classList.add('directorVersionContext');
        const head=$('h2',versionSection)?.parentElement;
        if(head)head.insertAdjacentHTML('afterbegin','<div class="eyebrow">VERSION CONTEXT · 非创意确认</div>');
      }
      const notice=$('.sidePanel .notice');
      if(notice){
        const title=$('b',notice); if(title){const head=make('div','visibilityHeader');title.replaceWith(head);head.appendChild(title);head.insertAdjacentHTML('beforeend','<span class="small">发布，而不是开放后台权限</span>');}
      }
      const creativeState=$('#creativeState');
      if(creativeState){
        const rail=make('div','creativeStatusRail');
        creativeState.closest('.stateBlock')?.insertAdjacentElement('afterend',rail);
        const gate=make('div','productionGate');
        const liveLink=$('a[href="live-action.html"].btn.primary');
        if(liveLink) liveLink.insertAdjacentElement('beforebegin',gate);
        const render=()=>{
          const s=state();
          rail.innerHTML=`<span class="${s.creativeSubmitted?'done':'active'}">Internal Draft</span><span class="${s.creativeSubmitted&&!s.creativeApproval&&!s.creativeChangesRequested?'active':s.creativeApproval?'done':''}">Client Review</span><span class="${s.creativeApproval?'done':s.creativeChangesRequested?'active':''}">Creative Approval</span>`;
          gate.innerHTML=s.creativeApproval?'<b>创意方向已锁定 ✓</b><span>Creative Approval 已记录。SHOT 08 可以沿已确认方向进入正式制作。</span>':'<b>正式开拍前建议锁定创意方向</b><span>当前可以继续内部准备与技术测试，但客户尚未确认 Creative Direction。</span>';
          const meta=$('.directorMeta .pill'); if(meta) meta.textContent='Creative Direction · '+(s.creativeVersion||'V2');
          const top=$('#topState');if(top)top.textContent=!s.creativeApproval?(s.creativeSubmitted?'Creative · In Review':'Creative · Internal'):s.approval?'V4 · Approved':s.v4Submitted?'V4 · In Review':s.workingComposite?'Working Composite':'Production Ready';
          versionSection?.classList.toggle('isSuppressed',!s.creativeApproval&&!s.v4Submitted&&!s.workingComposite&&!s.genAsset);
        };
        render(); window.addEventListener('reelops:state',render);
      }
      const submit=$('#submitCreative');
      if(submit){
        submit.onclick=(e)=>{
          e.preventDefault(); const s=state();
          if(s.creativeSubmitted&&!s.creativeApproval&&!s.creativeChangesRequested){location.href='review.html?stage=creative';return;}
          let version=s.creativeVersion||'V2';
          if(s.creativeChangesRequested||s.creativeApproval){const n=parseInt(version.replace(/\D/g,''),10)||2;version='V'+(n+1);}
          set({creativeVersion:version,creativeSubmitted:true,creativeApproval:false,creativeApprovalAt:null,creativeChangesRequested:false,newCreativeFeedback:0});
          const t=$('#toast');if(t){t.textContent='Creative Direction '+version+' 已发布给客户';t.classList.add('show');}
          setTimeout(()=>location.href='review.html?stage=creative',480);
        };
      }
    }

    if(file==='review.html'){
      document.body.classList.add('clientReviewSpace');
      const storyboard=$('#shareStoryboard .mediaWide'); if(storyboard) storyboard.classList.add('storyboardMedia');
      const compare=$$('#versionsStage .reviewPanel[data-panel="compare"] .mediaWide'); if(compare[0]) compare[0].classList.add('cinematicMedia','compareOld'); if(compare[1]) compare[1].classList.add('cinematicMedia','compareNew');
      const stageWrap=$('.stageBtn')?.parentElement;
      if(stageWrap?.parentElement){
        const progress=make('div','clientProgress');stageWrap.parentElement.appendChild(progress);
        const render=()=>{const s=state(),delivered=!!(s.deliveryRecord||s.delivered);progress.innerHTML=`<div class="step ${s.creativeApproval?'done':s.creativeSubmitted?'current':''}"><b>01 创意审阅</b><span>${s.creativeApproval?'Creative Approved':s.creativeSubmitted?'Waiting for decision':'Not published'}</span></div><div class="step ${s.creativeApproval&&!s.v4Submitted?'current':s.v4Submitted||s.approval?'done':!s.creativeApproval?'locked':''}"><b>02 制作中</b><span>${s.creativeApproval?'Direction locked':'After creative approval'}</span></div><div class="step ${s.v4Submitted&&!s.approval?'current':s.approval?'done':!s.v4Submitted?'locked':''}"><b>03 成片审阅</b><span>${s.approval?'Version Approved':s.v4Submitted?'V4 · In Review':'Not submitted'}</span></div><div class="step ${s.approval&&!delivered?'current':delivered?'done':'locked'}"><b>04 最终交付</b><span>${delivered?'Delivered':s.approval?'Ready for delivery':'After version approval'}</span></div>`};
        render();window.addEventListener('reelops:state',render);
      }
      $$('.eyebrow').forEach(e=>{if(e.textContent.includes('客户可见'))e.insertAdjacentHTML('beforeend','<span class="clientVisibleMark">CLIENT VISIBLE</span>')});
    }

    if(file==='live-action.html'){
      document.body.classList.add('hybridCapturePage');
      const right=$('.appTop .right');
      if(right){const p=make('span','pill');right.prepend(p);const render=()=>{const s=state();p.textContent=s.creativeApproval?(s.creativeVersion||'V2')+' · Creative Approved':(s.creativeVersion||'V2')+' · Creative Pending';p.style.background=s.creativeApproval?'var(--green2)':'#fffaf2';};render();window.addEventListener('reelops:state',render);}
      const main=$('.appMain');
      if(main){const s=state();const note=make('div','productionGate',s.creativeApproval?'<b>Creative Approval 已锁定 ✓</b><span>现场执行沿已确认的 Shot Intent 与 Preserve / Change 规则进行。</span>':'<b>Creative Direction 尚未客户确认</b><span>当前页面可用于内部技术准备；正式拍摄前建议完成 Creative Approval。</span>');const nav=$('.subnav');if(nav)nav.insertAdjacentElement('afterend',note);}
    }

    if(file==='studio.html'){
      document.body.classList.add('studioPolished');
      const core=$('.startupCore');
      if(core) core.innerHTML='<img src="assets/reelops-logo-crop.png" alt="ReelOps" style="width:190px;max-width:44vw;filter:invert(1);opacity:.95"><div class="sub">PRODUCTION FIRST · SOFTWARE NEXT</div>';
      const clientZone=$('a[href="review.html"].studioZone');
      const setClientRoute=()=>{if(!clientZone)return;const s=state();const stage=(!s.creativeApproval||s.creativeSubmitted&&!s.creativeApproval)?'creative':(s.v4Submitted&&!s.approval?'versions':'creative');clientZone.href='review.html?stage='+stage;};
      setClientRoute();window.addEventListener('reelops:state',setClientRoute);
      const side=$('.studioSide');
      if(side){
        const block=make('div','stateBlock','<b>Creative Direction</b><span id="studioCreativeState"></span>');
        const card=$('.studioCard'); if(card) card.insertAdjacentElement('beforebegin',block);
        const render=()=>{const s=state();const el=$('#studioCreativeState');if(el)el.textContent=s.creativeApproval?(s.creativeVersion||'V2')+' · Approved':s.creativeSubmitted?(s.creativeVersion||'V2')+' · In Review':'Internal Draft';};render();window.addEventListener('reelops:state',render);
      }
    }
  });
})();