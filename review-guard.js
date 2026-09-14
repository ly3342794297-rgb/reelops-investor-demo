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

      const versionPublished=!!(s.v4Submitted||s.approval);
      const versionContent=$('#versionContent');
      if(versionContent)versionContent.style.display=versionPublished?'block':'none';
      const versionLocked=$('#versionLocked');
      if(versionLocked)versionLocked.style.display=versionPublished?'none':'block';
      const approve=$('#approve'),changes=$('#changes');
      if(approve)approve.disabled=!s.v4Submitted||s.approval;
      if(changes)changes.disabled=!s.v4Submitted||s.approval;
    }
    apply();
    window.addEventListener('reelops:state',()=>queueMicrotask(apply));
  });
})();
