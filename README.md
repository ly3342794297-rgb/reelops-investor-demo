# ReelOps Investor Demo

可运行的投资人演示版本。

Golden Path：官网 → Project Overview → Director / Creative Review → Creative Approval → 实拍+AI → AIGC → Post → Version Review → Version Approval → Final Master → Delivery Record → Archive。

共享状态通过浏览器 localStorage 保存。Project / Studio / Producer / Director / Live Action / AIGC / Post / Client Review / Delivery 读取同一套 Project Aurora 状态。

## Investor Demo Mode

打开 `project.html?demo=1`，或在 Project Overview 右下角点击「开启投资人演示」。

演示 Guide 会根据当前共享状态判断本页主动作是否完成，不会自动替用户创建 Creative Approval、Version Approval 或 Delivery Record。

完整 3–5 分钟讲解脚本见 `DEMO_SCRIPT.md`。

当前仍为交互式产品概念原型，不代表已工程化上线、在历史商业项目中部署，或具备生产级安全保障。
