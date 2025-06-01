# Admin Guide

[English](#english) | [中文](#中文)

---

## English

### ⏱️ Estimated Time: 3 minutes

## 🎯 Admin Features Overview

As an admin, you can customize the platform's appearance and functionality through an intuitive UI interface without modifying code.

### 🔑 Getting Admin Access

1. Sign in with your Google account
2. In Firestore Console, find the `users` collection
3. Locate your user document and set `isAdmin` field to `true`
4. Sign in again to see the Admin menu

## 🎨 Platform Customization

### Accessing Settings

1. After signing in, click the user menu in the top right
2. Select "Admin" to enter the admin panel
3. Click the "Settings" card

### Branding Settings

#### Project Name

- **Location**: Branding → Project Name
- **Function**: Customize platform title, displayed in:
  - Navigation bar next to logo
  - Browser title
  - Homepage title
- **Suggestion**: Use concise, powerful names like "ProductHub", "FeatureVote"

#### Tagline Settings

- **Location**: Branding → Tagline
- **Function**: Platform description text, shown on homepage
- **Suggestion**: Clearly explain platform purpose, e.g., "Collect user feedback, optimize product experience"

### Theme Settings

#### Primary Color

- **Location**: Theme → Primary Color
- **Function**: Set brand primary color, affects:
  - Button colors
  - Link colors
  - Logo background color
  - Accent elements
- **Usage**:
  - Click color picker to select color
  - Or directly input HEX color code (e.g., #3b82f6)
- **Live Preview**: See effects immediately after modification

#### Default Theme

- **Location**: Theme → Default Theme
- **Options**:
  - **Light**: Suitable for daytime use
  - **Dark**: Suitable for nighttime use
  - **System**: Follow user's system settings

### 💾 Saving Settings

1. Click "Save Changes" after modifications
2. System will show "Settings saved successfully!"
3. All changes take effect immediately, no redeployment needed

## 🏷️ Label Management

### Creating Labels

1. Admin panel → Labels
2. Click "Add Label"
3. Enter label name (e.g., "UI/UX", "Performance")
4. Click "Create"

### Managing Labels

- **Edit**: Click edit button next to label
- **Delete**: Click delete button (shows confirmation dialog)
- **Usage Statistics**: View how many times each label is used

## 👥 User Management

### View User Statistics

On the Admin panel homepage, you can see:

- **Active Users** (within 30 days)
- **Total Feature Requests**
- **Total Comments**

### Permission Management

Currently supports two user roles:

- **Regular Users**: Can create feature requests, vote, comment
- **Admins**: Have all permissions, can manage platform settings

## 📊 Content Management

### Feature Request Management

As an admin, you can:

- **Edit any feature request**: Modify title, description, status
- **Delete feature requests**: Remove inappropriate content
- **Change status**: Mark requests as in progress, completed, etc.

### Comment Management

- **Delete comments**: Remove inappropriate or spam comments
- **View all comments**: Monitor platform content quality

## 🎨 Customization Preview

### Live Preview Feature

When you modify settings, you can immediately see:

- **Navigation bar**: Logo and project name changes
- **Button colors**: Primary color application
- **Homepage content**: Tagline and project name updates

### Responsive Design

All custom settings automatically adapt to:

- **Desktop**: Full feature display
- **Tablet**: Moderate layout adjustments
- **Mobile**: Optimized mobile experience

## 🔧 Advanced Settings

### Future Features

The following features are in development:

- **Feature Toggles**: Control enabling/disabling of specific features
- **Advanced Customization**: More appearance and behavior options
- **Notification Settings**: Email notification configuration
- **Analytics Reports**: Detailed usage statistics

## 💡 Best Practices

### Brand Consistency

1. **Color Selection**: Use brand colors consistent with your product
2. **Naming Convention**: Project name should be concise and memorable
3. **Tagline Writing**: Clearly explain platform value

### User Experience

1. **Label Classification**: Create meaningful labels to help categorization
2. **Status Management**: Timely update feature request status
3. **Content Monitoring**: Regularly check and clean inappropriate content

### Performance Considerations

1. **Image Optimization**: Avoid using oversized logo images
2. **Color Contrast**: Ensure text is clearly readable on selected colors
3. **Regular Maintenance**: Clean up outdated labels and content

---

## 中文

### ⏱️ 預估時間：3 分鐘

## 🎯 管理員功能概覽

作為管理員，你可以通過直觀的 UI 界面自訂平台的外觀和功能，無需修改代碼。

### 🔑 獲取管理員權限

1. 使用 Google 帳號登入平台
2. 在 Firestore Console 中找到 `users` 集合
3. 找到你的用戶文檔，將 `isAdmin` 字段設為 `true`
4. 重新登入即可看到 Admin 選單

## 🎨 平台自訂設置

### 訪問設置頁面

1. 登入後點擊右上角用戶選單
2. 選擇 "Admin" 進入管理面板
3. 點擊 "Settings" 卡片

### 品牌設定

#### 專案名稱

- **位置**：品牌設定 → 專案名稱
- **功能**：自訂平台標題，會顯示在：
  - 導航欄 Logo 旁
  - 瀏覽器標題
  - 首頁標題
- **建議**：使用簡潔有力的名稱，如 "ProductHub"、"FeatureVote"

#### 標語設定

- **位置**：品牌設定 → 標語
- **功能**：平台描述文字，顯示在首頁
- **建議**：清楚說明平台用途，如 "收集用戶反饋，優化產品體驗"

### 主題設定

#### 主要顏色

- **位置**：主題設定 → 主要顏色
- **功能**：設定品牌主色調，影響：
  - 按鈕顏色
  - 連結顏色
  - Logo 背景色
  - 強調元素
- **使用方式**：
  - 點擊色彩選擇器選擇顏色
  - 或直接輸入 HEX 色碼（如 #3b82f6）
- **即時預覽**：修改後立即在頁面上看到效果

#### 預設主題

- **位置**：主題設定 → 預設主題
- **選項**：
  - **淺色**：適合日間使用
  - **深色**：適合夜間使用
  - **系統**：跟隨用戶系統設定

### 💾 儲存設定

1. 修改完成後點擊 "儲存變更"
2. 系統會顯示 "設定已成功儲存！"
3. 所有變更立即生效，無需重新部署

## 🏷️ 標籤管理

### 創建標籤

1. Admin 面板 → Labels
2. 點擊 "新增標籤"
3. 輸入標籤名稱（如 "UI/UX"、"性能優化"）
4. 點擊 "創建"

### 管理標籤

- **編輯**：點擊標籤旁的編輯按鈕
- **刪除**：點擊刪除按鈕（會顯示確認對話框）
- **使用統計**：查看每個標籤被使用的次數

## 👥 用戶管理

### 查看用戶統計

在 Admin 面板首頁可以看到：

- **活躍用戶數**（30 天內）
- **總功能請求數**
- **總評論數**

### 管理權限

目前支援兩種用戶角色：

- **一般用戶**：可以創建功能請求、投票、評論
- **管理員**：擁有所有權限，可以管理平台設定

## 📊 內容管理

### 功能請求管理

作為管理員，你可以：

- **編輯任何功能請求**：修改標題、描述、狀態
- **刪除功能請求**：移除不適當的內容
- **更改狀態**：將請求標記為進行中、已完成等

### 評論管理

- **刪除評論**：移除不適當或垃圾評論
- **查看所有評論**：監控平台內容品質

## 🎨 自訂效果預覽

### 即時預覽功能

當你修改設定時，可以立即看到：

- **導航欄**：Logo 和專案名稱變化
- **按鈕顏色**：主要顏色的應用
- **首頁內容**：標語和專案名稱更新

### 響應式設計

所有自訂設定都會自動適配：

- **桌面版**：完整功能展示
- **平板**：適中的佈局調整
- **手機**：優化的移動體驗

## 🔧 進階設定

### 未來功能

以下功能正在開發中：

- **功能開關**：控制特定功能的啟用/停用
- **進階自訂**：更多外觀和行為選項
- **通知設定**：郵件通知配置
- **分析報告**：詳細的使用統計

## 💡 最佳實踐

### 品牌一致性

1. **顏色選擇**：使用與你產品一致的品牌色
2. **命名規範**：專案名稱要簡潔易記
3. **標語撰寫**：清楚說明平台價值

### 用戶體驗

1. **標籤分類**：創建有意義的標籤幫助分類
2. **狀態管理**：及時更新功能請求狀態
3. **內容監控**：定期檢查和清理不當內容

### 性能考量

1. **圖片優化**：避免使用過大的 Logo 圖片
2. **顏色對比**：確保文字在選定顏色上清晰可讀
3. **定期維護**：清理過時的標籤和內容
