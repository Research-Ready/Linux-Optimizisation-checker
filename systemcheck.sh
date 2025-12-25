#!/usr/bin/env bash
set -e

echo "Updating package list..."
sudo apt update

echo "Installing core performance monitoring tools..."
sudo apt install -y \
  htop \
  iotop \
  sysstat \
  procps \
  psmisc \
  lsof \
  strace \
  lm-sensors \
  powertop \
  tlp \
  bc \
  jq

echo "Enabling sysstat (for iostat, sar)..."
sudo systemctl enable --now sysstat

echo "Enabling TLP (power management)..."
sudo systemctl enable --now tlp

echo "Detecting sensors..."
sudo sensors-detect --auto || true

echo
echo "Installation complete."
echo "Tools installed:"
echo "- htop        (CPU / RAM / processes)"
echo "- iotop       (disk I/O)"
echo "- sysstat     (iostat, sar)"
echo "- powertop    (power usage)"
echo "- tlp         (laptop power management)"
echo "- lm-sensors  (temperature / fan)"
echo "- lsof        (open files)"
echo "- strace      (advanced debugging)"
echo
echo "Next step: system inspection script"
