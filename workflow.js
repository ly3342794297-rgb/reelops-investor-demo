(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    const stages=[
      ['project.html','Project'],['studio.html','Studio'],['director.html','导演'],['live-action.html','实拍+AI'],['generation.html','AIGC'],['post.html','后期'],['review.html','客户审阅'],['delivery.html','交付']
    ];
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const internalFiles=['studio.html','producer.html','director.html','live-action.html','generation.html','post.html','delivery.html'];
    const $=(s,r=document)=>r.querySelector(s);
    document.body.classList.add('page-enter');

    function state(){try{return window.ReelOpsState?.get?.()||{}}catch(e){return {}}}
    function phase(s){try{return window.ReelOpsState?.projectPhase?.(s)||'Production'}catch(e){return 'Production'}}
    function creativeText(s){
      const v=s.creativeVersion||'V2';
      if(s.creativeApproval)return `${v} · Approved`;
      if(s.creativeChangesRequested)return `${v} · Changes`;
      if(s.creativeSubmitted)return `${v} · In Review`;
      return `${v} · Draft`;
    }
    function creativeTone(s){return s.creativeApproval?'ok':(s.creativeSubmitted||s.creativeChangesRequested)?'wait':'muted'}
    function shotText(s){try{return window.ReelOpsState?.shotLabel?.(s)||'Production'}catch(e){return 'Production'}}
    function shotTone(s){return s.approval?'ok':s.v4Submitted?'wait':s.v4Draft?'active':'muted'}

    if(internalFiles.includes(file)&&!document.querySelector('.projectContextBar')){
      const header=$('.appTop')||$('.studioTop');
      if(header){
        const bar=document.createElement('div');
        bar.className='projectContextBar';
        bar.innerHTML=`
          <a class="pcbProject" href="project.html"><span class="pcbDot"></span><b>Project Aurora</b></a>
          <span class="pcbItem"><small>PHASE</small><b data-pcb="phase">Production</b></span>
          <span class="pcbItem"><small>CREATIVE</small><b data-pcb="creative">V2 · Draft</b></span>
          <span class="pcbItem"><small>SHOT 08</small><b data-pcb="shot">V3 · Changes Requested</b></span>
          <span class="pcbSpacer"></span>
          <a class="pcbControl" href="producer.html">制片统筹</a>
        `;
        header.insertAdjacentElement('afterend',bar);
        const renderContext=()=>{
          const s=state();
          const p=$('[data-pcb="phase"]',bar),c=$('[data-pcb="creative"]',bar),sh=$('[data-pcb="shot"]',bar);
          if(p)p.textContent=phase(s);
          if(c){c.textContent=creativeText(s);c.dataset.tone=creativeTone(s)}
          if(sh){sh.textContent=shotText(s);sh.dataset.tone=shotTone(s)}
          bar.querySelector('.pcbControl')?.classList.toggle('active',file==='producer.html');
        };
        renderContext();
        window.addEventListener('reelops:state',renderContext);
      }
    }

    if(file==='review.html')return;

    const idx=stages.findIndex(([p])=>p===file);
    if(idx<0||document.querySelector('.flowDock'))return;
    const nav=document.createElement('nav');
    nav.className='flowDock';
    nav.setAttribute('aria-label','ReelOps Golden Path');
    stages.forEach(([p,label],i)=>{
      const a=document.createElement('a');
      a.href=p;a.textContent=label;
      if(i===idx)a.classList.add('active');
      if(p==='review.html')a.classList.add('external');
      nav.appendChild(a);
    });
    const meta=document.createElement('span');
    meta.className='flowMeta';
    nav.appendChild(meta);
    document.body.appendChild(nav);

    const renderMeta=()=>{const s=state();meta.textContent='Project Aurora · '+phase(s)};
    renderMeta();window.addEventListener('reelops:state',renderMeta);

    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const href=a.getAttribute('href');if(!href)return;
      e.preventDefault();document.body.classList.add('is-leaving');
      setTimeout(()=>location.href=href,135);
    }));
    window.addEventListener('pageshow',()=>document.body.classList.remove('is-leaving'));
  });
})();
