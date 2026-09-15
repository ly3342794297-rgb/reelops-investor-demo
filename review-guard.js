(()=>{
  const pre=document.createElement('style');pre.dataset.reviewGuardPrepaint='1';pre.textContent='.reviewPage #versionNotice{visibility:hidden!important}';document.head.appendChild(pre);
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  ready(()=>{
    if((location.pathname.split('/').pop()||'').toLowerCase()!=='review.html'){pre.remove();return;}
    const $=s=>document.querySelector(s),state=()=>window.ReelOpsState?.get?.()||{};
    const canVersionDecide=s=>!!(s.v3Submitted&&!s.v3ChangesRequested&&!s.v4Submitted&&!s.v4ChangesRequested&&!s.approval||s.v4Submitted&&!s.v4ChangesRequested&&!s.approval);
    const feedbackForm=$('#feedbackForm');
    if(feedbackForm&&!feedbackForm.dataset.versionDecisionGuard){
      feedbackForm.dataset.versionDecisionGuard='1';
      feedbackForm.addEventListener('submit',e=>{if(!canVersionDecide(state())){e.preventDefault();e.stopImmediatePropagation();}},true);
    }
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
      if(feedbackForm)feedbackForm.style.display=canDecide?'block':'none';

      const formal=s.approval?(s.approvedVersion||'V4'):(s.v4Submitted||s.v4ChangesRequested?'V4':s.v3Submitted||s.v3ChangesRequested?'V3':null);
      const screen=$('#versionsStage .reviewScreen');if(screen)screen.style.backgroundImage=formal?`url('assets/${formal==='V3'?'shot08-v3.svg':'shot08-v4.svg'}')`:'none';

      const hasV4=!!(s.v4Submitted||s.v4ChangesRequested||s.approval&&s.approvedVersion==='V4');
      const tabs=$('#versionTabs'),revision=$('#revisionSummary');if(tabs)tabs.style.display=hasV4?'flex':'none';if(revision)revision.style.display=hasV4?'block':'none';
      if(revision&&hasV4){const rows=revision.querySelectorAll('.reviewChange'),row=rows[2];if(row){const title=row.querySelector('div > b'),source=row.querySelector('div .small');if(title)title.textContent='最后停留已延长 1 秒';if(source)source.textContent='来自 V3：最后停留多 1 秒。';}}
      const notice=$('#versionNotice'),noticeTitle=notice?.querySelector('b'),noticeCopy=notice?.querySelector('p');
      if(notice&&s.approval&&s.approvedVersion==='V4'){if(noticeTitle)noticeTitle.textContent='VERSION APPROVAL RECORD';if(noticeCopy)noticeCopy.textContent='V4 已由客户确认。该 Approval 独立于 Version 对象。';}
      else if(notice&&s.v4ChangesRequested&&!s.approval){if(noticeTitle)noticeTitle.textContent='V4 · CHANGES REQUESTED';if(noticeCopy)noticeCopy.textContent='客户已对 V4 提出新修改。下一正式版本应创建 V5，而不是覆盖 V4。';}
      else if(notice&&s.v4Submitted&&!s.approval){if(noticeTitle)noticeTitle.textContent='V4 修改摘要';if(noticeCopy)noticeCopy.textContent='人物进入提前；背景层次减弱；最后停留延长 1 秒。';}
      if(!hasV4){document.querySelectorAll('#versionsStage .reviewPanel').forEach(p=>p.classList.toggle('active',p.dataset.panel==='changes'));document.querySelectorAll('#versionsStage .reviewTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='changes'));}
    }
    const sync=()=>{queueMicrotask(apply);setTimeout(apply,0)};
    apply();pre.remove();window.addEventListener('reelops:state',sync);
  });
})();