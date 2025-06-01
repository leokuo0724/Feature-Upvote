# Deployment Guide

[English](#english) | [中文](#中文)

---

## English

### ⏱️ Estimated Time: 2 minutes

## 🚀 Vercel Deployment (Recommended)

### Why Choose Vercel?

- ⚡ **Fastest Deployment** - Live in 2 minutes
- 🔄 **Auto Deployment** - Deploy on Git push
- 🌍 **Global CDN** - Lightning fast access
- 💰 **Free Tier** - Completely free for personal projects

### Deployment Steps

#### 1. Prepare Code

```bash
# Ensure code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Connect Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub account
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"

#### 3. Configure Project

Vercel automatically detects Next.js projects, no additional configuration needed:

- **Framework Preset**: Next.js ✅
- **Build Command**: `pnpm build` ✅
- **Output Directory**: `.next` ✅

#### 4. Set Environment Variables

Add in Vercel project settings:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 5. Deploy

Click "Deploy" - Done! 🎉

### Post-Deployment Setup

#### Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Authentication → Settings → Authorized domains
3. Add your Vercel domain (e.g., `your-app.vercel.app`)

#### Custom Domain (Optional)

1. Add custom domain in Vercel project settings
2. Configure DNS records
3. Also add custom domain in Firebase

## 🔧 Alternative Deployment Options

### Netlify Deployment

#### Advantages

- Easy to use
- Great static site support
- Free SSL

#### Steps

1. Go to [Netlify](https://netlify.com)
2. "New site from Git" → Select repository
3. Set build command: `pnpm build`
4. Publish directory: `.next`
5. Add environment variables (same as Vercel)
6. Deploy

### Firebase Hosting Deployment

#### Advantages

- Deep integration with Firebase services
- Good performance

#### Steps

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize Hosting
firebase init hosting

# 4. Modify next.config.js
# Add output: 'export'

# 5. Build and deploy
pnpm build
firebase deploy --only hosting
```

## ✅ Deployment Checklist

### Before Deployment

- [ ] Firebase services are set up
- [ ] Environment variables are ready
- [ ] Code is pushed to GitHub
- [ ] Local testing passes (`pnpm build`)

### After Deployment

- [ ] Website is accessible
- [ ] Google sign-in works
- [ ] Admin permissions are correct
- [ ] Feature requests can be created and voted
- [ ] Comment functionality works

## 🔍 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Test build locally
pnpm build

# Check TypeScript errors
pnpm type-check

# Check ESLint errors
pnpm lint
```

#### Environment Variable Issues

- Confirm all `NEXT_PUBLIC_*` variables are set
- Check variable values are correct (no extra spaces)
- Redeploy to apply new environment variables

#### Firebase Connection Errors

- Check Firebase project ID is correct
- Confirm API key is valid
- Check authorized domains settings

#### Permission Errors

- Ensure Firestore rules are deployed
- Check admin setup
- Verify Firebase services are enabled

### Performance Optimization

#### Vercel Optimization

- Enable Analytics (optional)
- Set appropriate Cache-Control headers
- Use Vercel's Image Optimization

#### Monitoring Setup

- Set up Uptime monitoring
- Configure error tracking (e.g., Sentry)
- Monitor Firebase usage

## 📊 Deployment Comparison

| Platform         | Deploy Time | Difficulty | Free Tier | Recommendation |
| ---------------- | ----------- | ---------- | --------- | -------------- |
| **Vercel**       | 2 min       | ⭐         | Generous  | ⭐⭐⭐⭐⭐     |
| Netlify          | 5 min       | ⭐⭐       | Good      | ⭐⭐⭐⭐       |
| Firebase Hosting | 10 min      | ⭐⭐⭐     | Basic     | ⭐⭐⭐         |

---

## 中文

### ⏱️ 預估時間：2 分鐘

## 🚀 Vercel 部署（推薦）

### 為什麼選擇 Vercel？

- ⚡ **最快部署** - 2 分鐘內上線
- 🔄 **自動部署** - Git 推送即部署
- 🌍 **全球 CDN** - 極速訪問
- 💰 **免費額度** - 個人項目完全免費

### 部署步驟

#### 1. 準備代碼

```bash
# 確保代碼已推送到 GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. 連接 Vercel

1. 前往 [Vercel](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 "New Project"
4. 選擇你的 GitHub repository
5. 點擊 "Import"

#### 3. 配置專案

Vercel 會自動檢測 Next.js 專案，無需額外配置：

- **Framework Preset**: Next.js ✅
- **Build Command**: `pnpm build` ✅
- **Output Directory**: `.next` ✅

#### 4. 設置環境變數

在 Vercel 專案設置中添加：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 5. 部署

點擊 "Deploy" - 完成！🎉

### 部署後設置

#### 更新 Firebase 授權域名

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. Authentication → Settings → Authorized domains
3. 添加你的 Vercel 域名（例如：`your-app.vercel.app`）

#### 自訂域名（可選）

1. 在 Vercel 專案設置中添加自訂域名
2. 配置 DNS 記錄
3. 在 Firebase 中也添加自訂域名

## 🔧 其他部署選項

### Netlify 部署

#### 優點

- 簡單易用
- 良好的靜態網站支援
- 免費 SSL

#### 步驟

1. 前往 [Netlify](https://netlify.com)
2. "New site from Git" → 選擇 repository
3. 設置構建命令：`pnpm build`
4. 發布目錄：`.next`
5. 添加環境變數（同 Vercel）
6. 部署

### Firebase Hosting 部署

#### 優點

- 與 Firebase 服務深度整合
- 良好的性能

#### 步驟

```bash
# 1. 安裝 Firebase CLI
npm install -g firebase-tools

# 2. 登入
firebase login

# 3. 初始化 Hosting
firebase init hosting

# 4. 修改 next.config.js
# 添加 output: 'export'

# 5. 構建和部署
pnpm build
firebase deploy --only hosting
```

## ✅ 部署檢查清單

### 部署前

- [ ] Firebase 服務已設置完成
- [ ] 環境變數已準備
- [ ] 代碼已推送到 GitHub
- [ ] 本地測試通過（`pnpm build`）

### 部署後

- [ ] 網站可正常訪問
- [ ] Google 登入功能正常
- [ ] 管理員權限正確
- [ ] 功能請求可以創建和投票
- [ ] 評論功能正常

## 🔍 故障排除

### 常見部署問題

#### 構建失敗

```bash
# 本地測試構建
pnpm build

# 檢查 TypeScript 錯誤
pnpm type-check

# 檢查 ESLint 錯誤
pnpm lint
```

#### 環境變數問題

- 確認所有 `NEXT_PUBLIC_*` 變數已設置
- 檢查變數值是否正確（無多餘空格）
- 重新部署以應用新的環境變數

#### Firebase 連接錯誤

- 檢查 Firebase 專案 ID 是否正確
- 確認 API 金鑰有效
- 檢查授權域名設置

#### 權限錯誤

- 確認 Firestore 規則已部署
- 檢查管理員設置
- 驗證 Firebase 服務已啟用

### 性能優化

#### Vercel 優化

- 啟用 Analytics（可選）
- 設置適當的 Cache-Control headers
- 使用 Vercel 的 Image Optimization

#### 監控設置

- 設置 Uptime 監控
- 配置錯誤追蹤（如 Sentry）
- 監控 Firebase 使用量

## 📊 部署比較

| 平台             | 部署時間 | 難度   | 免費額度 | 推薦度     |
| ---------------- | -------- | ------ | -------- | ---------- |
| **Vercel**       | 2 分鐘   | ⭐     | 慷慨     | ⭐⭐⭐⭐⭐ |
| Netlify          | 5 分鐘   | ⭐⭐   | 良好     | ⭐⭐⭐⭐   |
| Firebase Hosting | 10 分鐘  | ⭐⭐⭐ | 基本     | ⭐⭐⭐     |
