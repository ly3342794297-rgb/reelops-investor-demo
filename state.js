(() => {
  const KEY = 'reelops_demo_state_v4';
  const base = {
    project: 'Project Aurora',
    shot: 'SHOT 08',
    creativeVersion: 'V2',
    creativeSubmitted: false,
    creativeApproval: false,
    creativeApprovalAt: null,
    creativeChangesRequested: false,
    newCreativeFeedback: 0,
    creativeShared: {
      brief: true,
      treatment: true,
      storyboard: true,
      reference: true,
      decisionLog: false
    },
    selectedVariant: 'B',
    aiReady: false,
    captureComplete: false,
    packageSent: false,
    genAsset: false,
    v4Draft: false,
    feedbackResolved: 0,
    v4Submitted: false,
    changesRequested: true,
    approval: false,
    approvalAt: null,
    deliverables: 3,
    delivered: false,
    archived: false,
    newClientFeedback: 0
  };
  function read(){
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {...base, ...saved, creativeShared: {...base.creativeShared, ...(saved.creativeShared || {})}};
    } catch(e){ return {...base, creativeShared:{...base.creativeShared}}; }
  }
  function write(patch){
    const current = read();
    const next = {...current, ...patch};
    if (patch.creativeShared) next.creativeShared = {...current.creativeShared, ...patch.creativeShared};
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('reelops:state', {detail: next}));
    return next;
  }
  function reset(){ localStorage.setItem(KEY, JSON.stringify(base)); return read(); }
  function shotLabel(s=read()){
    if (s.approval) return 'V4 · Approved';
    if (s.v4Submitted) return 'V4 · In Review';
    if (s.v4Draft) return 'V4 Draft';
    return 'V3 · Changes Requested';
  }
  function creativeLabel(s=read()){
    if (s.creativeApproval) return `Creative Direction ${s.creativeVersion} · Approved`;
    if (s.creativeChangesRequested) return `Creative Direction ${s.creativeVersion} · Changes Requested`;
    if (s.creativeSubmitted) return `Creative Direction ${s.creativeVersion} · In Review`;
    return `Creative Direction ${s.creativeVersion} · Internal Draft`;
  }
  function projectPhase(s=read()){
    if (s.archived) return 'Archived';
    if (s.delivered) return 'Delivered';
    if (s.approval) return 'Delivery';
    if (s.v4Submitted) return 'Version Review';
    if (s.v4Draft || s.genAsset) return 'Post-production';
    if (s.packageSent || s.aiReady || s.creativeApproval) return 'Production';
    if (s.creativeSubmitted || s.creativeChangesRequested) return 'Creative Review';
    return 'Pre-production';
  }
  window.ReelOpsState = {get: read, set: write, reset, shotLabel, creativeLabel, projectPhase, key: KEY};

  if (!document.querySelector('link[data-reelops-polish]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'polish.css';
    link.dataset.reelopsPolish = '1';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-reelops-polish]')) {
    const script = document.createElement('script');
    script.src = 'polish.js';
    script.defer = true;
    script.dataset.reelopsPolish = '1';
    document.head.appendChild(script);
  }
  const file=(location.pathname.split('/').pop()||'').toLowerCase();
  if (file === 'producer.html' && !document.querySelector('script[data-producer-workflow]')) {
    const script = document.createElement('script');
    script.src = 'workflow.js';
    script.defer = true;
    script.dataset.producerWorkflow = '1';
    document.head.appendChild(script);
  }
  if (file === 'director.html' && !document.querySelector('script[data-director-ux]')) {
    const script = document.createElement('script');
    script.src = 'director-ux.js';
    script.defer = true;
    script.dataset.directorUx = '1';
    document.head.appendChild(script);
  }
  if (file === 'live-action.html' && !document.querySelector('script[data-live-ux]')) {
    const script = document.createElement('script');
    script.src = 'live-ux.js';
    script.defer = true;
    script.dataset.liveUx = '1';
    document.head.appendChild(script);
  }
})();
