# 🎨 Android 状态栏修复说明

## 问题描述

在 Android 平台运行应用时，状态栏（系统顶部显示时间、电池等的区域）显示为透明，而应用的标题栏是白色，导致视觉不协调。

## 解决方案

### 1. 安装状态栏插件

```bash
npm install @capacitor/status-bar
```

### 2. 更新的文件

#### ✅ `capacitor.config.ts`
添加了状态栏配置：
- 设置状态栏样式为 `LIGHT`（深色文字，适合浅色背景）
- 设置背景颜色为白色 `#ffffff`
- 禁用 WebView 覆盖模式

```typescript
plugins: {
  StatusBar: {
    style: 'LIGHT',
    backgroundColor: '#ffffff',
    overlaysWebView: false,
  },
}
```

#### ✅ `App.tsx`
- 导入 `@capacitor/status-bar` 和 `@capacitor/core`
- 添加状态栏初始化代码
- 为 header 添加顶部安全区域适配 (`pt-safe`)
- 添加 CSS 样式处理安全区域

```typescript
// 初始化状态栏
useEffect(() => {
  const initStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (error) {
        console.error('Status bar configuration error:', error);
      }
    }
  };
  initStatusBar();
}, []);
```

#### ✅ `android/app/src/main/res/values/styles.xml`
更新 Android 主题配置：
- 设置状态栏颜色为白色
- 启用浅色状态栏模式（深色图标和文字）
- 设置导航栏颜色为白色
- 启用浅色导航栏模式

```xml
<item name="android:statusBarColor">@android:color/white</item>
<item name="android:windowLightStatusBar">true</item>
<item name="android:navigationBarColor">@android:color/white</item>
<item name="android:windowLightNavigationBar">true</item>
```

## 效果

### 修复前 ❌
- 状态栏：透明
- 应用标题栏：白色
- 视觉效果：不协调，状态栏图标可能看不清

### 修复后 ✅
- 状态栏：白色背景，深色图标和文字
- 应用标题栏：白色
- 导航栏：白色背景，深色图标
- 视觉效果：统一协调，现代化设计

## 安全区域适配

应用现在支持以下安全区域：

### 顶部安全区域 (`pt-safe`)
```css
.pt-safe {
  padding-top: calc(env(safe-area-inset-top, 0px) + 1rem);
}
```
- 适配刘海屏、挖孔屏等设备
- 确保内容不被状态栏遮挡

### 底部安全区域 (`pb-safe`)
```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
```
- 适配有虚拟导航栏的设备
- 确保底部导航不被遮挡

## 测试步骤

1. **构建应用**
   ```bash
   npm run build
   ```

2. **同步到 Android**
   ```bash
   npx cap sync android
   ```

3. **在 Android Studio 中运行**
   - 打开 Android Studio
   - 运行到设备或模拟器
   - 检查状态栏是否为白色背景
   - 检查状态栏图标是否为深色
   - 检查导航栏是否为白色背景

## 自定义状态栏样式

如果你想要不同的状态栏样式，可以修改以下配置：

### 深色状态栏（浅色图标）

**capacitor.config.ts:**
```typescript
StatusBar: {
  style: 'DARK', // 浅色文字，适合深色背景
  backgroundColor: '#1f2937', // 深色背景
  overlaysWebView: false,
}
```

**styles.xml:**
```xml
<item name="android:statusBarColor">#1f2937</item>
<item name="android:windowLightStatusBar">false</item>
```

**App.tsx:**
```typescript
await StatusBar.setStyle({ style: Style.Dark });
await StatusBar.setBackgroundColor({ color: '#1f2937' });
```

### 透明状态栏（内容延伸到状态栏下方）

**capacitor.config.ts:**
```typescript
StatusBar: {
  style: 'LIGHT',
  overlaysWebView: true, // 启用覆盖模式
}
```

**App.tsx:**
```typescript
await StatusBar.setOverlaysWebView({ overlay: true });
```

## 常见问题

### Q: 状态栏颜色没有变化？
**A:** 确保：
1. 已安装 `@capacitor/status-bar` 插件
2. 已运行 `npx cap sync android`
3. 在 Android Studio 中重新构建并运行应用

### Q: 状态栏图标看不清？
**A:** 检查 `windowLightStatusBar` 设置：
- `true` = 深色图标（适合浅色背景）
- `false` = 浅色图标（适合深色背景）

### Q: 内容被状态栏遮挡？
**A:** 确保使用了安全区域适配：
```tsx
<header className="... pt-safe">
```

### Q: 不同页面需要不同的状态栏样式？
**A:** 可以在不同组件中动态调用：
```typescript
// 深色页面
await StatusBar.setStyle({ style: Style.Dark });
await StatusBar.setBackgroundColor({ color: '#1f2937' });

// 浅色页面
await StatusBar.setStyle({ style: Style.Light });
await StatusBar.setBackgroundColor({ color: '#ffffff' });
```

## 相关文档

- [Capacitor Status Bar 文档](https://capacitorjs.com/docs/apis/status-bar)
- [Android 状态栏样式指南](https://developer.android.com/training/system-ui/status)
- [CSS 安全区域](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

## 更新日志

### v1.1.0 (2025-12-03)
- ✅ 添加 `@capacitor/status-bar` 插件
- ✅ 配置白色状态栏和深色图标
- ✅ 添加安全区域适配
- ✅ 更新 Android 主题配置
- ✅ 统一状态栏和导航栏样式

---

**现在你的应用在 Android 上拥有完美的状态栏体验！🎉**
