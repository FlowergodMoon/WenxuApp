# 🎯 Android 部署快速参考

## 📁 新增文件

本次更新添加了以下文件来支持 Android 平台部署：

### 1. 📖 ANDROID_DEPLOY.md
**完整的 Android 部署文档**
- 前置要求和环境配置
- 详细的部署步骤
- 常见问题解答
- 命令参考手册
- 发布到 Google Play 的指南

### 2. 🔧 sync-android.sh (macOS/Linux)
**自动化同步脚本**
```bash
# 基本用法
./sync-android.sh

# 带选项
./sync-android.sh -o          # 同步并打开 Android Studio
./sync-android.sh -s -o       # 跳过安装，同步并打开
./sync-android.sh -c -r       # 清理、同步并运行
```

**支持的选项：**
- `-h, --help` - 显示帮助
- `-s, --skip-install` - 跳过 npm install
- `-o, --open` - 同步后打开 Android Studio
- `-r, --run` - 同步后直接运行到设备
- `-c, --clean` - 清理构建缓存

### 3. 🔧 sync-android.ps1 (Windows)
**Windows PowerShell 版本的同步脚本**
```powershell
# 基本用法
.\sync-android.ps1

# 带选项
.\sync-android.ps1 -Open          # 同步并打开 Android Studio
.\sync-android.ps1 -SkipInstall -Open  # 跳过安装，同步并打开
.\sync-android.ps1 -Clean -Run    # 清理、同步并运行
```

**支持的选项：**
- `-Help` - 显示帮助
- `-SkipInstall` - 跳过 npm install
- `-Open` - 同步后打开 Android Studio
- `-Run` - 同步后直接运行到设备
- `-Clean` - 清理构建缓存

---

## 🚀 快速开始

### 第一次运行

**Windows:**
```powershell
.\sync-android.ps1 -Open
```

**macOS/Linux:**
```bash
chmod +x sync-android.sh
./sync-android.sh -o
```

### 日常开发

1. **在浏览器中开发**
   ```bash
   npm run dev
   ```

2. **同步到 Android**
   ```bash
   # Windows
   .\sync-android.ps1
   
   # macOS/Linux
   ./sync-android.sh
   ```

3. **在 Android Studio 中运行**
   - 点击绿色 ▶️ 按钮

---

## 📋 工作流程

```
┌─────────────────┐
│  编写代码        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  npm run dev    │ ← 浏览器中测试
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  同步脚本        │ ← ./sync-android.sh 或 .\sync-android.ps1
└────────┬────────┘
         │
         ├─→ npm run build
         ├─→ npx cap sync android
         └─→ npx cap open android (可选)
         │
         ▼
┌─────────────────┐
│  Android Studio │ ← 运行到设备/模拟器
└─────────────────┘
```

---

## 🎨 脚本特性

### ✅ 自动化流程
- 自动检查环境依赖
- 自动安装 npm 包
- 自动构建 Web 应用
- 自动同步到 Android

### 🎨 美观的输出
- 彩色终端输出
- 清晰的步骤提示
- 进度反馈
- 错误高亮

### 🔧 灵活的选项
- 可跳过依赖安装（加快速度）
- 可清理构建缓存
- 可自动打开 Android Studio
- 可直接运行到设备

### 🛡️ 错误处理
- 环境检查
- 构建验证
- 友好的错误提示

---

## 📚 相关文档

- **[ANDROID_DEPLOY.md](ANDROID_DEPLOY.md)** - 完整的 Android 部署指南
- **[README.md](README.md)** - 项目主文档
- **[Capacitor 官方文档](https://capacitorjs.com/docs)** - Capacitor 框架文档

---

## 💡 提示

1. **首次使用前**
   - 确保已安装 Android Studio
   - 配置好 Android SDK
   - 创建 `.env.local` 并设置 API 密钥

2. **开发建议**
   - 优先在浏览器中开发（更快的热重载）
   - 定期同步到 Android 测试
   - 使用脚本自动化重复任务

3. **性能优化**
   - 使用 `-SkipInstall` 跳过不必要的安装
   - 只在需要时使用 `-Clean` 清理缓存
   - 考虑使用 `npx cap run android` 直接运行

---

**快乐编码！🎉**
