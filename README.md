# AgentForge

Hierarchical Multi-Agent System -- A supervisor agent that controls multiple worker agents.

## Architecture

```
User Task
    |
    v
+---------------------+
|  Supervisor Agent   |    Analyzes task, decides deployment
|  (CEO / Manager)    |
+---------+-----------+
          |
     +----+----+----+----+
     |    |    |    |    |
     v    v    v    v    v
+--------+ +--------+ +--------+ +--------+
| Code   | | Content| | Data   | |Quality |
| Smith  | |Crafter | |Seeker  | |Guard   |
+--------+ +--------+ +--------+ +--------+
     |    |    |    |    |
     +----+----+----+----+
          |
          v
+---------------------+
| Consolidated Report |
+---------------------+
```

## Features

- **Supervisor Agent**: Analyzes tasks, decides which workers to deploy, delegates subtasks, consolidates outputs
- **4 Worker Agents**: CodeSmith (code), ContentCrafter (writing), DataSeeker (research), QualityGuard (review)
- **Auto/Manual Mode**: Auto mode lets the supervisor decide; Manual mode lets you pick workers
- **Hierarchical Visualization**: See the delegation flow from supervisor to workers
- **Worker Timeline**: Track each worker's execution time and token usage
- **Consolidated Report**: The supervisor compiles everything into a final output
- **MiMo Analytics**: Token tracking, complexity assessment, deployment strategy

## Tech Stack

- **Framework**: Next.js 14
- **UI**: React, CSS-in-JS (styled-jsx)
- **Markdown**: react-markdown
- **Deploy**: Vercel

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lievuk/agentforge)

---

# AgentForge

分层多智能体系统 -- 一个主管智能体控制多个工作智能体。

## 架构

```
用户任务
    |
    v
+---------------------+
|   主管智能体         |    分析任务，决定部署方案
|   (CEO / 管理者)     |
+---------+-----------+
          |
     +----+----+----+----+
     |    |    |    |    |
     v    v    v    v    v
+--------+ +--------+ +--------+ +--------+
| 代码   | | 内容   | | 数据   | | 质量   |
| Smith  | |Crafter | |Seeker  | |Guard   |
+--------+ +--------+ +--------+ +--------+
     |    |    |    |    |
     +----+----+----+----+
          |
          v
+---------------------+
|   综合报告           |
+---------------------+
```

## 功能特点

- **主管智能体**: 分析任务，决定部署哪些工作智能体，分配子任务，整合输出
- **4个工作智能体**: CodeSmith（代码）、ContentCrafter（写作）、DataSeeker（研究）、QualityGuard（审查）
- **自动/手动模式**: 自动模式由主管决定方案；手动模式让你选择工作智能体
- **分层可视化**: 展示从主管到工作智能体的委派流程
- **工作智能体时间线**: 追踪每个工作智能体的执行时间和Token用量
- **综合报告**: 主管将所有输出整合为最终报告
- **MiMo分析**: Token追踪、复杂度评估、部署策略

## 技术栈

- **框架**: Next.js 14
- **UI**: React, CSS-in-JS (styled-jsx)
- **Markdown**: react-markdown
- **部署**: Vercel

## 本地开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lievuk/agentforge)

---

Built for MiMo 100T.