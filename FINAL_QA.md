# ReelOps · Final QA

## Demo source of truth

Project Aurora / SHOT 08 is the only complete investor-demo production object. Other pages are role views into the same record, not separate demo projects.

## Golden Path

1. Creative Direction published
2. Creative Approval recorded by Client Review
3. Capture reaches AI Ready
4. AI Production Package sent
5. Generation Job produces Variants
6. One Variant becomes Selected Asset
7. Post creates Working Composite
8. Post submits V3
9. Client either approves V3 or requests changes
10. If changes requested, 3 feedback items become formal V3 revision input
11. Post resolves V3 feedback and creates V4 Draft
12. Post submits V4
13. Client creates Version Approval
14. Delivery creates Final Master
15. Deliverables become Ready
16. Delivery Record is created
17. Project is Archived

## Required invariants

- No Creative Approval → no formal AI handoff.
- Creative Changes Requested → the same Creative Version cannot be approved again; Director must submit a newer Creative Direction first.
- AI Ready may be prepared technically before approval, but Project Phase must not advance to formal Production until Creative Approval exists.
- Capture Complete ≠ AI Ready.
- Variant ≠ Asset.
- Asset ≠ Working Composite.
- Working Composite ≠ Version.
- Feedback belongs to a submitted Version.
- Version ≠ Approval.
- Creative Approval ≠ Version Approval.
- Ready ≠ Delivered.
- Approved ≠ Archived.
- Client Review only exposes explicitly published creative objects and formal submitted Versions.
- While V4 exists only as an internal Draft, Client Review must continue showing the V3 formal state and must not display V4 media, V4 compare UI, or treat V4 as client-visible until V4 is formally submitted.
- Producer and Post cannot impersonate client approval.
- Producer must never display fabricated SHOT rows or fabricated Deliverable readiness as if they were real project state.
- Project Overview must keep Asset → Working Composite → Version as separate objects in the record chain.
- A formal Version is immutable. If V4 receives another Changes Requested decision, the next production-grade formal Version should be V5. The current concept Demo intentionally models one revision cycle: V3 → V4.
- A Creative Direction resubmission after Changes Requested or Approval creates the next Creative Version instead of silently overwriting the previous version label.

## State-machine branches to verify before deployment

### A. Standard investor path

Reset → publish Creative V2 → approve Creative → AI Ready → send AI Package → select Variant B as Asset → Working Composite → submit V3 → request changes → resolve 3/3 Feedback → V4 Draft → submit V4 → approve V4 → Final Master → 4/4 Deliverables → Delivery Record → Archive.

Expected result: Project Overview, Producer, Studio, SHOT 08 Inspector and Delivery all report the same final state.

### B. Creative revision branch

Publish Creative V2 → Client requests changes.

Expected result:
- Client actions for V2 are locked after Changes Requested.
- Director becomes the next owner.
- Director submits a newer Creative Direction version.
- Only the newly submitted version can receive Creative Approval.
- Formal production handoff remains blocked until the new Creative Approval exists.

### C. V3 direct-approval branch

Working Composite → submit V3 → Client approves V3 directly.

Expected result:
- No V4 is invented.
- Revision Cycle closes at V3.
- Approved Version is V3 everywhere.
- V3 direct approval must not surface V3 / V4 compare controls or a V4 revision summary.
- Delivery creates Final Master from V3 and uses the V3 visual source, never a hard-coded or first-paint V4.

### D. V4 second-revision edge

V3 Changes Requested → V4 submitted → Client requests changes on V4.

Expected result:
- V4 remains an immutable formal Version.
- UI states that the next production-grade formal Version should be V5.
- Post must remain visibly in `V4 · Changes Requested`; it must not fall back to `V4 Draft · Internal` or reopen the old V3 feedback list as the active work state.
- V4 submit is disabled and the demo clearly states that V5 is outside the current modeled scope.
- Current concept Demo does not pretend to model V5.

## Production-log rule

The shared SHOT 08 inspector records state events rather than chat. Where the demo state creates an event, the record should carry an interaction timestamp: Creative submission/approval, AI Ready, AI package handoff, Selected Asset, Working Composite, V3/V4 decision points, Final Master, Delivery Record, and Archive.

## Client visibility checks

Client Review must never expose:
- Director internal notes
- rejected references
- Prompt
- failed Variants
- Working Composite
- cost / supplier information
- unreleased Versions

Creative review and Version review must remain separate decisions.

## Presentation rule

Investor should understand within 30 seconds:

**ReelOps 管的不是文件，而是商业影像生产事实。**

The UI should prioritize current truth, next owner, blocker, and object lineage before dashboards or feature density.

First paint should not contradict the shared state. Avoid placeholder statuses such as fake Ready counts, future feedback, or future approvals that are only corrected after scripts load.

Before deployment, check at minimum:
- desktop wide viewport
- laptop viewport
- narrow/mobile viewport, including no horizontal overflow in the sticky app header
- Project startup transition
- SHOT 08 Inspector open / close
- Demo Guide reset and resume behavior
- Client Review creative / version stage switching
- disabled / locked button states
- no stale V3 / V4 visual shown before that Version exists

## Evidence boundary

ReelOps is an interactive product concept prototype. It is not production SaaS, has not historically been deployed across Aion Studio projects, and does not currently provide production-grade security guarantees.

## Deployment rule

Do not treat a GitHub commit as a published build. Production is only considered updated after a new deploy is visibly Published/Ready. Netlify deployment remains intentionally deferred until design and browser QA are complete.