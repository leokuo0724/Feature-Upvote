# Feature Upvote Platform

[English](#english) | [中文](#中文)

![Feature Upvote](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-9-orange?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## English

A modern feature request and voting platform that enables product teams to quickly collect and manage user feedback.

### 🎯 Target Users

**Product Managers** and **Developers** who want to quickly deploy a feature voting platform for their products

### ⚡ Quick Deploy

```bash
# 1. Clone project
git clone <repository-url>
cd feature-upvote

# 2. Install dependencies
pnpm install

# 3. Setup Firebase (5 minutes)
# See: docs/FIREBASE_SETUP.md

# 4. Deploy to Vercel (2 minutes)
# See: docs/DEPLOYMENT.md
```

**⏱️ Total time: ~10 minutes to go live**

### ✨ Core Features

#### 🔐 User System

- **Google OAuth Login** - No additional registration process
- **Admin Permissions** - Complete content management capabilities
- **Guest Friendly** - Browse content, participate after login

#### 📝 Feature Request Management

- **Complete Lifecycle** - Status tracking from submission to completion
- **Voting Mechanism** - Understand user priority needs
- **Label System** - Flexible categorization management
- **Comment Discussion** - Deep user feedback collection

#### 🎨 Brand Customization

- **Project Name** - Custom platform title
- **Tagline Settings** - Personalized description
- **Theme Colors** - Match brand visuals
- **Live Preview** - What you see is what you get

#### 📊 Data Insights

- **Vote Statistics** - Understand feature demand heat
- **User Activity** - Track community engagement
- **Comment Analysis** - Deep understanding of user needs

### 🛠 Tech Stack

#### Frontend

- **Next.js 14** - App Router + Server Components
- **TypeScript** - Complete type safety
- **Tailwind CSS** - Modern styling system
- **shadcn/ui** - High-quality UI components
- **TanStack Query** - Efficient data management

#### Backend Services

- **Firebase Auth** - Secure user authentication
- **Firestore** - Real-time database
- **Security Rules** - Fine-grained permission control

#### Developer Experience

- **Feature-Sliced Design** - Maintainable code architecture
- **Internationalization** - Bilingual Chinese/English support
- **TypeScript** - Development-time error checking
- **ESLint + Prettier** - Code quality assurance

### 🚀 Deployment Options

| Platform         | Difficulty | Time   | Recommendation |
| ---------------- | ---------- | ------ | -------------- |
| **Vercel**       | ⭐         | 2 min  | ⭐⭐⭐⭐⭐     |
| Netlify          | ⭐⭐       | 5 min  | ⭐⭐⭐⭐       |
| Firebase Hosting | ⭐⭐⭐     | 10 min | ⭐⭐⭐         |

### 📁 Project Structure

```
src/
├── app/                    # Next.js page routing
├── entities/              # Business entities (users, feature requests, comments)
├── features/              # Feature modules
├── widgets/               # Composite components
├── shared/                # Shared resources
│   ├── ui/                # UI component library
│   ├── hooks/             # Shared hooks
│   ├── lib/               # Utility functions
│   └── config/            # Configuration files
└── lib/                   # Application configuration
```

### 🔧 Development Commands

```bash
pnpm dev          # Development mode
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Code linting
pnpm type-check   # Type checking
```

### 📖 Documentation Guide

| Document                                 | Purpose                       | Estimated Time |
| ---------------------------------------- | ----------------------------- | -------------- |
| [Firebase Setup](docs/FIREBASE_SETUP.md) | Backend service configuration | 5 min          |
| [Deployment Guide](docs/DEPLOYMENT.md)   | Production deployment         | 2 min          |
| [Admin Guide](docs/ADMIN.md)             | Platform customization        | 3 min          |

### 🎨 Customization Highlights

- **🎯 Zero-Code Branding** - Complete through admin panel
- **🌈 Live Theme Preview** - Changes take effect immediately
- **📱 Responsive Design** - Perfect adaptation to all devices
- **🌍 Multi-language Support** - Built-in Chinese/English switching

### 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 中文

一個現代化的功能請求和投票平台，讓產品團隊能夠快速收集和管理用戶反饋。

### 🎯 目標使用者

**產品經理** 和 **開發者** 希望快速為自己的產品部署一個功能投票平台

### ⚡ 快速部署

```bash
# 1. 複製專案
git clone <repository-url>
cd feature-upvote

# 2. 安裝依賴
pnpm install

# 3. 設置 Firebase（5分鐘）
# 參考：docs/FIREBASE_SETUP.md

# 4. 部署到 Vercel（2分鐘）
# 參考：docs/DEPLOYMENT.md
```

**⏱️ 總時間：約 10 分鐘即可上線**

### ✨ 核心功能

#### 🔐 用戶系統

- **Google OAuth 登入** - 無需額外註冊流程
- **管理員權限** - 完整的內容管理能力
- **訪客友好** - 可瀏覽內容，登入後參與互動

#### 📝 功能請求管理

- **完整生命週期** - 從提交到完成的狀態追蹤
- **投票機制** - 了解用戶需求優先級
- **標籤系統** - 靈活的分類管理
- **評論討論** - 深度用戶反饋收集

#### 🎨 品牌自訂

- **專案名稱** - 自訂平台標題
- **標語設定** - 個性化描述
- **主題色彩** - 符合品牌視覺
- **即時預覽** - 所見即所得

#### 📊 數據洞察

- **投票統計** - 了解功能需求熱度
- **用戶活躍度** - 掌握社群參與情況
- **評論分析** - 深入理解用戶需求

### 🛠 技術架構

#### 前端技術

- **Next.js 14** - App Router + Server Components
- **TypeScript** - 完整類型安全
- **Tailwind CSS** - 現代化樣式系統
- **shadcn/ui** - 高質量 UI 組件
- **TanStack Query** - 高效數據管理

#### 後端服務

- **Firebase Auth** - 安全的用戶認證
- **Firestore** - 實時數據庫
- **Security Rules** - 細粒度權限控制

#### 開發體驗

- **Feature-Sliced Design** - 可維護的代碼架構
- **國際化支援** - 中英文雙語
- **TypeScript** - 開發時錯誤檢查
- **ESLint + Prettier** - 代碼品質保證

### 🚀 部署選項

| 平台             | 難度   | 時間    | 推薦度     |
| ---------------- | ------ | ------- | ---------- |
| **Vercel**       | ⭐     | 2 分鐘  | ⭐⭐⭐⭐⭐ |
| Netlify          | ⭐⭐   | 5 分鐘  | ⭐⭐⭐⭐   |
| Firebase Hosting | ⭐⭐⭐ | 10 分鐘 | ⭐⭐⭐     |

### 📁 專案結構

```
src/
├── app/                    # Next.js 頁面路由
├── entities/              # 業務實體（用戶、功能請求、評論）
├── features/              # 功能模組
├── widgets/               # 複合組件
├── shared/                # 共享資源
│   ├── ui/                # UI 組件庫
│   ├── hooks/             # 共用 Hooks
│   ├── lib/               # 工具函數
│   └── config/            # 配置文件
└── lib/                   # 應用配置
```

### 🔧 開發指令

```bash
pnpm dev          # 開發模式
pnpm build        # 生產構建
pnpm start        # 生產服務器
pnpm lint         # 代碼檢查
pnpm type-check   # 類型檢查
```

### 📖 文檔指南

| 文檔                                    | 用途         | 預估時間 |
| --------------------------------------- | ------------ | -------- |
| [Firebase 設置](docs/FIREBASE_SETUP.md) | 後端服務配置 | 5 分鐘   |
| [部署指南](docs/DEPLOYMENT.md)          | 上線部署     | 2 分鐘   |
| [管理員指南](docs/ADMIN.md)             | 平台自訂設置 | 3 分鐘   |

### 🎨 自訂功能亮點

- **🎯 零代碼品牌化** - 通過管理面板即可完成
- **🌈 實時主題預覽** - 修改即時生效
- **📱 響應式設計** - 完美適配各種設備
- **🌍 多語言支援** - 內建中英文切換

### 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 📝 授權

MIT License - 查看 [LICENSE](LICENSE) 了解詳情

---

**Feature Upvote** - Making feature request management simple and efficient 🚀
