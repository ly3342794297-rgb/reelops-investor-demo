(()=>{
  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    const state=()=>window.ReelOpsState?.get?.()||{};
    const set=(p)=>window.ReelOpsState?.set?.(p);
    const make=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};

    if(file==='director.html'){
      document.body.classList.add('directorPage');
      const media=$('.mediaWide'); if(media) media.classList.add('cinematicMedia');
      const subtitle=$('.appMain > .small');
      if(subtitle){
        const meta=make('div','directorMeta','<span class="pill">Creative Direction · V2</span><span class="pill">SHOT 08 · 12s</span><span class="pill">Live Action + AIGC + CG / 后期</span>');
        subtitle.insertAdjacentElement('afterend',meta);
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
        const render=()=>{const s=state();progress.innerHTML=`<div class="step ${s.creativeApproval?'done':s.creativeSubmitted?'current':''}"><b>01 创意审阅</b><span>${s.creativeApproval?'Creative Approved':s.creativeSubmitted?'Waiting for decision':'Not published'}</span></div><div class="step ${s.creativeApproval&&!s.v4Submitted?'current':s.v4Submitted||s.approval?'done':!s.creativeApproval?'locked':''}"><b>02 制作中</b><span>${s.creativeApproval?'Direction locked':'After creative approval'}</span></div><div class="step ${s.v4Submitted&&!s.approval?'current':s.approval?'done':!s.v4Submitted?'locked':''}"><b>03 成片审阅</b><span>${s.approval?'Version Approved':s.v4Submitted?'V4 · In Review':'Not submitted'}</span></div><div class="step ${s.approval&&!s.delivered?'current':s.delivered?'done':'locked'}"><b>04 最终交付</b><span>${s.delivered?'Delivered':s.approval?'Ready for delivery':'After version approval'}</span></div>`};
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
      const side=$('.studioSide');
      if(side){
        const block=make('div','stateBlock','<b>Creative Direction</b><span id="studioCreativeState"></span>');
        const card=$('.studioCard'); if(card) card.insertAdjacentElement('beforebegin',block);
        const render=()=>{const s=state();const el=$('#studioCreativeState');if(el)el.textContent=s.creativeApproval?(s.creativeVersion||'V2')+' · Approved':s.creativeSubmitted?(s.creativeVersion||'V2')+' · In Review':'Internal Draft';};render();window.addEventListener('reelops:state',render);
      }
    }
  });
})();
