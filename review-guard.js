(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if((location.pathname.split('/').pop()||'').toLowerCase()!=='review.html')return;
    const $=s=>document.querySelector(s),state=()=>window.ReelOpsState?.get?.()||{};
    function apply(){
      const s=state();
      const creativePublished=!!(s.creativeSubmitted||s.creativeChangesRequested||s.creativeApproval);
      const creativeContents=$('#creativeContents');if(creativeContents)creativeContents.style.display=creativePublished?'block':'none';
      const creativeDecision=!!(s.creativeSubmitted&&!s.creativeApproval&&!s.creativeChangesRequested);
      const creativeForm=$('#creativeFeedbackForm');if(creativeForm)creativeForm.style.display=creativeDecision?'block':'none';
      const creativeApprove=$('#creativeApprove'),creativeChanges=$('#creativeChanges');if(creativeApprove)creativeApprove.disabled=!creativeDecision;if(creativeChanges)creativeChanges.disabled=!creativeDecision;
      const creativeLocked=$('#creativeNotPublished');if(creativeLocked)creativeLocked.style.display=creativePublished?'none':'block';

      const versionPublished=!!(s.v3Submitted||s.v3ChangesRequested||s.v4Submitted||s.v4ChangesRequested||s.approval);
      const versionContent=$('#versionContent');if(versionContent)versionContent.style.display=versionPublished?'block':'none';
      const versionLocked=$('#versionLocked');if(versionLocked)versionLocked.style.display=versionPublished?'none':'block';

      const v3Decision=!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.v4ChangesRequested&&!s.approval);
      const v4Decision=!!(s.v4Submitted&&!s.v4ChangesRequested&&!s.approval);
      const canDecide=v3Decision||v4Decision;
      const approve=$('#approve'),changes=$('#changes');if(approve)approve.disabled=!canDecide;if(changes)changes.disabled=!canDecide;

      const hasV4=!!(s.v4Submitted||s.v4ChangesRequested||s.approval&&s.approvedVersion==='V4');
      const tabs=$('#versionTabs'),revision=$('#revisionSummary');if(tabs)tabs.style.display=hasV4?'flex':'none';if(revision)revision.style.display=hasV4?'block':'none';
      if(!hasV4){document.querySelectorAll('#versionsStage .reviewPanel').forEach(p=>p.classList.toggle('active',p.dataset.panel==='changes'));document.querySelectorAll('#versionsStage .reviewTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='changes'));}
    }
    apply();window.addEventListener('reelops:state',()=>queueMicrotask(apply));
  });
})();