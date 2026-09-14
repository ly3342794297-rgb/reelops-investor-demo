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
  window.ReelOpsState = {get: read, set: write, reset, shotLabel, creativeLabel, key: KEY};
})();
