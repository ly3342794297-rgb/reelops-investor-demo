(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if(!window.ReelOpsState)return;
    const $=s=>document.querySelector(s);
    const nav=$('.subnav');
    const packageBtn=$('#packageBtn');
    const sendBtn=$('#sendBtn');
    const badge=$('#aiBadge');
    if(!nav||!packageBtn)return;

    if(!document.querySelector('style[data-live-gate]')){
      const style=document.createElement('style');
      style.dataset.liveGate='1';
      style.textContent=`
        .captureGate{display:flex;align-items:flex-start;gap:10px;margin:-8px 0 18px;padding:12px 13px;border:1px solid var(--line);border-radius:13px;background:#fffaf2}
        .captureGate.ok{background:var(--green2);border-color:#c9e7d5}.captureGate .dot{width:7px;height:7px;border-radius:50%;background:#b26b10;margin-top:4px;flex:0 0 auto}.captureGate.ok .dot{background:#17824f}.captureGate b{font-size:11px}.captureGate span{display:block;margin-top:3px;font-size:9px;line-height:1.55;color:var(--muted)}
        .productionLocked{opacity:.5!important;cursor:not-allowed!important;filter:saturate(.45)}
      `;
      document.head.appendChild(style);
    }

    const gate=document.createElement('div');
    gate.className='captureGate';
    nav.insertAdjacentElement('afterend',gate);

    const originalText='生成 AI 制作包 →';
    const blockClick=e=>{
      const s=ReelOpsState.get();
      if(!s.creativeApproval){e.preventDefault();e.stopImmediatePropagation();const t=$('#toast');if(t){t.textContent='正式 AI 制作包需要先完成 Creative Approval';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}}
    };
    packageBtn.addEventListener('click',blockClick,true);
    if(sendBtn)sendBtn.addEventListener('click',blockClick,true);

    const render=()=>{
      const s=ReelOpsState.get();
      const approved=!!s.creativeApproval;
      const prep=new URLSearchParams(location.search).get('mode')==='prep'||!approved;
      gate.classList.toggle('ok',approved);
      gate.innerHTML=approved
        ? '<span class="dot"></span><div><b>Creative Approval 已锁定</b><span>现在的现场采集、AI Ready 与制作包可以进入正式生产记录。</span></div>'
        : '<span class="dot"></span><div><b>技术准备模式 · Creative Pending</b><span>可以检查拍摄方案、AI Ready 输入和补拍需求；正式制作包在客户创意确认前保持锁定。</span></div>';
      if(badge)badge.textContent=approved?'正式制作 · AI 协作中':'技术准备 · Creative Pending';
      packageBtn.classList.toggle('productionLocked',!approved);
      if(!approved){packageBtn.disabled=true;packageBtn.textContent='等待 Creative Approval 后生成正式制作包';}
      else{
        const readyCount=[...document.querySelectorAll('.checkGrid input[type="checkbox"]')].filter(i=>i.checked).length;
        packageBtn.disabled=readyCount<6||!!s.packageSent;
        packageBtn.textContent=s.packageSent?'AI 制作包已发送 ✓':originalText;
      }
      if(sendBtn){sendBtn.classList.toggle('productionLocked',!approved);sendBtn.setAttribute('aria-disabled',approved?'false':'true')}
      document.body.dataset.captureMode=prep?'prep':'production';
    };
    render();
    window.addEventListener('reelops:state',render);
    document.querySelectorAll('.checkGrid input').forEach(i=>i.addEventListener('change',()=>setTimeout(render,0)));
  });
})();
