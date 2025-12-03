<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 文须记 (WenxuJi)

一个基于 AI 的智能记录应用，支持 Web 和 Android 平台。

View your app in AI Studio: https://ai.studio/apps/drive/1SQsCF1dPxvlMY1ZkrRuuW5CiyqjJJvUT

---

## 📱 平台支持

- ✅ **Web** - 浏览器端运行
- ✅ **Android** - 原生 Android 应用

---

## 🚀 快速开始

### Web 平台

**前置要求:** Node.js

1. **安装依赖:**
   ```bash
   npm install
   ```

2. **配置 API 密钥:**
   在 [.env.local](.env.local) 中设置 `VITE_GEMINI_API_KEY`

3. **运行应用:**
   ```bash
   npm run dev
   ```

4. **访问应用:**
   打开浏览器访问 `http://localhost:5173`

### Android 平台

**前置要求:** Node.js, Android Studio, Java JDK

#### 快速同步（推荐）

**Windows (PowerShell):**
```powershell
.\sync-android.ps1 -Open
```

**macOS/Linux:**
```bash
chmod +x sync-android.sh
./sync-android.sh -o
```

#### 手动步骤

```bash
# 1. 构建 Web 应用
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打开 Android Studio
npx cap open android
```

📖 **详细文档:** 查看 [ANDROID_DEPLOY.md](ANDROID_DEPLOY.md) 获取完整的 Android 部署指南

---

## 📂 项目结构

```
WenxuApp/
├── android/              # Android 原生项目
├── components/           # React 组件
├── services/            # 服务层
├── App.tsx              # 主应用
├── capacitor.config.ts  # Capacitor 配置
├── sync-android.sh      # Android 同步脚本 (macOS/Linux)
├── sync-android.ps1     # Android 同步脚本 (Windows)
└── ANDROID_DEPLOY.md    # Android 部署文档
```

---

## 🛠️ 技术栈

- **前端框架:** React 19 + TypeScript
- **构建工具:** Vite
- **跨平台:** Capacitor
- **AI 服务:** Google Gemini API
- **图表库:** Recharts
- **图标库:** Lucide React

---

## 📚 文档

- [Android 部署指南](ANDROID_DEPLOY.md) - 完整的 Android 平台部署文档
- [AI Studio](https://ai.studio/apps/drive/1SQsCF1dPxvlMY1ZkrRuuW5CiyqjJJvUT) - 在线应用地址

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npx cap sync android` | 同步到 Android |
| `npx cap open android` | 打开 Android Studio |
| `./sync-android.sh -o` | 一键同步并打开 (macOS/Linux) |
| `.\sync-android.ps1 -Open` | 一键同步并打开 (Windows) |

---

## 📝 开发流程

1. 在浏览器中开发和测试 (`npm run dev`)
2. 构建生产版本 (`npm run build`)
3. 同步到 Android 平台 (`npx cap sync android`)
4. 在 Android Studio 中运行和测试

---

**祝你开发顺利！🚀**
