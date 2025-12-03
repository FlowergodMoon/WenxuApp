#!/bin/bash

# ====================================
# 文须记 - Android 资源同步脚本
# ====================================
# 用途：自动构建 Web 应用并同步到 Android 平台
# 使用：./sync-android.sh [选项]
# ====================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 显示帮助信息
show_help() {
    echo "用法: ./sync-android.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示此帮助信息"
    echo "  -s, --skip-install  跳过 npm install"
    echo "  -o, --open          同步后打开 Android Studio"
    echo "  -r, --run           同步后直接运行到设备"
    echo "  -c, --clean         清理构建缓存后再同步"
    echo ""
    echo "示例:"
    echo "  ./sync-android.sh              # 基本同步"
    echo "  ./sync-android.sh -o           # 同步并打开 Android Studio"
    echo "  ./sync-android.sh -s -o        # 跳过安装，同步并打开"
    echo "  ./sync-android.sh -c -r        # 清理、同步并运行"
}

# 默认选项
SKIP_INSTALL=false
OPEN_STUDIO=false
RUN_APP=false
CLEAN_BUILD=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        -o|--open)
            OPEN_STUDIO=true
            shift
            ;;
        -r|--run)
            RUN_APP=true
            shift
            ;;
        -c|--clean)
            CLEAN_BUILD=true
            shift
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 开始执行
print_header "文须记 - Android 资源同步"

# 检查必需的命令
print_info "检查环境..."

if ! command_exists node; then
    print_error "未找到 Node.js，请先安装 Node.js"
    exit 1
fi

if ! command_exists npm; then
    print_error "未找到 npm，请先安装 npm"
    exit 1
fi

print_success "环境检查通过"

# 检查 .env.local 文件
if [ ! -f ".env.local" ]; then
    print_warning ".env.local 文件不存在，某些功能可能无法正常工作"
    print_info "请创建 .env.local 文件并添加必要的环境变量"
fi

# 步骤 1: 安装依赖
if [ "$SKIP_INSTALL" = false ]; then
    print_header "步骤 1/4: 安装依赖"
    npm install
    print_success "依赖安装完成"
else
    print_warning "跳过依赖安装"
fi

# 步骤 2: 清理构建（可选）
if [ "$CLEAN_BUILD" = true ]; then
    print_header "步骤 2/4: 清理构建缓存"
    
    if [ -d "dist" ]; then
        rm -rf dist
        print_success "已删除 dist 目录"
    fi
    
    if [ -d "android/app/build" ]; then
        rm -rf android/app/build
        print_success "已删除 Android 构建缓存"
    fi
    
    if [ -d "android/.gradle" ]; then
        rm -rf android/.gradle
        print_success "已删除 Gradle 缓存"
    fi
    
    print_success "清理完成"
else
    print_info "步骤 2/4: 跳过清理（使用 -c 选项启用）"
fi

# 步骤 3: 构建 Web 应用
print_header "步骤 3/4: 构建 Web 应用"
npm run build

if [ ! -d "dist" ]; then
    print_error "构建失败：dist 目录不存在"
    exit 1
fi

print_success "Web 应用构建完成"

# 步骤 4: 同步到 Android
print_header "步骤 4/4: 同步到 Android 平台"
npx cap sync android

if [ $? -eq 0 ]; then
    print_success "Android 资源同步完成"
else
    print_error "同步失败"
    exit 1
fi

# 显示同步信息
print_info "同步详情："
echo "  • Web 资源目录: dist/"
echo "  • Android 资源目录: android/app/src/main/assets/"
echo "  • 应用 ID: com.yourcompany.wenxuji"
echo "  • 应用名称: 文须记"

# 可选：打开 Android Studio
if [ "$OPEN_STUDIO" = true ]; then
    print_header "打开 Android Studio"
    npx cap open android
    print_success "Android Studio 已启动"
fi

# 可选：直接运行到设备
if [ "$RUN_APP" = true ]; then
    print_header "运行到设备"
    
    # 检查是否有连接的设备
    if command_exists adb; then
        DEVICE_COUNT=$(adb devices | grep -v "List" | grep "device" | wc -l)
        
        if [ "$DEVICE_COUNT" -eq 0 ]; then
            print_warning "未检测到连接的设备或模拟器"
            print_info "请先启动模拟器或连接真机"
        else
            print_info "检测到 $DEVICE_COUNT 个设备"
            npx cap run android
            print_success "应用已运行到设备"
        fi
    else
        print_warning "未找到 adb 命令，跳过设备检测"
        npx cap run android
    fi
fi

# 完成
print_header "✨ 同步完成！"

if [ "$OPEN_STUDIO" = false ] && [ "$RUN_APP" = false ]; then
    echo ""
    print_info "下一步操作："
    echo "  1. 打开 Android Studio: npx cap open android"
    echo "  2. 或直接运行: npx cap run android"
    echo "  3. 或使用脚本: ./sync-android.sh -o"
fi

echo ""
print_success "祝你开发顺利！🚀"
