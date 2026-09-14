(() => {
  const KEY = 'reelops_demo_state_v4';
  const SCHEMA = 6;
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
    creativeShared: {brief:true,treatment:true,storyboard:true,reference:true,decisionLog:false},
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

  function enforce(next){
    if(next.creativeApproval){next.creativeSubmitted=true;next.creativeChangesRequested=false;}
    if(next.creativeChangesRequested){next.creativeSubmitted=true;next.creativeApproval=false;}
    if(!next.creativeApproval){next.packageSent=false;next.genAsset=false;next.workingComposite=false;next.v4Draft=false;next.v4Submitted=false;next.approval=false;next.finalMasterReady=false;next.deliveryRecord=false;next.archiveRecord=false;next.delivered=false;next.archived=false;next.deliveryItems=[false,false,false,false];}
    if(next.packageSent){next.aiReady=true;next.captureComplete=true;}
    if(!next.packageSent){next.genAsset=false;next.workingComposite=false;next.v4Draft=false;next.v4Submitted=false;next.approval=false;}
    if(next.genAsset)next.packageSent=true;
    if(next.workingComposite)next.genAsset=true;
    if(next.v4Draft)next.workingComposite=true;
    const resolved=(next.feedbackResolvedItems||[]).filter(Boolean).length;
    next.feedbackResolved=resolved;
    if(next.v4Submitted && (!next.v4Draft || resolved<3))next.v4Submitted=false;
    if(next.approval){next.v4Submitted=true;next.v4Draft=true;next.workingComposite=true;next.genAsset=true;next.packageSent=true;next.aiReady=true;next.captureComplete=true;next.changesRequested=false;}
    if(next.changesRequested && next.v4Submitted)next.approval=false;
    if(!next.approval){next.finalMasterReady=false;next.deliveryItems=[false,false,false,false];next.deliveryRecord=false;next.delivered=false;next.archiveRecord=false;next.archived=false;}
    if(!next.finalMasterReady)next.deliveryItems=[false,false,false,false];
    if(!Array.isArray(next.deliveryItems))next.deliveryItems=[false,false,false,false];
    next.deliveryItems=[...next.deliveryItems].slice(0,4).map(Boolean);while(next.deliveryItems.length<4)next.deliveryItems.push(false);
    next.deliverables=next.deliveryItems.filter(Boolean).length;
    const deliveryReady=next.approval&&next.finalMasterReady&&next.deliveryItems.every(Boolean);
    if(next.deliveryRecord&&!deliveryReady)next.deliveryRecord=false;
    if(next.deliveryRecord){next.delivered=true;next.deliveryRecordAt=next.deliveryRecordAt||new Date().toISOString();}else next.delivered=false;
    if(next.archiveRecord&&!next.deliveryRecord)next.archiveRecord=false;
    if(next.archiveRecord){next.archived=true;next.archiveAt=next.archiveAt||new Date().toISOString();}else next.archived=false;
    next.schemaVersion=SCHEMA;
    return next;
  }

  function normalize(saved={}){
    const next={...base,...saved,creativeShared:{...base.creativeShared,...(saved.creativeShared||{})}};
    if(!Array.isArray(next.feedbackResolvedItems)||next.feedbackResolvedItems.length!==3){const n=Math.max(0,Math.min(3,Number(next.feedbackResolved)||0));next.feedbackResolvedItems=[0,1,2].map(i=>i<n);}else next.feedbackResolvedItems=next.feedbackResolvedItems.map(Boolean);
    if(!Array.isArray(saved.deliveryItems)||saved.deliveryItems.length!==4){if(saved.delivered||saved.archived||saved.deliveryRecord||saved.archiveRecord)next.deliveryItems=[true,true,true,true];else next.deliveryItems=[false,false,false,false];}
    next.finalMasterReady=!!(saved.finalMasterReady||saved.delivered||saved.archived||saved.deliveryRecord||saved.archiveRecord);
    next.deliveryRecord=!!(saved.deliveryRecord||saved.delivered||saved.archived||saved.archiveRecord);
    next.archiveRecord=!!(saved.archiveRecord||saved.archived);
    return enforce(next);
  }

  function read(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');const next=normalize(saved);if(saved.schemaVersion!==SCHEMA)localStorage.setItem(KEY,JSON.stringify(next));return next;}catch(e){return normalize({});}}
  function write(patch){
    const current=read();const next={...current,...patch,schemaVersion:SCHEMA};
    if(patch.creativeShared)next.creativeShared={...current.creativeShared,...patch.creativeShared};
    if(patch.feedbackResolvedItems)next.feedbackResolvedItems=[...patch.feedbackResolvedItems];
    else if(Object.prototype.hasOwnProperty.call(patch,'feedbackResolved')){const n=Math.max(0,Math.min(3,Number(patch.feedbackResolved)||0));next.feedbackResolvedItems=[0,1,2].map(i=>i<n);}
    if(patch.deliveryItems)next.deliveryItems=[...patch.deliveryItems];
    const safe=enforce(next);localStorage.setItem(KEY,JSON.stringify(safe));window.dispatchEvent(new CustomEvent('reelops:state',{detail:safe}));return safe;
  }

  function reset(){const fresh=normalize({});localStorage.setItem(KEY,JSON.stringify(fresh));window.dispatchEvent(new CustomEvent('reelops:state',{detail:fresh}));return fresh;}
  function shotLabel(s=read()){
    if(!s.creativeSubmitted&&!s.creativeApproval)return 'Creative · Internal';
    if(s.creativeChangesRequested)return `Creative ${s.creativeVersion||'V2'} · Changes`;
    if(!s.creativeApproval)return `Creative ${s.creativeVersion||'V2'} · In Review`;
    if(s.approval)return 'V4 · Approved';
    if(s.v4Submitted)return 'V4 · In Review';
    if(s.v4Draft)return 'V4 Draft';
    if(s.workingComposite)return 'Working Composite';
    if(s.genAsset)return 'Selected Asset';
    if(s.packageSent)return 'AIGC Production';
    if(s.aiReady)return 'AI Ready';
    return 'Production Ready';
  }
  function creativeLabel(s=read()){if(s.creativeApproval)return `Creative Direction ${s.creativeVersion} · Approved`;if(s.creativeChangesRequested)return `Creative Direction ${s.creativeVersion} · Changes Requested`;if(s.creativeSubmitted)return `Creative Direction ${s.creativeVersion} · In Review`;return `Creative Direction ${s.creativeVersion} · Internal Draft`;}
  function projectPhase(s=read()){if(s.archived||s.archiveRecord)return 'Archived';if(s.delivered||s.deliveryRecord)return 'Delivered';if(s.approval)return 'Delivery';if(s.v4Submitted)return 'Version Review';if(s.v4Draft||s.workingComposite||s.genAsset)return 'Post-production';if(s.packageSent||s.aiReady||s.creativeApproval)return 'Production';if(s.creativeSubmitted||s.creativeChangesRequested)return 'Creative Review';return 'Pre-production';}
  function deliveryLabel(s=read()){if(s.archiveRecord||s.archived)return 'Archived';if(s.deliveryRecord||s.delivered)return 'Delivery Record Complete';if((s.deliveryItems||[]).every(Boolean))return 'Ready to Deliver';if(s.finalMasterReady)return `${s.deliverables||0} / 4 Deliverables Ready`;if(s.approval)return 'Final Master Pending';return 'Waiting for Version Approval';}
  function can(action,s=read()){
    const rules={sendPackage:()=>s.creativeApproval&&s.aiReady,selectAsset:()=>s.packageSent,buildComposite:()=>s.genAsset,createV4:()=>s.workingComposite,submitV4:()=>s.v4Draft&&s.feedbackResolved===3,approveV4:()=>s.v4Submitted,createFinalMaster:()=>s.approval,completeDelivery:()=>s.approval&&s.finalMasterReady&&(s.deliveryItems||[]).every(Boolean),archive:()=>s.deliveryRecord};
    return rules[action]?!!rules[action]():true;
  }
  window.ReelOpsState={get:read,set:write,reset,shotLabel,creativeLabel,projectPhase,deliveryLabel,can,key:KEY};

  if(!document.querySelector('link[data-reelops-polish]')){const link=document.createElement('link');link.rel='stylesheet';link.href='polish.css';link.dataset.reelopsPolish='1';document.head.appendChild(link);}
  if(!document.querySelector('script[data-reelops-polish]')){const script=document.createElement('script');script.src='polish.js';script.defer=true;script.dataset.reelopsPolish='1';document.head.appendChild(script);}
  if(!document.querySelector('link[data-presentation-polish]')){const link=document.createElement('link');link.rel='stylesheet';link.href='presentation.css';link.dataset.presentationPolish='1';document.head.appendChild(link);}
  if(!document.querySelector('script[data-presentation-polish]')){const script=document.createElement('script');script.src='presentation.js';script.defer=true;script.dataset.presentationPolish='1';document.head.appendChild(script);}
  if(!document.querySelector('script[data-review-guard]')){const script=document.createElement('script');script.src='review-guard.js';script.defer=true;script.dataset.reviewGuard='1';document.head.appendChild(script);}
  const file=(location.pathname.split('/').pop()||'').toLowerCase();
  if(['live-action.html','generation.html','post.html'].includes(file)){
    if(!document.querySelector('link[data-production-polish]')){const link=document.createElement('link');link.rel='stylesheet';link.href='production.css';link.dataset.productionPolish='1';document.head.appendChild(link);}
    if(!document.querySelector('script[data-production-polish]')){const script=document.createElement('script');script.src='production.js';script.defer=true;script.dataset.productionPolish='1';document.head.appendChild(script);}
  }
  if(!document.querySelector('link[data-demo-guide]')){const link=document.createElement('link');link.rel='stylesheet';link.href='demo-guide.css';link.dataset.demoGuide='1';document.head.appendChild(link);}
  if(!document.querySelector('script[data-demo-guide]')){const script=document.createElement('script');script.src='demo-guide.js';script.defer=true;script.dataset.demoGuide='1';document.head.appendChild(script);}
  if((file==='project.html'||file==='producer.html')&&!document.querySelector('script[data-closure-ux]')){const script=document.createElement('script');script.src='closure-ux.js';script.defer=true;script.dataset.closureUx='1';document.head.appendChild(script);}
  if(file==='producer.html'&&!document.querySelector('script[data-producer-workflow]')){const script=document.createElement('script');script.src='workflow.js';script.defer=true;script.dataset.producerWorkflow='1';document.head.appendChild(script);}
  if(file==='director.html'&&!document.querySelector('script[data-director-ux]')){const script=document.createElement('script');script.src='director-ux.js';script.defer=true;script.dataset.directorUx='1';document.head.appendChild(script);}
})();