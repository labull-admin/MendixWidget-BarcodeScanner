# Mendix Barcode Scanner Widget

A powerful and flexible barcode scanning widget for Mendix applications that supports both camera scanning and image upload functionality using Dynamsoft Barcode Reader SDK.

**Maintained by 兰博基尼织造**

## 🚀 Features

- **Dual Scanning Modes**: Camera scanning and image upload
- **Multiple Barcode Types**: QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, PDF417, Data Matrix, Aztec, and more
- **Flexible Sizing**: Configurable width and height in pixels or percentage
- **Scan Modes**: Single scan or continuous scanning
- **Multi-language Support**: English and Chinese (中文)
- **Preload Mode**: Background SDK initialization for better performance
- **Responsive Design**: Mobile-friendly interface
- **Customizable**: Configurable license key and engine resource path

## 📋 Prerequisites

- Mendix Studio Pro 9.0 or higher
- Node.js 16 or higher
- A Dynamsoft license key (free trial available)

## 🛠️ Installation

Simply download and install the widget from the Mendix Marketplace. That's all you need to get started!

## ⚙️ Configuration

### Basic Configuration

#### General Properties
- **Content**: Optional content to display above the scanner
- **Scanned Result Attribute**: String attribute to store the scanned result

#### Barcode Reader Properties
- **Scan Mode**: 
  - `Single Scan`: Stops after detecting one barcode
  - `Continuous Scan`: Keeps scanning for multiple barcodes
- **Decode Mode**:
  - `Camera Scan`: Use device camera
  - `Image Upload`: Upload images for scanning
  - `Both`: Enable both camera and image upload
- **Width/Height**: Configure dimensions in pixels or percentage
- **Language**: Choose between English and Chinese
- **Barcode Types**: Select specific barcode types or use "All Types"

### Advanced Configuration

#### License Setup
- **License Key**: Your Dynamsoft license key
  - Default: `DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9` (trial license)
  - Get your own license at [Dynamsoft](https://www.dynamsoft.com/barcode-reader/sdk-javascript/)
  - ⚠️ **Security Notice**: Since this widget runs client-side, the license key will be visible in the browser. This is standard for client-side SDKs. To protect your license:
    1. Restrict usage by domain/app in your Dynamsoft console
    2. Monitor usage for unauthorized access
    3. Consider Dynamsoft server-side SDK for more sensitive applications

#### Engine Resource Path
- **Engine Resource Path**: URL to Dynamsoft engine files
  - Default: `https://unpkg.com/dynamsoft-javascript-barcode@9.6.42/dist/`
  - ⚠️ **Important for China Region**: If you are deploying in China, you **MUST** host these engine resources yourself due to internet connection restrictions. The default UNPKG CDN may not be accessible from China.
  - You can host your own files for better performance or to meet regional requirements

#### Preload Mode
- **Preload Only**: When enabled, only loads SDK resources without initializing camera
  - Useful for preparing resources in background
  - Reduces initialization time for subsequent scans

### Events

#### On Barcode Detected
- **Action**: Execute when a barcode is successfully detected
- **Parameters**: 
  - `scannedResult` (String): The decoded barcode text

## 📱 Usage Examples

### Example 1: Basic Camera Scanning

```xml
<!-- Basic configuration for camera scanning -->
<BarcodeScanner
    scannedResultAttribute="ScannedCode"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="all"
/>
```

### Example 2: Image Upload Only

```xml
<!-- Configuration for image upload only -->
<BarcodeScanner
    scannedResultAttribute="ScannedCode"
    decodeMode="image"
    widthValue="100"
    heightValue="40"
    language="english"
    barcodeTypes="QR_CODE"
/>
```

### Example 3: Continuous Scanning with Custom License

```xml
<!-- Continuous scanning with custom license -->
<BarcodeScanner
    scannedResultAttribute="ScannedCode"
    scanMode="continuous"
    decodeMode="both"
    widthValue="100"
    heightValue="80"
    language="english"
    barcodeTypes="all"
    licenseKey="YOUR_CUSTOM_LICENSE_KEY"
    onBarcodeDetected="OnBarcodeScanned"
/>
```

### Example 4: Preload Mode for Performance

```xml
<!-- Preload SDK in background -->
<BarcodeScanner
    preloadOnly="true"
    licenseKey="YOUR_LICENSE_KEY"
    engineResourcePath="https://your-cdn.com/dynamsoft/"
/>
```

## 🎯 Use Cases

### Inventory Management
- Scan product barcodes for stock updates
- QR code scanning for asset tracking
- Batch scanning with continuous mode

### Event Management
- QR code ticket scanning
- Attendee check-in systems
- Access control with barcode badges

### Retail Applications
- Point of sale barcode scanning
- Product information lookup
- Price checking systems

### Healthcare
- Patient ID scanning
- Medication barcode verification
- Equipment tracking

## 🔧 Development

### Building from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MendixWidget-BarcodeScanner.git
   cd MendixWidget-BarcodeScanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Project Structure

```
barcodeScanner/
├── src/
│   ├── BarcodeScanner.tsx          # Main widget component
│   ├── BarcodeScanner.xml         # Widget configuration
│   ├── BarcodeScanner.editorConfig.ts  # Editor configuration
│   ├── ui/
│   │   └── BarcodeScanner.css     # Widget styles
│   └── utils/
│       ├── language.ts            # Multi-language support
│       └── sdk.ts                 # Dynamsoft SDK utilities
├── dist/                          # Built widget files
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

### Dependencies

- **dynamsoft-javascript-barcode**: 9.6.42 - Core barcode scanning functionality
- **@mendix/pluggable-widgets-tools**: ^10.15.0 - Mendix widget development tools
- **classnames**: ^2.2.6 - CSS class name utilities

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
- **Check browser permissions**: Ensure camera access is allowed
- **HTTPS required**: Camera access requires secure context
- **Check license**: Verify your Dynamsoft license is valid

#### SDK Loading Errors
- **Network issues**: Check if CDN resources are accessible
- **License conflicts**: Ensure license key is correct
- **Browser compatibility**: Verify browser supports required features

#### Performance Issues
- **Use preload mode**: Initialize SDK in background
- **Host your own files**: Use custom engine resource path
- **Optimize barcode types**: Limit to specific barcode formats

### Debug Mode

Enable debug logging by opening browser console. The widget provides detailed logging for:
- SDK initialization
- License validation
- Camera setup
- Barcode detection
- Error handling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/MendixWidget-BarcodeScanner/issues)
- **Documentation**: [Mendix Documentation](https://docs.mendix.com/)
- **Dynamsoft Support**: [Dynamsoft Documentation](https://www.dynamsoft.com/barcode-reader/docs/)

## 🔄 Version History

### v1.0.0
- Initial release
- Camera scanning support
- Image upload functionality
- Multi-language support
- Responsive design
- Preload mode

## 🙏 Acknowledgments

- [Dynamsoft](https://www.dynamsoft.com/) for providing the excellent barcode scanning SDK
- [Mendix](https://www.mendix.com/) for the platform and widget development tools
- Contributors and users who provide feedback and suggestions
- **兰博基尼织造** for maintaining and supporting this widget

---

**Made with ❤️ by 兰博基尼织造 for the Mendix community**