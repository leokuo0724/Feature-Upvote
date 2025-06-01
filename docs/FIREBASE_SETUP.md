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
2. Choose database location (recommended: `asia-east1`)
3. Select "Start in test mode"
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

For uploading firestore rules and indexes config in this project.

```bash
# 1. Login to Firebase CLI
firebase login

# 2. Initialize project (in project root)
firebase use --add
# Select your newly created Firebase project

# 3. Deploy Firestore rules and indexes
firebase deploy --only firestore
```

#### ⏳ Important: Index Building Process

After deploying `firestore.indexes.json`, Firestore needs time to build the indexes:

1. **Monitor Progress**: Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → **Indexes** tab
2. **Building Status**: You'll see indexes with status "Building" - this can take several minutes
3. **Wait for Completion**: Your app's API calls may fail until all indexes are built
4. **Ready Status**: Once all indexes show "Enabled" status, your app will work properly

💡 **Tip**: Don't start testing your app immediately after deployment. Wait for all indexes to complete building first.

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

#### Authorized Domains Configuration

Add your production domains to Firebase Authentication:

**Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. Authentication → Settings → Authorized domains
3. Click "Add domain"
4. Add your domains:
   ```
   your-app.vercel.app          # Vercel deployment
   your-custom-domain.com       # Custom domain
   localhost                    # Keep for local development
   ```

**Example domains to add:**

- `my-feature-upvote.vercel.app`
- `feedback.mycompany.com`
- `features.myproduct.io`

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

用於上傳此專案中的 Firestore 規則和索引配置。

```bash
# 1. 登入 Firebase CLI
firebase login

# 2. 初始化專案（在專案根目錄）
firebase use --add
# 選擇你剛創建的 Firebase 專案

# 3. 部署 Firestore 規則和索引
firebase deploy --only firestore
```

#### ⏳ 重要：索引建立過程

部署 `firestore.indexes.json` 後，Firestore 需要時間來建立索引：

1. **監控進度**：前往 [Firebase Console](https://console.firebase.google.com/) → 你的專案 → Firestore Database → **Indexes** 標籤
2. **建立狀態**：你會看到索引狀態顯示為「Building」- 這可能需要幾分鐘時間
3. **等待完成**：在所有索引建立完成前，你的應用程式 API 呼叫可能會失敗
4. **就緒狀態**：當所有索引都顯示「Enabled」狀態時，你的應用程式就能正常運作

💡 **提示**：部署後不要立即開始測試應用程式，請先等待所有索引建立完成。

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

### 正式環境設置

#### 授權域名配置

將你的正式域名添加到 Firebase Authentication：

**步驟：**

1. 前往 [Firebase Console](https://console.firebase.google.com/) → 你的專案
2. Authentication → Settings → Authorized domains
3. 點擊「Add domain」
4. 添加你的域名：
   ```
   your-app.vercel.app          # Vercel 部署
   your-custom-domain.com       # 自訂域名
   localhost                    # 保留用於本地開發
   ```

**範例域名：**

- `my-feature-upvote.vercel.app`
- `feedback.mycompany.com`
- `features.myproduct.io`
