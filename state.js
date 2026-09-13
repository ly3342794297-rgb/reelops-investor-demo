(() => {
  const KEY = 'reelops_demo_state_v4';
  const base = {
    project: 'Project Aurora',
    shot: 'SHOT 08',
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
    try { return {...base, ...(JSON.parse(localStorage.getItem(KEY) || '{}'))}; }
    catch(e){ return {...base}; }
  }
  function write(patch){
    const next = {...read(), ...patch};
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('reelops:state', {detail: next}));
    return next;
  }
  function reset(){ localStorage.setItem(KEY, JSON.stringify(base)); return {...base}; }
  function shotLabel(s=read()){
    if (s.approval) return 'V4 · Approved';
    if (s.v4Submitted) return 'V4 · In Review';
    if (s.v4Draft) return 'V4 Draft';
    return 'V3 · Changes Requested';
  }
  window.ReelOpsState = {get: read, set: write, reset, shotLabel, key: KEY};
})();
