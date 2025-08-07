# 🐝 红白机打蜜蜂游戏 (Bee Game)

一个基于 Web 技术重现经典红白机（Famicom）打蜜蜂游戏的项目，使用现代前端技术栈打造怀旧的像素风格射击游戏。

## 🎮 游戏简介

这是一款经典的纵向卷轴射击游戏，玩家控制战机在星空中与敌机战斗。游戏采用像素艺术风格，重现了红白机时代的经典游戏体验。

## ✨ 功能特性

### 🎯 核心玩法
- **玩家战机控制**：流畅的方向键移动控制
- **射击系统**：空格键发射子弹，消灭敌机
- **敌机系统**：三种不同类型的敌机，各具特色
  - 小型敌机：速度快，血量低
  - 中型敌机：平衡型，适中的速度和血量
  - 大型敌机：速度慢，血量高
- **碰撞检测**：精确的碰撞判定系统
- **生命系统**：玩家拥有3条生命
- **关卡系统**：随着游戏进行，难度逐渐增加

### 🎨 视觉效果
- **像素艺术风格**：精心设计的像素风格图形
- **动态星空背景**：营造太空战斗氛围
- **战机细节设计**：包含机身、机翼、驾驶舱等细节
- **引擎火焰效果**：动态的推进器视觉效果
- **爆炸动画**：敌机被击毁时的视觉反馈

### 🏆 游戏系统
- **计分系统**：击败不同敌机获得不同分数
- **最高分记录**：本地存储最高分记录
- **暂停功能**：ESC键暂停/继续游戏
- **游戏结束页面**：显示得分和重新开始选项

## 🛠️ 技术栈

- **前端框架**：React 18
- **开发语言**：TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **游戏渲染**：HTML5 Canvas API
- **路由管理**：React Router DOM
- **状态管理**：React Hooks
- **数据持久化**：LocalStorage

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
# 使用 pnpm
pnpm run dev

# 或使用 npm
npm run dev
```

### 构建生产版本
```bash
# 使用 pnpm
pnpm run build

# 或使用 npm
npm run build
```

### 预览生产版本
```bash
# 使用 pnpm
pnpm run preview

# 或使用 npm
npm run preview
```

## 🎮 游戏操作

| 操作 | 按键 |
|------|------|
| 移动 | ↑↓←→ 方向键 |
| 射击 | 空格键 |
| 暂停/继续 | ESC 键 |
| 返回主页 | 游戏结束后点击按钮 |

## 📁 项目结构

```
beegame/
├── src/
│   ├── components/          # React 组件
│   ├── engine/             # 游戏引擎核心
│   ├── pages/              # 页面组件
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── main.tsx            # 应用入口
├── public/                 # 静态资源
├── .gitignore             # Git 忽略文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── tailwind.config.js     # Tailwind CSS 配置
```

## 🌟 在线演示

[🎮 立即体验游戏]([https://beegame-tritechai.vercel.app/](https://traebeegame8103-tritechai-shisans-projects-aceeca3b.vercel.app/)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢经典红白机游戏的启发
- 感谢开源社区提供的优秀工具和库

---

**享受游戏，重温经典！** 🎮✨
=======
# beegame
红白机-打蜜蜂

