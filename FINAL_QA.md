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
- Producer and Post cannot impersonate client approval.
- Producer must never display fabricated SHOT rows or fabricated Deliverable readiness as if they were real project state.
- Project Overview must keep Asset → Working Composite → Version as separate objects in the record chain.
- A formal Version is immutable. If V4 receives another Changes Requested decision, the next production-grade formal Version should be V5. The current concept Demo intentionally models one revision cycle: V3 → V4.
- A Creative Direction resubmission after Changes Requested or Approval creates the next Creative Version instead of silently overwriting the previous version label.

## Production-log rule

The shared SHOT 08 inspector records state events rather than chat. Where the demo state creates an event, the record should carry an interaction timestamp: Creative submission/approval, AI Ready, AI package handoff, Selected Asset, Working Composite, V3/V4 decision points, Final Master, Delivery Record, and Archive.

## Presentation rule

Investor should understand within 30 seconds:

**ReelOps 管的不是文件，而是商业影像生产事实。**

The UI should prioritize current truth, next owner, blocker, and object lineage before dashboards or feature density.

First paint should not contradict the shared state. Avoid placeholder statuses such as fake Ready counts, future feedback, or future approvals that are only corrected after scripts load.

## Evidence boundary

ReelOps is an interactive product concept prototype. It is not production SaaS, has not historically been deployed across Aion Studio projects, and does not currently provide production-grade security guarantees.

## Deployment rule

Do not treat a GitHub commit as a published build. Production is only considered updated after a new deploy is visibly Published/Ready. Netlify deployment remains intentionally deferred until design and browser QA are complete.
