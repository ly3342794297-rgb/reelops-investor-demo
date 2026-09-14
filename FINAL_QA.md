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
- A formal Version is immutable. If V4 receives another Changes Requested decision, the next production-grade formal Version should be V5. The current concept Demo intentionally models one revision cycle: V3 → V4.

## Presentation rule

Investor should understand within 30 seconds:

**ReelOps 管的不是文件，而是商业影像生产事实。**

The UI should prioritize current truth, next owner, blocker, and object lineage before dashboards or feature density.

## Evidence boundary

ReelOps is an interactive product concept prototype. It is not production SaaS, has not historically been deployed across Aion Studio projects, and does not currently provide production-grade security guarantees.
