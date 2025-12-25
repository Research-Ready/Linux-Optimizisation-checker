## Current issues
-[] In the RECOMMENDATIONS section, pressing the buttons does not give any feedback.
- [ ] in the installer, I see a progress bar, but I think its quite deceptive as it might not work.
- [ ] In the System Check menu, When Clicking Generate report the button doesn't seem to work. 
- [ ] In the tweaks section it doesnt say if its an improvement; All the tooltips need more explanation.
- [ ] in the install tools, the tools randomly say if they are installed or not, pressing the check status button randomly says if programs are installed or not.

- [ ] A new section with different tools should be installed; 
- [ ] in the live monitoring, I believe the dashboard is not reading the values correctly, as memory jumps all over the place. 


# Linux Optimization Checker - WebUI

A modern, web-based graphical interface for Linux system optimization and monitoring. This application provides a user-friendly dashboard to run optimization scripts, monitor system performance, and receive personalized recommendations.

## Features

### 🚀 Core Functionality
- **One-Click Script Execution**: Run installation and system check scripts with progress tracking
- **Real-time Monitoring**: Live system metrics with interactive charts
- **System Health Scoring**: Comprehensive health analysis with visual indicators
- **Optimization Recommendations**: Personalized suggestions based on system analysis

### 📊 Dashboard Components
- **System Overview**: CPU, Memory, Disk, and Temperature monitoring
- **Quick Actions**: One-click access to common operations
- **Recent Activity**: History of script executions and system checks
- **Health Score**: Visual circular progress indicator with status

### 🛠️ Script Management
- **Install Tools**: Install performance monitoring tools (htop, iotop, sysstat, etc.)
- **System Check**: Comprehensive system analysis and optimization suggestions
- **Progress Tracking**: Real-time progress indicators during script execution
- **Terminal Output**: Full terminal interface for script output and debugging

### 📈 Monitoring & Analytics
- **Live Charts**: Real-time CPU, Memory, Disk I/O, and Network monitoring
- **Historical Data**: Track system performance over time
- **Export Capabilities**: Export reports and historical data
- **Interactive Interface**: Responsive design that works on desktop and mobile

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Toast Notifications**: Non-intrusive feedback for user actions

## Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development)

### Quick Start

1. **Download the WebUI Package**
   ```bash
   # Clone or download the project files
   git clone <repository-url>
   cd Linux-Optimizisation-checker
   ```

2. **Start the Web Server**
   ```bash
   # Option 1: Using Python (built-in server)
   python3 -m http.server 8080
   
   # Option 2: Using Node.js
   npx serve -s . -l 8080
   
   # Option 3: Using WebUI framework
   webui serve . --port 8080
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8080` in your web browser.

## Usage

### Dashboard Overview
The main dashboard provides a comprehensive view of your system's health:
- **System Stats**: Real-time CPU, Memory, Disk, and Temperature readings
- **Health Score**: Overall system health percentage with status indicator
- **Quick Actions**: One-click buttons for common operations
- **Recent Activity**: Timeline of recent script executions

### Running Scripts

#### Install Performance Tools
1. Navigate to the "Install Tools" tab
2. Click "Install All Tools" or check individual tool status
3. Monitor progress in the terminal modal
4. View installation results and tool status

#### System Optimization Check
1. Go to the "System Check" tab
2. Click "Run System Check"
3. Monitor the analysis progress
4. Review detailed results and recommendations

### Live Monitoring
1. Navigate to the "Live Monitoring" tab
2. Click "Start Monitoring" to begin real-time tracking
3. View interactive charts for CPU, Memory, Disk I/O, and Network
4. Use "Stop Monitoring" to pause or "Clear Charts" to reset

### Optimization Recommendations
1. After running a system check, visit the "Recommendations" tab
2. Review personalized suggestions for improving system performance
3. Apply recommendations individually or all at once
4. Track improvements over time

### Historical Data
1. Go to the "History" tab
2. Select a time range (1 hour, 6 hours, 24 hours, 7 days)
3. View historical performance charts
4. Export data for further analysis

## File Structure

```
Linux-Optimizisation-checker/
├── index.html          # Main HTML interface
├── styles.css          # CSS styling and themes
├── script.js           # JavaScript functionality
├── webui.json          # WebUI configuration
├── systeminstall.sh    # Original installation script
├── systemcheck.sh      # Original system check script
└── README.md          # This documentation
```

## Integration with Original Scripts

The WebUI interface seamlessly integrates with your existing shell scripts:

### systeminstall.sh
- Installs performance monitoring tools (htop, iotop, sysstat, etc.)
- Enables system services (sysstat, TLP)
- Detects hardware sensors
- The WebUI provides a user-friendly interface to run this script

### systemcheck.sh
- Analyzes system performance
- Provides optimization recommendations
- The WebUI enhances this with real-time monitoring and detailed reporting

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support  
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Responsive design

## Development

### Running in Development Mode
```bash
# Start development server with auto-reload
webui serve . --port 8080 --dev
```

### Building for Production
```bash
# Build optimized version
webui build .
```

### Creating Executable
```bash
# Package as standalone application
webui package .
```

## Security Notes

- The WebUI runs in your browser and doesn't require special permissions
- Script execution is simulated in the demo - real implementation would require backend integration
- All data is stored locally in your browser
- No external connections are made unless explicitly configured

## Troubleshooting

### Common Issues

**Scripts not executing:**
- Ensure you have proper permissions to execute shell scripts
- Check that required tools (bash, apt) are available
- Verify script paths are correct

**Charts not updating:**
- Check browser console for JavaScript errors
- Ensure Chart.js is loaded properly
- Try refreshing the page

**Theme not persisting:**
- Check that localStorage is enabled in your browser
- Clear browser cache and try again

### Getting Help

1. Check the browser console for error messages
2. Verify all files are present and accessible
3. Ensure your browser supports modern web standards
4. Test with a different browser

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the browser console for technical details

---

**Note**: This WebUI interface enhances your existing Linux optimization scripts with a modern, user-friendly interface. The original shell scripts remain unchanged and functional.
