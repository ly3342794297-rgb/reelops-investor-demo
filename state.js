(() => {
  const KEY = 'reelops_demo_state_v4';
  const SCHEMA = 5;
  const base = {
    schemaVersion: SCHEMA,
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
    workingComposite: false,
    v4Draft: false,
    feedbackResolved: 0,
    feedbackResolvedItems: [false,false,false],
    v4Submitted: false,
    changesRequested: true,
    approval: false,
    approvalAt: null,
    finalMasterReady: false,
    deliveryItems: [false,false,false,false],
    deliverables: 0,
    deliveryRecord: false,
    deliveryRecordAt: null,
    delivered: false,
    archiveRecord: false,
    archiveAt: null,
    archived: false,
    newClientFeedback: 0
  };

  function normalize(saved={}){
    const next = {...base, ...saved, creativeShared: {...base.creativeShared, ...(saved.creativeShared || {})}};
    if (!Array.isArray(next.feedbackResolvedItems) || next.feedbackResolvedItems.length !== 3) {
      const n = Math.max(0,Math.min(3,Number(next.feedbackResolved)||0));
      next.feedbackResolvedItems = [0,1,2].map(i=>i<n);
    }
    next.feedbackResolved = next.feedbackResolvedItems.filter(Boolean).length;
    if (!Array.isArray(saved.deliveryItems) || saved.deliveryItems.length !== 4) {
      if (saved.delivered || saved.archived || saved.deliveryRecord || saved.archiveRecord) next.deliveryItems = [true,true,true,true];
      else next.deliveryItems = [false,false,false,false];
    } else next.deliveryItems = saved.deliveryItems.map(Boolean);
    next.finalMasterReady = !!(saved.finalMasterReady || saved.delivered || saved.archived || saved.deliveryRecord || saved.archiveRecord);
    next.deliveryRecord = !!(saved.deliveryRecord || saved.delivered || saved.archived || saved.archiveRecord);
    next.delivered = !!(saved.delivered || next.deliveryRecord);
    next.archiveRecord = !!(saved.archiveRecord || saved.archived);
    next.archived = !!(saved.archived || next.archiveRecord);
    next.deliverables = next.deliveryItems.filter(Boolean).length;
    next.schemaVersion = SCHEMA;
    return next;
  }

  function read(){
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      const next = normalize(saved);
      if (saved.schemaVersion !== SCHEMA) localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    } catch(e){ return normalize({}); }
  }

  function write(patch){
    const current = read();
    const next = {...current, ...patch, schemaVersion: SCHEMA};
    if (patch.creativeShared) next.creativeShared = {...current.creativeShared, ...patch.creativeShared};
    if (patch.feedbackResolvedItems) {
      next.feedbackResolvedItems = [...patch.feedbackResolvedItems];
      next.feedbackResolved = next.feedbackResolvedItems.filter(Boolean).length;
    } else if (Object.prototype.hasOwnProperty.call(patch,'feedbackResolved')) {
      const n = Math.max(0,Math.min(3,Number(patch.feedbackResolved)||0));
      next.feedbackResolvedItems = [0,1,2].map(i=>i<n);
      next.feedbackResolved = n;
    }
    if (patch.deliveryItems) {
      next.deliveryItems = [...patch.deliveryItems].slice(0,4).map(Boolean);
      while(next.deliveryItems.length<4) next.deliveryItems.push(false);
    }
    next.deliverables = (next.deliveryItems || []).filter(Boolean).length;
    if (patch.deliveryRecord === true) next.delivered = true;
    if (patch.deliveryRecord === false) next.delivered = false;
    if (patch.archiveRecord === true) next.archived = true;
    if (patch.archiveRecord === false) next.archived = false;
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('reelops:state', {detail: next}));
    return next;
  }

  function reset(){ const fresh = normalize({}); localStorage.setItem(KEY, JSON.stringify(fresh)); return fresh; }
  function shotLabel(s=read()){
    if (s.approval) return 'V4 · Approved';
    if (s.v4Submitted) return 'V4 · In Review';
    if (s.v4Draft) return 'V4 Draft';
    if (s.workingComposite) return 'Working Composite';
    return 'V3 · Changes Requested';
  }
  function creativeLabel(s=read()){
    if (s.creativeApproval) return `Creative Direction ${s.creativeVersion} · Approved`;
    if (s.creativeChangesRequested) return `Creative Direction ${s.creativeVersion} · Changes Requested`;
    if (s.creativeSubmitted) return `Creative Direction ${s.creativeVersion} · In Review`;
    return `Creative Direction ${s.creativeVersion} · Internal Draft`;
  }
  function projectPhase(s=read()){
    if (s.archived || s.archiveRecord) return 'Archived';
    if (s.delivered || s.deliveryRecord) return 'Delivered';
    if (s.approval) return 'Delivery';
    if (s.v4Submitted) return 'Version Review';
    if (s.v4Draft || s.workingComposite || s.genAsset) return 'Post-production';
    if (s.packageSent || s.aiReady || s.creativeApproval) return 'Production';
    if (s.creativeSubmitted || s.creativeChangesRequested) return 'Creative Review';
    return 'Pre-production';
  }
  function deliveryLabel(s=read()){
    if (s.archiveRecord || s.archived) return 'Archived';
    if (s.deliveryRecord || s.delivered) return 'Delivery Record Complete';
    if ((s.deliveryItems||[]).every(Boolean)) return 'Ready to Deliver';
    if (s.finalMasterReady) return `${s.deliverables || 0} / 4 Deliverables Ready`;
    if (s.approval) return 'Final Master Pending';
    return 'Waiting for Version Approval';
  }
  window.ReelOpsState = {get: read, set: write, reset, shotLabel, creativeLabel, projectPhase, deliveryLabel, key: KEY};

  if (!document.querySelector('link[data-reelops-polish]')) {
    const link = document.createElement('link');link.rel='stylesheet';link.href='polish.css';link.dataset.reelopsPolish='1';document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-reelops-polish]')) {
    const script=document.createElement('script');script.src='polish.js';script.defer=true;script.dataset.reelopsPolish='1';document.head.appendChild(script);
  }
  const file=(location.pathname.split('/').pop()||'').toLowerCase();
  if ((file==='project.html'||file==='producer.html') && !document.querySelector('script[data-closure-ux]')) {
    const script=document.createElement('script');script.src='closure-ux.js';script.defer=true;script.dataset.closureUx='1';document.head.appendChild(script);
  }
  if (file === 'producer.html' && !document.querySelector('script[data-producer-workflow]')) {
    const script=document.createElement('script');script.src='workflow.js';script.defer=true;script.dataset.producerWorkflow='1';document.head.appendChild(script);
  }
  if (file === 'director.html' && !document.querySelector('script[data-director-ux]')) {
    const script=document.createElement('script');script.src='director-ux.js';script.defer=true;script.dataset.directorUx='1';document.head.appendChild(script);
  }
  if (file === 'live-action.html' && !document.querySelector('script[data-live-ux]')) {
    const script=document.createElement('script');script.src='live-ux.js';script.defer=true;script.dataset.liveUx='1';document.head.appendChild(script);
  }
})();
