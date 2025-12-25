#!/usr/bin/env bash
set -e

echo "=== Linux Optimization Checker ==="
echo "Starting comprehensive system analysis and optimization..."
echo

# Function to check if a package is installed
is_installed() {
    dpkg -l | grep -q "^ii  $1 "
}

# Function to install package with error handling
install_package() {
    local package=$1
    echo "Installing $package..."
    if sudo apt install -y "$package"; then
        echo "✓ $package installed successfully"
        return 0
    else
        echo "✗ Failed to install $package"
        return 1
    fi
}

# Function to enable service with error handling
enable_service() {
    local service=$1
    echo "Enabling $service service..."
    if sudo systemctl enable --now "$service" 2>/dev/null; then
        echo "✓ $service service enabled"
        return 0
    else
        echo "⚠ $service service not available or failed to enable"
        return 1
    fi
}

echo "1. Updating package list..."
sudo apt update -qq

echo "2. Installing core performance monitoring tools..."
tools_installed=0
total_tools=11

# Install individual tools with better error handling
for tool in htop iotop sysstat procps psmisc lsof strace powertop bc jq; do
    if install_package "$tool"; then
        ((tools_installed++))
    fi
done

# Special handling for lm-sensors
echo "Installing lm-sensors (temperature monitoring)..."
if install_package lm-sensors; then
    echo "Running sensor detection..."
    sudo sensors-detect --auto --quiet 2>/dev/null || {
        echo "Sensor detection completed (some sensors may not be detected)"
    }
    ((tools_installed++))
fi

# Special handling for TLP
echo "Installing TLP (advanced power management)..."
if install_package tlp; then
    enable_service tlp
    ((tools_installed++))
fi

echo "3. Enabling system services..."
enable_service sysstat

echo
echo "=== Installation Summary ==="
echo "Tools installed: $tools_installed/$total_tools"
echo

# Check installation status
echo "=== Tool Status Check ==="
for tool in htop iotop iostat sar powertop tlp sensors lsof strace bc jq; do
    if command -v "$tool" >/dev/null 2>&1; then
        echo "✓ $tool is available"
    else
        echo "✗ $tool is NOT available"
    fi
done

echo
echo "=== System Optimization Analysis ==="

# CPU Analysis
echo "Analyzing CPU performance..."
cpu_cores=$(nproc)
cpu_model=$(grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)
echo "CPU: $cpu_model ($cpu_cores cores)"

# Memory Analysis
echo "Analyzing memory configuration..."
total_mem=$(free -h | grep "Mem:" | awk '{print $2}')
available_mem=$(free -h | grep "Mem:" | awk '{print $7}')
echo "Memory: $total_mem total, $available_mem available"

# Disk Analysis
echo "Analyzing disk configuration..."
df -h | grep -E '^/dev/' | while read line; do
    device=$(echo $line | awk '{print $1}')
    size=$(echo $line | awk '{print $2}')
    usage=$(echo $line | awk '{print $5}')
    mount=$(echo $line | awk '{print $6}')
    echo "Disk: $device ($size, $usage used, mounted at $mount)"
done

# Temperature Check
echo "Checking system temperature..."
if command -v sensors >/dev/null 2>&1; then
    temp_output=$(sensors 2>/dev/null | grep -E "Core|temp" | head -3)
    if [ -n "$temp_output" ]; then
        echo "Temperature: $temp_output"
    else
        echo "Temperature: Sensors detected but no temperature data available"
    fi
else
    echo "Temperature: lm-sensors not properly installed"
fi

# Network Analysis
echo "Analyzing network configuration..."
active_interfaces=$(ip link show | grep "state UP" | wc -l)
echo "Network: $active_interfaces active interface(s)"

echo
echo "=== Optimization Recommendations ==="

# Generate recommendations based on analysis
echo "Based on your system analysis, here are our recommendations:"
echo

# CPU recommendations
if [ $cpu_cores -lt 4 ]; then
    echo "🔧 CPU: Consider closing unnecessary applications to reduce CPU load"
    echo "   Tip: Use 'htop' to identify resource-heavy processes"
else
    echo "✅ CPU: Your system has good CPU capacity ($cpu_cores cores)"
fi

# Memory recommendations
mem_gb=$(free -g | grep "Mem:" | awk '{print $2}')
if [ $mem_gb -lt 8 ]; then
    echo "🔧 Memory: Consider adding more RAM or enabling swap file"
    echo "   Tip: Use 'free -h' to monitor memory usage"
else
    echo "✅ Memory: Your system has adequate RAM ($total_mem)"
fi

# Disk recommendations
root_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $root_usage -gt 80 ]; then
    echo "🔧 Disk: Root partition is $root_usage% full - consider cleanup"
    echo "   Tip: Use 'du -sh /*' to find large directories"
else
    echo "✅ Disk: Root partition usage is healthy ($root_usage%)"
fi

# Temperature recommendations
if command -v sensors >/dev/null 2>&1; then
    temp_check=$(sensors 2>/dev/null | grep "Core 0" | awk '{print $3}' | sed 's/+//' | sed 's/°C//')
    if [ -n "$temp_check" ] && [ "${temp_check%.*}" -gt 70 ]; then
        echo "🔧 Temperature: CPU running hot ($temp_check°C) - check cooling"
        echo "   Tip: Clean dust from fans and ensure proper ventilation"
    else
        echo "✅ Temperature: CPU temperature is within normal range"
    fi
fi

echo
echo "=== Quick Optimization Commands ==="
echo "Run these commands to apply basic optimizations:"
echo
echo "1. Update system packages:"
echo "   sudo apt update && sudo apt upgrade -y"
echo
echo "2. Clean package cache:"
echo "   sudo apt autoremove && sudo apt autoclean"
echo
echo "3. Monitor system in real-time:"
echo "   htop"
echo
echo "4. Check disk usage:"
echo "   df -h"
echo
echo "5. Monitor network connections:"
echo "   ss -tuln"
echo
echo "=== Advanced Tweaks Available ==="
echo "The WebUI interface provides additional optimization options:"
echo "- CPU governor tuning"
echo "- Swappiness optimization"
echo "- Network buffer tuning"
echo "- I/O scheduler optimization"
echo "- Power management profiles"
echo
echo "Access these through the WebUI 'Tweaks' section!"
echo
echo "Installation and analysis complete!"
echo "WebUI is running at: http://localhost:8080"
