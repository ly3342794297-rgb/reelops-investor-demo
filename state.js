(() => {
  const KEY = 'reelops_demo_state_v4';
  const SCHEMA = 7;
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
    v3Submitted: false,
    v3SubmittedAt: null,
    v3ChangesRequested: false,
    v3ChangesAt: null,
    v4Draft: false,
    feedbackResolved: 0,
    feedbackResolvedItems: [false,false,false],
    v4Submitted: false,
    v4SubmittedAt: null,
    v4ChangesRequested: false,
    changesRequested: false,
    approval: false,
    approvedVersion: null,
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

  function resetDownstream(next){
    next.genAsset=false;next.workingComposite=false;
    next.v3Submitted=false;next.v3SubmittedAt=null;next.v3ChangesRequested=false;next.v3ChangesAt=null;
    next.v4Draft=false;next.feedbackResolvedItems=[false,false,false];next.feedbackResolved=0;
    next.v4Submitted=false;next.v4SubmittedAt=null;next.v4ChangesRequested=false;next.changesRequested=false;
    next.approval=false;next.approvedVersion=null;next.approvalAt=null;
    next.finalMasterReady=false;next.deliveryItems=[false,false,false,false];next.deliveryRecord=false;next.deliveryRecordAt=null;next.delivered=false;next.archiveRecord=false;next.archiveAt=null;next.archived=false;
  }

  function enforce(next){
    if(next.creativeApproval){next.creativeSubmitted=true;next.creativeChangesRequested=false;}
    if(next.creativeChangesRequested){next.creativeSubmitted=true;next.creativeApproval=false;}
    if(!next.creativeApproval){next.packageSent=false;resetDownstream(next);}
    if(next.packageSent){next.aiReady=true;next.captureComplete=true;}
    if(!next.packageSent){resetDownstream(next);}
    if(next.genAsset)next.packageSent=true;
    if(next.workingComposite)next.genAsset=true;
    if(!next.workingComposite){
      next.v3Submitted=false;next.v3SubmittedAt=null;next.v3ChangesRequested=false;next.v3ChangesAt=null;
      next.v4Draft=false;next.feedbackResolvedItems=[false,false,false];next.feedbackResolved=0;next.v4Submitted=false;next.v4SubmittedAt=null;next.v4ChangesRequested=false;next.changesRequested=false;next.approval=false;next.approvedVersion=null;
    }
    if(next.v3Submitted){next.workingComposite=true;next.genAsset=true;next.v3SubmittedAt=next.v3SubmittedAt||new Date().toISOString();}
    if(next.v3ChangesRequested){next.v3Submitted=true;next.v3ChangesAt=next.v3ChangesAt||new Date().toISOString();next.approval=false;next.approvedVersion=null;}
    if(!Array.isArray(next.feedbackResolvedItems)||next.feedbackResolvedItems.length!==3)next.feedbackResolvedItems=[false,false,false];
    next.feedbackResolvedItems=next.feedbackResolvedItems.map(Boolean);
    if(!next.v3ChangesRequested&&!next.v4ChangesRequested)next.feedbackResolvedItems=[false,false,false];
    next.feedbackResolved=next.feedbackResolvedItems.filter(Boolean).length;
    if(next.v4Draft){if(!next.v3ChangesRequested||next.feedbackResolved<3)next.v4Draft=false;else next.workingComposite=true;}
    if(next.v4Submitted){if(!next.v4Draft||next.feedbackResolved<3||next.v4ChangesRequested)next.v4Submitted=false;else next.v4SubmittedAt=next.v4SubmittedAt||new Date().toISOString();}
    if(next.v4ChangesRequested){next.v4Submitted=false;next.approval=false;next.approvedVersion=null;}
    next.changesRequested=!!(next.v3ChangesRequested||next.v4ChangesRequested);
    if(next.approval){
      const version=next.approvedVersion||(next.v4Submitted?'V4':next.v3Submitted?'V3':'V4');
      next.approvedVersion=version;next.approvalAt=next.approvalAt||new Date().toISOString();
      if(version==='V3'){
        next.v3Submitted=true;next.v3ChangesRequested=false;next.v4Draft=false;next.v4Submitted=false;next.v4ChangesRequested=false;next.feedbackResolvedItems=[false,false,false];next.feedbackResolved=0;next.changesRequested=false;
      }else{
        next.approvedVersion='V4';next.v3Submitted=true;next.v3ChangesRequested=true;next.feedbackResolvedItems=[true,true,true];next.feedbackResolved=3;next.v4Draft=true;next.v4Submitted=true;next.v4ChangesRequested=false;next.changesRequested=false;
      }
      next.workingComposite=true;next.genAsset=true;next.packageSent=true;next.aiReady=true;next.captureComplete=true;
    }else next.approvedVersion=null;
    if(!next.approval){next.finalMasterReady=false;next.deliveryItems=[false,false,false,false];next.deliveryRecord=false;next.deliveryRecordAt=null;next.delivered=false;next.archiveRecord=false;next.archiveAt=null;next.archived=false;}
    if(!next.finalMasterReady)next.deliveryItems=[false,false,false,false];
    if(!Array.isArray(next.deliveryItems))next.deliveryItems=[false,false,false,false];
    next.deliveryItems=[...next.deliveryItems].slice(0,4).map(Boolean);while(next.deliveryItems.length<4)next.deliveryItems.push(false);
    next.deliverables=next.deliveryItems.filter(Boolean).length;
    const deliveryReady=next.approval&&next.finalMasterReady&&next.deliveryItems.every(Boolean);
    if(next.deliveryRecord&&!deliveryReady)next.deliveryRecord=false;
    if(next.deliveryRecord){next.delivered=true;next.deliveryRecordAt=next.deliveryRecordAt||new Date().toISOString();}else next.delivered=false;
    if(next.archiveRecord&&!next.deliveryRecord)next.archiveRecord=false;
    if(next.archiveRecord){next.archived=true;next.archiveAt=next.archiveAt||new Date().toISOString();}else next.archived=false;
    next.schemaVersion=SCHEMA;return next;
  }

  function normalize(saved={}){
    const next={...base,...saved,creativeShared:{...base.creativeShared,...(saved.creativeShared||{})}};
    if((saved.schemaVersion||0)<7){
      const hadRevision=!!(saved.v4Draft||saved.v4Submitted||saved.approval||(Number(saved.feedbackResolved)||0)>0);
      next.v3Submitted=!!(saved.workingComposite||hadRevision);next.v3ChangesRequested=hadRevision;next.v4ChangesRequested=false;next.changesRequested=hadRevision;next.approvedVersion=saved.approval?'V4':null;if(!hadRevision)next.feedbackResolvedItems=[false,false,false];
    }
    if(!Array.isArray(next.feedbackResolvedItems)||next.feedbackResolvedItems.length!==3){const n=Math.max(0,Math.min(3,Number(next.feedbackResolved)||0));next.feedbackResolvedItems=[0,1,2].map(i=>i<n);}else next.feedbackResolvedItems=next.feedbackResolvedItems.map(Boolean);
    if(!Array.isArray(saved.deliveryItems)||saved.deliveryItems.length!==4){if(saved.delivered||saved.archived||saved.deliveryRecord||saved.archiveRecord)next.deliveryItems=[true,true,true,true];else next.deliveryItems=[false,false,false,false];}
    next.finalMasterReady=!!(saved.finalMasterReady||saved.delivered||saved.archived||saved.deliveryRecord||saved.archiveRecord);next.deliveryRecord=!!(saved.deliveryRecord||saved.delivered||saved.archived||saved.archiveRecord);next.archiveRecord=!!(saved.archiveRecord||saved.archived);return enforce(next);
  }

  function read(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');const next=normalize(saved);if(saved.schemaVersion!==SCHEMA)localStorage.setItem(KEY,JSON.stringify(next));return next;}catch(e){return normalize({});}}
  function write(patch){const current=read();const next={...current,...patch,schemaVersion:SCHEMA};if(patch.creativeShared)next.creativeShared={...current.creativeShared,...patch.creativeShared};if(patch.feedbackResolvedItems)next.feedbackResolvedItems=[...patch.feedbackResolvedItems];else if(Object.prototype.hasOwnProperty.call(patch,'feedbackResolved')){const n=Math.max(0,Math.min(3,Number(patch.feedbackResolved)||0));next.feedbackResolvedItems=[0,1,2].map(i=>i<n);}if(patch.deliveryItems)next.deliveryItems=[...patch.deliveryItems];const safe=enforce(next);localStorage.setItem(KEY,JSON.stringify(safe));window.dispatchEvent(new CustomEvent('reelops:state',{detail:safe}));return safe;}
  function reset(){const fresh=normalize({});localStorage.setItem(KEY,JSON.stringify(fresh));window.dispatchEvent(new CustomEvent('reelops:state',{detail:fresh}));return fresh;}
  function approvalVersion(s=read()){return s.approval?(s.approvedVersion||'V4'):null;}
  function shotLabel(s=read()){if(!s.creativeSubmitted&&!s.creativeApproval)return 'Creative · Internal';if(s.creativeChangesRequested)return `Creative ${s.creativeVersion||'V2'} · Changes`;if(!s.creativeApproval)return `Creative ${s.creativeVersion||'V2'} · In Review`;if(s.approval)return `${approvalVersion(s)} · Approved`;if(s.v4ChangesRequested)return 'V4 · Changes Requested';if(s.v4Submitted)return 'V4 · In Review';if(s.v4Draft)return 'V4 Draft';if(s.v3ChangesRequested)return 'V3 · Changes Requested';if(s.v3Submitted)return 'V3 · In Review';if(s.workingComposite)return 'Working Composite';if(s.genAsset)return 'Selected Asset';if(s.packageSent)return 'AIGC Production';if(s.aiReady)return 'AI Ready';return 'Production Ready';}
  function creativeLabel(s=read()){if(s.creativeApproval)return `Creative Direction ${s.creativeVersion} · Approved`;if(s.creativeChangesRequested)return `Creative Direction ${s.creativeVersion} · Changes Requested`;if(s.creativeSubmitted)return `Creative Direction ${s.creativeVersion} · In Review`;return `Creative Direction ${s.creativeVersion} · Internal Draft`;}
  function projectPhase(s=read()){if(s.archived||s.archiveRecord)return 'Archived';if(s.delivered||s.deliveryRecord)return 'Delivered';if(s.approval)return 'Delivery';if(s.v4Submitted||s.v3Submitted&&!s.v3ChangesRequested)return 'Version Review';if(s.v4Draft||s.v4ChangesRequested||s.v3ChangesRequested||s.workingComposite||s.genAsset)return 'Post-production';if(s.packageSent||s.aiReady||s.creativeApproval)return 'Production';if(s.creativeSubmitted||s.creativeChangesRequested)return 'Creative Review';return 'Pre-production';}
  function deliveryLabel(s=read()){if(s.archiveRecord||s.archived)return 'Archived';if(s.deliveryRecord||s.delivered)return 'Delivery Record Complete';if((s.deliveryItems||[]).every(Boolean))return 'Ready to Deliver';if(s.finalMasterReady)return `${s.deliverables||0} / 4 Deliverables Ready`;if(s.approval)return `${approvalVersion(s)} Approved · Final Master Pending`;return 'Waiting for Version Approval';}
  function can(action,s=read()){const rules={sendPackage:()=>s.creativeApproval&&s.aiReady,selectAsset:()=>s.packageSent,buildComposite:()=>s.genAsset,submitV3:()=>s.workingComposite&&!s.v3Submitted,requestV3Changes:()=>s.v3Submitted&&!s.v3ChangesRequested&&!s.approval,createV4:()=>s.v3ChangesRequested&&s.workingComposite&&s.feedbackResolved===3,submitV4:()=>s.v4Draft&&s.feedbackResolved===3,approveCurrent:()=>s.v4Submitted||s.v3Submitted&&!s.v3ChangesRequested,createFinalMaster:()=>s.approval,completeDelivery:()=>s.approval&&s.finalMasterReady&&(s.deliveryItems||[]).every(Boolean),archive:()=>s.deliveryRecord};return rules[action]?!!rules[action]():true;}
  window.ReelOpsState={get:read,set:write,reset,shotLabel,creativeLabel,projectPhase,deliveryLabel,approvalVersion,can,key:KEY};

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
  if(['post.html','review.html','delivery.html'].includes(file)){
    if(!document.querySelector('link[data-revision-cycle]')){const link=document.createElement('link');link.rel='stylesheet';link.href='revision-cycle.css';link.dataset.revisionCycle='1';document.head.appendChild(link);}
    if(!document.querySelector('script[data-revision-cycle]')){const script=document.createElement('script');script.src='revision-cycle.js';script.defer=true;script.dataset.revisionCycle='1';document.head.appendChild(script);}
  }
  if(['review.html','delivery.html'].includes(file)){
    if(!document.querySelector('link[data-closure-polish]')){const link=document.createElement('link');link.rel='stylesheet';link.href='closure-polish.css';link.dataset.closurePolish='1';document.head.appendChild(link);}
    if(!document.querySelector('script[data-closure-polish]')){const script=document.createElement('script');script.src='closure-final.js';script.defer=true;script.dataset.closurePolish='1';document.head.appendChild(script);}
  }
  if(!document.querySelector('link[data-nav-semantics]')){const link=document.createElement('link');link.rel='stylesheet';link.href='nav-semantics.css';link.dataset.navSemantics='1';document.head.appendChild(link);}
  if(!document.querySelector('script[data-nav-semantics]')){const script=document.createElement('script');script.src='nav-semantics.js';script.defer=true;script.dataset.navSemantics='1';document.head.appendChild(script);}
  if(!document.querySelector('link[data-demo-guide]')){const link=document.createElement('link');link.rel='stylesheet';link.href='demo-guide.css';link.dataset.demoGuide='1';document.head.appendChild(link);}
  if(!document.querySelector('script[data-demo-guide]')){const script=document.createElement('script');script.src='demo-guide.js';script.defer=true;script.dataset.demoGuide='1';document.head.appendChild(script);}
  if((file==='project.html'||file==='producer.html')&&!document.querySelector('script[data-truth-sync]')){const script=document.createElement('script');script.src='truth-sync.js';script.defer=true;script.dataset.truthSync='1';document.head.appendChild(script);}
  if((file==='project.html'||file==='producer.html')&&!document.querySelector('script[data-closure-ux]')){const script=document.createElement('script');script.src='closure-ux.js';script.defer=true;script.dataset.closureUx='1';document.head.appendChild(script);}
  if(file==='producer.html'&&!document.querySelector('script[data-producer-workflow]')){const script=document.createElement('script');script.src='workflow.js';script.defer=true;script.dataset.producerWorkflow='1';document.head.appendChild(script);}
  if(file==='director.html'&&!document.querySelector('script[data-director-ux]')){const script=document.createElement('script');script.src='director-ux.js';script.defer=true;script.dataset.directorUx='1';document.head.appendChild(script);}
})();