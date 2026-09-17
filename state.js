(()=>{
  const KEY='reelops_product_v1_state';
  const base={
    project:'Project Aurora',shot:'SHOT 08',
    creativeVersion:'V2',creativeSubmitted:false,creativeApproval:false,creativeApprovalAt:null,creativeChangesRequested:false,newCreativeFeedback:0,
    creativeShared:{brief:true,treatment:true,storyboard:true,reference:true,decisionLog:false},
    selectedVariant:'B',aiReady:false,captureComplete:false,packageSent:false,genAsset:false,workingComposite:false,
    v3Submitted:false,v3ChangesRequested:false,changesRequested:false,feedbackResolved:0,v4Draft:false,v4Submitted:false,v4ChangesRequested:false,
    approval:false,approvedVersion:null,approvalAt:null,
    finalMasterReady:false,deliveryItems:[false,false,false,false],deliverables:0,deliveryRecord:false,delivered:false,archived:false,newClientFeedback:0
  };
  const cloneBase=()=>({...base,creativeShared:{...base.creativeShared},deliveryItems:[...base.deliveryItems]});
  function read(){
    try{
      const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
      return {...cloneBase(),...saved,creativeShared:{...base.creativeShared,...(saved.creativeShared||{})},deliveryItems:Array.isArray(saved.deliveryItems)?saved.deliveryItems.slice(0,4):[...base.deliveryItems]};
    }catch(e){return cloneBase()}
  }
  function write(patch){
    const current=read();
    const next={...current,...patch};
    if(patch.creativeShared)next.creativeShared={...current.creativeShared,...patch.creativeShared};
    if(patch.deliveryItems)next.deliveryItems=patch.deliveryItems.slice(0,4);
    localStorage.setItem(KEY,JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('reelops:state',{detail:next}));
    return next;
  }
  function reset(){localStorage.removeItem(KEY);return read()}
  function shotLabel(s=read()){
    if(s.approval)return `${s.approvedVersion||'V4'} · Approved`;
    if(s.v4ChangesRequested)return 'V4 · Changes Requested';
    if(s.v4Submitted)return 'V4 · In Review';
    if(s.v4Draft)return 'V4 Draft';
    if(s.v3ChangesRequested)return 'V3 · Changes Requested';
    if(s.v3Submitted)return 'V3 · In Review';
    if(s.workingComposite)return 'Working Composite';
    if(s.genAsset)return 'Asset Ready';
    if(s.packageSent)return 'AI Production';
    if(s.creativeApproval)return 'Production Ready';
    if(s.creativeSubmitted)return 'Creative · In Review';
    return 'Creative · Internal';
  }
  function creativeLabel(s=read()){
    if(s.creativeApproval)return `Creative Direction ${s.creativeVersion} · Approved`;
    if(s.creativeChangesRequested)return `Creative Direction ${s.creativeVersion} · Changes Requested`;
    if(s.creativeSubmitted)return `Creative Direction ${s.creativeVersion} · In Review`;
    return `Creative Direction ${s.creativeVersion} · Internal Draft`;
  }
  function projectPhase(s=read()){
    if(s.archived)return 'Archived';
    if(s.deliveryRecord||s.delivered)return 'Delivery';
    if(s.approval)return 'Approved';
    if(s.v3Submitted||s.v4Submitted||s.v4Draft)return 'Review';
    if(s.creativeApproval)return 'Production';
    return 'Pre-production';
  }
  window.ReelOpsState={get:read,set:write,reset,shotLabel,creativeLabel,projectPhase,key:KEY};
})();