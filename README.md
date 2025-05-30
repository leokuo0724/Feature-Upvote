# Feature Upvote - 功能請求投票平台

[English](#english) | [中文](#中文)

---

## 中文

一個現代化的功能請求和投票平台，讓產品團隊能夠快速收集和管理用戶反饋。

![Feature Upvote](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-9-orange?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

### ✨ 功能特色

#### 🔐 用戶認證

- Google OAuth 登入
- 管理員權限系統
- 訪客可瀏覽，登入後可投票和評論

#### 📝 功能請求管理

- 創建、編輯、刪除功能請求
- 狀態管理（Open, In Progress, Completed, Won't Do, Pending, Under Discussion, Will Do）
- 標籤系統
- 投票機制

#### 💬 評論系統

- 無限滾動評論列表
- 實時評論計數
- 編輯和刪除評論
- 用戶頭像和身份顯示

#### 🎨 用戶界面

- 響應式設計
- 深色/淺色主題切換
- 現代化 UI 組件
- 優秀的用戶體驗

#### 📊 數據管理

- 實時數據同步
- 分頁和無限滾動
- 排序功能（按投票數/時間）
- 狀態篩選

### 🛠 技術棧

#### 前端

- **Next.js 14** - React 框架，使用 App Router
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **shadcn/ui** - UI 組件庫
- **TanStack React Query** - 數據獲取和狀態管理
- **React Hook Form** - 表單管理
- **Zod** - 數據驗證

#### 後端服務

- **Firebase Authentication** - 用戶認證
- **Firestore** - NoSQL 資料庫
- **Firebase Security Rules** - 數據安全

#### 開發工具

- **ESLint** - 代碼檢查
- **Prettier** - 代碼格式化
- **pnpm** - 包管理器

#### 架構模式

- **Feature-Sliced Design (FSD)** - 可擴展的項目架構

### 🚀 快速開始

#### 前置要求

- Node.js 18+
- pnpm
- Firebase 專案

#### 1. 複製專案

```bash
git clone <repository-url>
cd feature-upvote
```

#### 2. 安裝依賴

```bash
pnpm install
```

#### 3. 環境設置

創建 `.env.local` 文件：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 4. Firebase 設置

參考 [Firebase 設置指南](docs/FIREBASE_SETUP.md) 完成：

- 啟用 Authentication (Google)
- 創建 Firestore 資料庫
- 部署安全規則
- 設置管理員帳號

#### 5. 啟動開發服務器

```bash
pnpm dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看應用。

### 📁 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
│   ├── feature-requests/   # 功能請求頁面
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 首頁
├── entities/              # 業務實體層
│   ├── user/              # 用戶實體
│   ├── feature-request/   # 功能請求實體
│   └── comment/           # 評論實體
├── features/              # 功能層
│   └── create-feature-request/  # 創建功能請求功能
├── widgets/               # 組件層
│   ├── navigation/        # 導航組件
│   ├── feature-request-card/  # 功能請求卡片
│   └── comment-list/      # 評論列表
├── shared/                # 共享層
│   ├── ui/                # UI 組件
│   ├── hooks/             # 共享 hooks
│   ├── lib/               # 工具函數
│   ├── types/             # 類型定義
│   └── config/            # 配置文件
└── lib/                   # 應用配置
```

### 🔧 可用腳本

```bash
# 開發
pnpm dev

# 構建
pnpm build

# 啟動生產服務器
pnpm start

# 代碼檢查
pnpm lint

# 類型檢查
pnpm type-check
```

### 🚀 部署

#### Vercel (推薦)

1. 推送代碼到 GitHub
2. 在 Vercel 中導入專案
3. 設置環境變數
4. 部署

詳細部署指南請參考 [部署文檔](docs/DEPLOYMENT.md)。

### 📖 文檔

- [Firebase 設置指南](docs/FIREBASE_SETUP.md)
- [部署指南](docs/DEPLOYMENT.md)

### 🤝 貢獻

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 📝 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

---

## English

A modern feature request and voting platform that enables product teams to quickly collect and manage user feedback.

### ✨ Features

#### 🔐 User Authentication

- Google OAuth sign-in
- Admin permission system
- Guest browsing, login required for voting and commenting

#### 📝 Feature Request Management

- Create, edit, delete feature requests
- Status management (Open, In Progress, Completed, Won't Do, Pending, Under Discussion, Will Do)
- Label system
- Voting mechanism

#### 💬 Comment System

- Infinite scroll comment list
- Real-time comment count
- Edit and delete comments
- User avatars and identity display

#### 🎨 User Interface

- Responsive design
- Dark/light theme toggle
- Modern UI components
- Excellent user experience

#### 📊 Data Management

- Real-time data synchronization
- Pagination and infinite scroll
- Sorting functionality (by votes/time)
- Status filtering

### 🛠 Tech Stack

#### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **TanStack React Query** - Data fetching and state management
- **React Hook Form** - Form management
- **Zod** - Data validation

#### Backend Services

- **Firebase Authentication** - User authentication
- **Firestore** - NoSQL database
- **Firebase Security Rules** - Data security

#### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

#### Architecture Pattern

- **Feature-Sliced Design (FSD)** - Scalable project architecture

### 🚀 Quick Start

#### Prerequisites

- Node.js 18+
- pnpm
- Firebase project

#### 1. Clone the Project

```bash
git clone <repository-url>
cd feature-upvote
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 4. Firebase Setup

Refer to [Firebase Setup Guide](docs/FIREBASE_SETUP_EN.md) to complete:

- Enable Authentication (Google)
- Create Firestore database
- Deploy security rules
- Set up admin accounts

#### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── feature-requests/   # Feature request pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── entities/              # Business entities layer
│   ├── user/              # User entity
│   ├── feature-request/   # Feature request entity
│   └── comment/           # Comment entity
├── features/              # Features layer
│   └── create-feature-request/  # Create feature request feature
├── widgets/               # Widgets layer
│   ├── navigation/        # Navigation component
│   ├── feature-request-card/  # Feature request card
│   └── comment-list/      # Comment list
├── shared/                # Shared layer
│   ├── ui/                # UI components
│   ├── hooks/             # Shared hooks
│   ├── lib/               # Utility functions
│   ├── types/             # Type definitions
│   └── config/            # Configuration files
└── lib/                   # Application configuration
```

### 🔧 Available Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check
```

### 🚀 Deployment

#### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

For detailed deployment guide, refer to [Deployment Documentation](docs/DEPLOYMENT_EN.md).

### 📖 Documentation

- [Firebase Setup Guide](docs/FIREBASE_SETUP_EN.md)
- [Deployment Guide](docs/DEPLOYMENT_EN.md)

### 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TanStack Query](https://tanstack.com/query) - Data fetching

### 📞 Support

If you have any questions or suggestions, please:

- Open an [Issue](../../issues)
- Send email to [your-email@example.com]
- Check the [Documentation](docs/)

---

**Feature Upvote** - Making feature request management simple and efficient 🚀
