# ReelOps · 3–5 分钟投资人 Demo Script

> 目标：不是展示“很多页面”，而是用一个 Project Aurora / SHOT 08 讲清楚 ReelOps 为什么不是 Frame.io，也不是 AI 生成器。

## 0. 开场（20–30s）

一句话：**通用办公软件管理组织协作，ReelOps 管商业影像的生产状态。**

强调：当前为交互式产品概念原型，设计来自 Aion Studio 的真实商业制作场景；尚未工程化上线，也未在历史项目中部署。

## 1. Project Overview（30–40s）

打开 `project.html?demo=1`。

讲：一个商业影像项目真正容易失控的不是“文件找不到”，而是 Brief、Shot、Asset、Version、Feedback、Approval、Delivery 之间的关系没有被记录。

只指出三件事：项目阶段、下一责任人、当前阻塞。

## 2. Creative Decision（45–60s）

进入 Director。

讲：导演内部可以很复杂，但客户不应该进入导演后台。导演只发布整理后的 Brief / Treatment / Storyboard / Reference。

点击“提交客户创意审阅” → Client Review → “确认创意方向”。

强调：**Creative Approval ≠ Version Approval。** 创意确认只是锁定制作方向。

## 3. Hybrid Production（60–75s）

进入实拍 + AI。

讲：这里不是“拍完再交给 AI”。Shot 一开始就记录什么必须实拍、什么允许生成、AI 后续需要现场留下什么。

补齐 AI Ready → 发送 AI 制作包。

进入 AIGC：

**Generation Job → Variant → Selected Asset**。

强调：Variant 不是 Asset，更不是 Version；ReelOps 不以模型为核心竞争力。

## 4. Version Revision Cycle（75–110s）

进入 Post。

先建立 **Working Composite**。强调它仍是内部工作状态，客户不可见。

然后正式提交 **V3**。

进入 Client Review / 成片审阅。此时系统只显示 V3，不会提前出现 V4，也不会预先制造客户反馈。

点击“需要修改”。此时才创建 3 条绑定 V3 的正式 Feedback：

- 00:12 主体提前一点进入
- 00:18 背景层次再弱一点
- 00:24 产品高光保留现在这版

回到 Post，逐条处理反馈 → 生成 V4 Draft → 正式提交 V4。

再次进入 Client Review → 确认 V4。

强调：

**Working Composite ≠ Version。**

**Feedback 必须属于具体 Version。**

**Version ≠ Approval。**

完整时间顺序是：

**Working Composite → V3 Submitted → Changes Requested → Feedback Resolved → V4 Draft → V4 In Review → Version Approval**

## 5. Delivery Closure（40–60s）

进入 Delivery。

讲：Approved 不是项目结束。还要有 Final Master、Deliverables、Delivery Record 和 Archive。

完成 Final Master → 4 个 Deliverables → Delivery Record → Archive。

收尾一句：

**Aion Studio 是生产方法发生的地方。ReelOps 是这套方法规模化的地方。**

## 演示纪律

- 不展示 Prompt、模型厂商、失败生成、成本或内部供应商信息给 Client View。
- 不说 ReelOps 已经被历史项目采用。
- 不说当前 Demo 已具备生产级安全。
- 不把 ReelOps 讲成“AI 生成平台”或“更漂亮的 Frame.io”。
- 全程只讲 Project Aurora / SHOT 08，一条主线到底。
- 不允许 V3 客户决策之前就在 Post 出现 V3 Feedback。
- 不允许 Working Composite 被称为 Version。
