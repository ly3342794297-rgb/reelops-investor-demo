(()=>{
  if(!document.querySelector('link[data-final-pass]')){const l=document.createElement('link');l.rel='stylesheet';l.href='final-pass.css';l.dataset.finalPass='1';document.head.appendChild(l)}
  if(!document.querySelector('script[data-final-pass]')){const s=document.createElement('script');s.src='final-pass.js';s.defer=true;s.dataset.finalPass='1';document.head.appendChild(s)}
  const apply=()=>{
    const dock=document.querySelector('.flowDock');if(!dock||dock.dataset.semantic==='1')return false;
    dock.dataset.semantic='1';dock.setAttribute('aria-label','ReelOps 角色入口与生产链');
    const studio=[...dock.querySelectorAll('a')].find(a=>(a.getAttribute('href')||'').includes('studio.html'));
    if(studio){studio.classList.add('roleMapLink');studio.textContent='Studio · 角色';studio.title='角色地图，不是项目阶段';const d=document.createElement('span');d.className='flowSemanticDivider';d.textContent='生产链';studio.insertAdjacentElement('afterend',d);}
    const labels={'director.html':'创意','live-action.html':'实拍+AI','generation.html':'AIGC','post.html':'后期','review.html':'客户审阅','delivery.html':'交付'};
    dock.querySelectorAll('a').forEach(a=>{const h=(a.getAttribute('href')||'').split('?')[0];if(labels[h])a.textContent=labels[h]});
    return true;
  };
  const run=()=>{if(apply())return;let n=0;const t=setInterval(()=>{n++;if(apply()||n>20)clearInterval(t)},60)};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run,{once:true}):run();
})();