# MCU 40天闯关计划

可直接部署到 GitHub Pages 的纯静态学习打卡网站。

## 内容

- 日期：2026-08-05 至 2026-09-13
- 每天六科：51、STM32、数字电路、模拟电路、微机原理、C语言
- 40个每日关卡，560道概念、计算、编程、调试、面试和项目题
- 严格闯关：六科任务完成 + 题库达到阶段阈值 + 至少20字复盘
- 进度保存在浏览器，支持JSON导出/导入
- 最终项目：多传感器采集、滤波、LoRa通信、故障恢复和测试

## 本地运行

双击 `index.html` 可以直接使用。推荐：

```bash
python -m http.server 8000
```

打开 `http://localhost:8000`。

Windows 也可双击 `start-local.bat`。

## 上传GitHub

```bash
git init
git add .
git commit -m "init: MCU 40-day quest"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/MCU-40-Day-Quest.git
git push -u origin main
```

然后进入仓库：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

项目已包含 `.github/workflows/pages.yml`。之后每次 push 到 `main` 会自动部署。

## 每日打卡

网页内点击“生成打卡”，把下载的 Markdown 放到 `checkins/`：

```bash
git add .
git commit -m "day 01: GPIO and bit operations"
git push
```

## 建议目录

```text
├─ index.html
├─ assets/
├─ checkins/
├─ firmware/
│  ├─ 51/
│  └─ stm32/
├─ notes/
└─ .github/workflows/pages.yml
```

## 学习强度说明

按页面安排每天约6～7小时，40天约240～280小时。这一轮目标是达到“基础扎实、能完成综合项目、能继续深入”的水平。真正精通仍需要长期读手册、做项目、测波形和排故。

## 四层学习结构

每一天、每一科都包含：

1. **学什么**：当天的定义、机制、公式、寄存器、时序或电路重点。
2. **怎么学**：按分钟拆分的闭卷回忆、学习、做题/实验、验证和复盘步骤。
3. **学到什么程度**：最低过关线以及进一步达到“熟练”的要求。
4. **留下什么成果**：结构化笔记、错题、代码/计算、波形和复盘。

网页还增加了“六科学法”页面，用于长期重复使用。

## 调试能力主线

调试不是独立的一天，而是贯穿40天的每日必过任务。每天需要完成：

1. 主动制造一个与当天知识相关的故障；
2. 稳定复现并记录触发条件；
3. 按“供电→复位/时钟→引脚→外设→中断/DMA→协议→业务逻辑”排查；
4. 使用万用表、示波器、逻辑分析仪、SWD、寄存器窗口或日志取得证据；
5. 保存错误假设、最终根因、修复前后对比和回归结果。

调试任务占每日完成度15%，未完成“复现—测量—定位—修复—回归”闭环不能过关。每7天进行一次限时故障排查考试。
