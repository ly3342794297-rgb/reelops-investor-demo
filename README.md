# ReelOps Investor Demo

可运行的投资人演示版本。

Golden Path：

**官网 → Project Overview → Director / Creative Review → Creative Approval → 实拍 + AI → AIGC → Working Composite → V3 Submitted → Client Decision → V3 Feedback → V4 Draft → V4 Review → Version Approval → Final Master → Deliverables → Delivery Record → Archive**

共享状态通过浏览器 `localStorage` 保存。Project / Studio / Producer / Director / Live Action / AIGC / Post / Client Review / Delivery 读取同一套 Project Aurora / SHOT 08 生产事实。

关键对象边界：

**Variant ≠ Asset ≠ Working Composite ≠ Version ≠ Approval ≠ Delivery**

**Creative Approval ≠ Version Approval**

## Investor Demo Mode

打开 `project.html?demo=1`，或在 Project Overview 右下角点击「开启投资人演示」。

演示 Guide 会根据当前共享状态判断本页主动作是否完成，不会自动替用户创建 Creative Approval、Version Approval 或 Delivery Record。

完整 3–5 分钟讲解脚本见 `DEMO_SCRIPT.md`。

## Current Status

当前为**交互式产品概念原型**。产品设计来自 Aion Studio 的真实商业制作场景，但尚未进入工程化开发和真实生产部署，也不代表已经具备生产级安全保障。

当前 GitHub 版本是设计与交互工作的 source of truth。Netlify 部署暂缓，待产品设计收口后最后一次处理。
