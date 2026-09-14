(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const $=s=>document.querySelector(s);
    const cta=$('.sidePanel a[href^="live-action.html"]');
    if(!cta||!window.ReelOpsState)return;

    const gate=document.createElement('div');
    gate.className='directorDecisionGate';
    cta.insertAdjacentElement('beforebegin',gate);

    const render=()=>{
      const s=ReelOpsState.get();
      const visible=Object.entries(s.creativeShared||{}).filter(([k,v])=>k!=='decisionLog'&&v).length;
      const approved=!!s.creativeApproval;
      gate.innerHTML=`
        <div class="ddgTop"><span class="ddgDot ${approved?'ok':'wait'}"></span><b>${approved?'Creative Approval 已锁定':'Creative Approval 尚未锁定'}</b></div>
        <div class="ddgGrid">
          <span><small>CLIENT VISIBLE</small><b>${visible} 个对象</b></span>
          <span><small>CREATIVE VERSION</small><b>${s.creativeVersion||'V2'}</b></span>
          <span><small>PRODUCTION GATE</small><b>${approved?'OPEN':'PREP ONLY'}</b></span>
        </div>
        <p>${approved?'正式制作可以沿已确认的 Shot Intent、Storyboard 与 Preserve / Change 规则执行。':'当前允许内部技术准备、测试和现场方案确认；正式开拍前建议完成客户创意确认。'}</p>`;
      if(approved){
        cta.href='live-action.html';
        cta.textContent='进入正式实拍 + AI 协作 →';
        cta.classList.add('primary');
        cta.classList.remove('blue');
      }else{
        cta.href='live-action.html?mode=prep';
        cta.textContent='进入实拍技术准备 →';
        cta.classList.remove('primary');
        cta.classList.add('blue');
      }
    };
    render();
    window.addEventListener('reelops:state',render);
  });
})();
