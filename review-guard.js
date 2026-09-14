(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if((location.pathname.split('/').pop()||'').toLowerCase()!=='review.html')return;
    const $=s=>document.querySelector(s), state=()=>window.ReelOpsState?.get?.()||{};
    function apply(){
      const s=state();
      const creativePublished=!!(s.creativeSubmitted||s.creativeChangesRequested||s.creativeApproval);
      const creativeContents=$('#creativeContents');
      if(creativeContents)creativeContents.style.display=creativePublished?'block':'none';
      const creativeForm=$('#creativeFeedbackForm');
      if(creativeForm&&!s.creativeSubmitted)creativeForm.style.display='none';
      const creativeLocked=$('#creativeNotPublished');
      if(creativeLocked)creativeLocked.style.display=creativePublished?'none':'block';

      const versionPublished=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Submitted||s.v4ChangesRequested||s.approval);
      const versionContent=$('#versionContent');
      if(versionContent)versionContent.style.display=versionPublished?'block':'none';
      const versionLocked=$('#versionLocked');
      if(versionLocked)versionLocked.style.display=versionPublished?'none':'block';

      const v3Decision=!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.v4ChangesRequested&&!s.approval);
      const v4Decision=!!(s.v4Submitted&&!s.v4ChangesRequested&&!s.approval);
      const canDecide=v3Decision||v4Decision;
      const approve=$('#approve'),changes=$('#changes');
      if(approve)approve.disabled=!canDecide;
      if(changes)changes.disabled=!canDecide;
    }
    apply();
    window.addEventListener('reelops:state',()=>queueMicrotask(apply));
  });
})();
