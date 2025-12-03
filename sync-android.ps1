# ====================================
# 文须记 - Android 资源同步脚本 (PowerShell)
# ====================================
# 用途：自动构建 Web 应用并同步到 Android 平台
# 使用：.\sync-android.ps1 [选项]
# ====================================

param(
    [switch]$Help,
    [switch]$SkipInstall,
    [switch]$Open,
    [switch]$Run,
    [switch]$Clean
)

# 颜色定义
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Print-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️  $Message" "Cyan"
}

function Print-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Print-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Print-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Print-Header {
    param([string]$Message)
    Write-ColorOutput "================================" "Cyan"
    Write-ColorOutput $Message "Cyan"
    Write-ColorOutput "================================" "Cyan"
}

# 显示帮助信息
function Show-Help {
    Write-Host "用法: .\sync-android.ps1 [选项]"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -Help           显示此帮助信息"
    Write-Host "  -SkipInstall    跳过 npm install"
    Write-Host "  -Open           同步后打开 Android Studio"
    Write-Host "  -Run            同步后直接运行到设备"
    Write-Host "  -Clean          清理构建缓存后再同步"
    Write-Host ""
    Write-Host "示例:"
    Write-Host "  .\sync-android.ps1              # 基本同步"
    Write-Host "  .\sync-android.ps1 -Open        # 同步并打开 Android Studio"
    Write-Host "  .\sync-android.ps1 -SkipInstall -Open  # 跳过安装，同步并打开"
    Write-Host "  .\sync-android.ps1 -Clean -Run  # 清理、同步并运行"
}

# 显示帮助并退出
if ($Help) {
    Show-Help
    exit 0
}

# 错误处理
$ErrorActionPreference = "Stop"

# 开始执行
Print-Header "文须记 - Android 资源同步"

# 检查环境
Print-Info "检查环境..."

try {
    $nodeVersion = node --version
    Print-Success "Node.js 版本: $nodeVersion"
} catch {
    Print-Error "未找到 Node.js，请先安装 Node.js"
    exit 1
}

try {
    $npmVersion = npm --version
    Print-Success "npm 版本: $npmVersion"
} catch {
    Print-Error "未找到 npm，请先安装 npm"
    exit 1
}

# 检查 .env.local 文件
if (-not (Test-Path ".env.local")) {
    Print-Warning ".env.local 文件不存在，某些功能可能无法正常工作"
    Print-Info "请创建 .env.local 文件并添加必要的环境变量"
}

# 步骤 1: 安装依赖
if (-not $SkipInstall) {
    Print-Header "步骤 1/4: 安装依赖"
    try {
        npm install
        Print-Success "依赖安装完成"
    } catch {
        Print-Error "依赖安装失败: $_"
        exit 1
    }
} else {
    Print-Warning "跳过依赖安装"
}

# 步骤 2: 清理构建（可选）
if ($Clean) {
    Print-Header "步骤 2/4: 清理构建缓存"
    
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Print-Success "已删除 dist 目录"
    }
    
    if (Test-Path "android\app\build") {
        Remove-Item -Recurse -Force "android\app\build"
        Print-Success "已删除 Android 构建缓存"
    }
    
    if (Test-Path "android\.gradle") {
        Remove-Item -Recurse -Force "android\.gradle"
        Print-Success "已删除 Gradle 缓存"
    }
    
    Print-Success "清理完成"
} else {
    Print-Info "步骤 2/4: 跳过清理（使用 -Clean 选项启用）"
}

# 步骤 3: 构建 Web 应用
Print-Header "步骤 3/4: 构建 Web 应用"
try {
    npm run build
    
    if (-not (Test-Path "dist")) {
        Print-Error "构建失败：dist 目录不存在"
        exit 1
    }
    
    Print-Success "Web 应用构建完成"
} catch {
    Print-Error "构建失败: $_"
    exit 1
}

# 步骤 4: 同步到 Android
Print-Header "步骤 4/4: 同步到 Android 平台"
try {
    npx cap sync android
    Print-Success "Android 资源同步完成"
} catch {
    Print-Error "同步失败: $_"
    exit 1
}

# 显示同步信息
Print-Info "同步详情："
Write-Host "  • Web 资源目录: dist\"
Write-Host "  • Android 资源目录: android\app\src\main\assets\"
Write-Host "  • 应用 ID: com.yourcompany.wenxuji"
Write-Host "  • 应用名称: 文须记"

# 可选：打开 Android Studio
if ($Open) {
    Print-Header "打开 Android Studio"
    try {
        npx cap open android
        Print-Success "Android Studio 已启动"
    } catch {
        Print-Warning "打开 Android Studio 失败: $_"
    }
}

# 可选：直接运行到设备
if ($Run) {
    Print-Header "运行到设备"
    
    # 检查是否有连接的设备
    try {
        $adbPath = Get-Command adb -ErrorAction SilentlyContinue
        
        if ($adbPath) {
            $devices = adb devices | Select-String "device$"
            $deviceCount = ($devices | Measure-Object).Count
            
            if ($deviceCount -eq 0) {
                Print-Warning "未检测到连接的设备或模拟器"
                Print-Info "请先启动模拟器或连接真机"
            } else {
                Print-Info "检测到 $deviceCount 个设备"
                npx cap run android
                Print-Success "应用已运行到设备"
            }
        } else {
            Print-Warning "未找到 adb 命令，跳过设备检测"
            npx cap run android
        }
    } catch {
        Print-Warning "运行到设备失败: $_"
    }
}

# 完成
Print-Header "✨ 同步完成！"

if (-not $Open -and -not $Run) {
    Write-Host ""
    Print-Info "下一步操作："
    Write-Host "  1. 打开 Android Studio: npx cap open android"
    Write-Host "  2. 或直接运行: npx cap run android"
    Write-Host "  3. 或使用脚本: .\sync-android.ps1 -Open"
}

Write-Host ""
Print-Success "祝你开发顺利！🚀"
