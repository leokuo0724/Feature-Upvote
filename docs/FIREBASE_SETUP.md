# Firebase Setup Guide

[English](#english) | [中文](#中文)

---

## English

### ⏱️ Estimated Time: 5 minutes

### 📋 Prerequisites

- Google Account
- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`

## 🚀 Quick Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., `my-feature-upvote`)
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### Step 2: Enable Services

#### Authentication Setup

1. Left menu → "Authentication" → "Get started"
2. "Sign-in method" tab → Enable "Google"
3. Enter project public name and support email
4. Click "Save"

#### Firestore Database Setup

1. Left menu → "Firestore Database" → "Create database"
2. Select "Start in test mode"
3. Choose database location (recommended: `asia-east1`)
4. Click "Done"

### Step 3: Get Configuration

1. Project settings (gear icon) → "General" tab
2. "Your apps" → "Add app" → Web icon
3. Enter app nickname (e.g., `feature-upvote-web`)
4. Copy configuration object

### Step 4: Setup Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 5: Deploy Firebase Configuration

```bash
# 1. Login to Firebase CLI
firebase login

# 2. Initialize project (in project root)
firebase use --add
# Select your newly created Firebase project

# 3. Deploy Firestore rules and indexes
firebase deploy --only firestore
```

### Step 6: Setup Admin

#### Method 1: Setup After App Launch (Recommended)

1. Start app: `pnpm dev`
2. Sign in with admin Google account
3. In Firestore Console, find `users` collection
4. Find your user document, edit `isAdmin` field to `true`

#### Method 2: Manual Creation

In Firestore Console:

1. Create collection: `users`
2. Document ID: your user UID
3. Add fields:
   ```
   email: "your-admin@email.com"
   isAdmin: true
   createdAt: [current timestamp]
   ```

## ✅ Verify Setup

1. Start app: `pnpm dev`
2. Visit: `http://localhost:3000`
3. Test Google sign-in
4. Check admin permissions (should see Admin menu)

## 📊 Database Structure

The app will automatically create these collections:

### `users` - User Data

```
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  isAdmin: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `featureRequests` - Feature Requests

```
{
  title: string,
  description: string,
  status: "Open" | "In Progress" | "Completed" | "Won't Do" | "Pending" | "Under Discussion" | "Will Do",
  upvotes: number,
  upvotedBy: string[],
  labels: string[],
  authorId: string,
  commentsCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `comments` - Comments

```
{
  content: string,
  featureRequestId: string,
  authorId: string,
  authorName: string,
  authorEmail: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `labels` - Labels

```
{
  name: string,
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `settings` - App Settings

```
{
  projectName: string,
  tagline: string,
  primaryColor: string,
  defaultTheme: "light" | "dark" | "system",
  createdAt: timestamp,
  updatedAt: timestamp,
  updatedBy: string
}
```

## 🔧 Troubleshooting

### Common Issues

**Index Errors**

```bash
# Redeploy indexes
firebase deploy --only firestore:indexes
```

**Authentication Errors**

- Check if Google OAuth is enabled
- Verify environment variables are correct
- Check authorized domains settings

**Permission Errors**

- Ensure Firestore rules are deployed
- Check admin setup is correct

### Production Environment Setup

1. **Authorized Domains**: Add production domain in Authentication → Settings → Authorized domains
2. **Security Rules**: Review and optimize Firestore security rules
3. **Quota Monitoring**: Set up Firebase usage quota alerts

---

## 中文

### ⏱️ 預估時間：5 分鐘

### 📋 前置需求

- Google 帳號
- Node.js 18+
- Firebase CLI：`npm install -g firebase-tools`

## 🚀 快速設置

### 步驟 1: 創建 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱（例如：`my-feature-upvote`）
4. 選擇是否啟用 Google Analytics（建議啟用）
5. 點擊「建立專案」

### 步驟 2: 啟用服務

#### Authentication 設置

1. 左側選單 → 「Authentication」→「開始使用」
2. 「Sign-in method」標籤 → 啟用「Google」
3. 輸入專案公開名稱和支援電子郵件
4. 點擊「儲存」

#### Firestore Database 設置

1. 左側選單 → 「Firestore Database」→「建立資料庫」
2. 選擇「以測試模式開始」
3. 選擇資料庫位置（建議：`asia-east1`）
4. 點擊「完成」

### 步驟 3: 獲取配置

1. 專案設置（齒輪圖標）→「一般」標籤
2. 「你的應用程式」→「新增應用程式」→ Web 圖標
3. 輸入應用程式暱稱（例如：`feature-upvote-web`）
4. 複製配置物件

### 步驟 4: 設置環境變數

在專案根目錄創建 `.env.local`：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 步驟 5: 部署 Firebase 配置

```bash
# 1. 登入 Firebase CLI
firebase login

# 2. 初始化專案（在專案根目錄）
firebase use --add
# 選擇你剛創建的 Firebase 專案

# 3. 部署 Firestore 規則和索引
firebase deploy --only firestore
```

### 步驟 6: 設置管理員

#### 方法 1: 啟動應用後設置（推薦）

1. 啟動應用：`pnpm dev`
2. 使用管理員 Google 帳號登入
3. 在 Firestore Console 中找到 `users` 集合
4. 找到你的用戶文檔，編輯 `isAdmin` 字段為 `true`

#### 方法 2: 手動創建

在 Firestore Console 中：

1. 創建集合：`users`
2. 文檔 ID：你的用戶 UID
3. 添加字段：
   ```
   email: "your-admin@email.com"
   isAdmin: true
   createdAt: [當前時間戳]
   ```

## ✅ 驗證設置

1. 啟動應用：`pnpm dev`
2. 訪問：`http://localhost:3000`
3. 測試 Google 登入
4. 檢查管理員權限（應該能看到 Admin 選單）

## 📊 資料庫結構

應用會自動創建以下集合：

### `users` - 用戶資料

```
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  isAdmin: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `featureRequests` - 功能請求

```
{
  title: string,
  description: string,
  status: "Open" | "In Progress" | "Completed" | "Won't Do" | "Pending" | "Under Discussion" | "Will Do",
  upvotes: number,
  upvotedBy: string[],
  labels: string[],
  authorId: string,
  commentsCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `comments` - 評論

```
{
  content: string,
  featureRequestId: string,
  authorId: string,
  authorName: string,
  authorEmail: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `labels` - 標籤

```
{
  name: string,
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `settings` - 應用設置

```
{
  projectName: string,
  tagline: string,
  primaryColor: string,
  defaultTheme: "light" | "dark" | "system",
  createdAt: timestamp,
  updatedAt: timestamp,
  updatedBy: string
}
```

## 🔧 故障排除

### 常見問題

**索引錯誤**

```bash
# 重新部署索引
firebase deploy --only firestore:indexes
```

**認證錯誤**

- 檢查 Google OAuth 是否已啟用
- 確認環境變數正確
- 檢查授權域名設置

**權限錯誤**

- 確認 Firestore 規則已部署
- 檢查管理員設置是否正確

### 生產環境設置

1. **授權域名**：在 Authentication → Settings → Authorized domains 添加生產域名
2. **安全規則**：檢查並優化 Firestore 安全規則
3. **配額監控**：設置 Firebase 使用配額警報
