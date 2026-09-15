(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const $=s=>document.querySelector(s);
    const cta=$('.sidePanel a[href^="live-action.html"]'),submit=$('#submitCreative');
    if(!cta||!window.ReelOpsState)return;

    if(!document.querySelector('style[data-director-gate]')){
      const style=document.createElement('style');
      style.dataset.directorGate='1';
      style.textContent=`
        .directorDecisionGate{margin-top:15px;border:1px solid var(--line);background:#fbfbfa;border-radius:14px;padding:13px}
        .ddgTop{display:flex;align-items:center;gap:8px}.ddgTop b{font-size:11px}.ddgDot{width:7px;height:7px;border-radius:50%;flex:0 0 auto}.ddgDot.ok{background:#17824f;box-shadow:0 0 0 4px rgba(23,130,79,.09)}.ddgDot.wait{background:#b26b10;box-shadow:0 0 0 4px rgba(178,107,16,.09)}
        .ddgGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:11px}.ddgGrid span{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px;min-width:0}.ddgGrid small{display:block;font-size:7px;letter-spacing:.09em;color:var(--muted);white-space:nowrap}.ddgGrid b{display:block;margin-top:5px;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.directorDecisionGate p{font-size:9px;color:var(--muted);line-height:1.55;margin:10px 0 0}
        @media(max-width:620px){.ddgGrid{grid-template-columns:1fr}.ddgGrid span{display:flex;align-items:center;justify-content:space-between;gap:8px}.ddgGrid b{margin-top:0}}
      `;
      document.head.appendChild(style);
    }

    const gate=document.createElement('div');
    gate.className='directorDecisionGate';
    cta.insertAdjacentElement('beforebegin',gate);

    const toast=t=>{const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1600)};
    const nextVersion=v=>`V${(parseInt(String(v||'V2').replace(/\D/g,''),10)||2)+1}`;
    if(submit)submit.addEventListener('click',e=>{
      const s=ReelOpsState.get();
      if(!s.creativeChangesRequested&&!s.creativeApproval)return;
      e.preventDefault();e.stopImmediatePropagation();
      const v=nextVersion(s.creativeVersion);
      ReelOpsState.set({creativeVersion:v,creativeSubmitted:true,creativeSubmittedAt:new Date().toISOString(),creativeApproval:false,creativeApprovalAt:null,creativeChangesRequested:false,newCreativeFeedback:0});
      toast(`Creative Direction ${v} 已作为新版本提交客户审阅`);
      setTimeout(()=>location.href='review.html?stage=creative',520);
    },true);

    const render=()=>{
      const s=ReelOpsState.get();
      const visible=Object.entries(s.creativeShared||{}).filter(([k,v])=>k!=='decisionLog'&&v).length;
      const approved=!!s.creativeApproval;
      const treatment=$('.shareToggle[data-key="treatment"]')?.closest('.checkCard')?.querySelector('b');if(treatment)treatment.textContent=`Treatment · ${s.creativeVersion||'V2'}`;
      gate.innerHTML=`
        <div class="ddgTop"><span class="ddgDot ${approved?'ok':'wait'}"></span><b>${approved?'Creative Approval 已锁定':'Creative Approval 尚未锁定'}</b></div>
        <div class="ddgGrid">
          <span><small>CLIENT VISIBLE</small><b>${visible} 个对象</b></span>
          <span><small>CREATIVE VERSION</small><b>${s.creativeVersion||'V2'}</b></span>
          <span><small>PRODUCTION GATE</small><b>${approved?'OPEN':'PREP ONLY'}</b></span>
        </div>
        <p>${approved?'正式制作可以沿已确认的 Shot Intent、Storyboard 与 Preserve / Change 规则执行。':'当前允许内部技术准备、测试和现场方案确认；正式制作交接必须完成客户创意确认。'}</p>`;
      if(submit&&s.creativeChangesRequested)submit.textContent=`提交 ${nextVersion(s.creativeVersion)} 客户创意审阅 →`;
      if(submit&&s.creativeApproval)submit.textContent=`创建 ${nextVersion(s.creativeVersion)} 并重新审阅 →`;
      if(approved){
        cta.href='live-action.html';cta.textContent='进入正式实拍 + AI 协作 →';cta.classList.add('primary');cta.classList.remove('blue');
      }else{
        cta.href='live-action.html?mode=prep';cta.textContent='进入实拍技术准备 →';cta.classList.remove('primary');cta.classList.add('blue');
      }
    };
    render();window.addEventListener('reelops:state',()=>setTimeout(render,0));
  });
})();
