# Barcode Scanner Widget - Usage Examples

This document provides comprehensive examples of how to use the Mendix Barcode Scanner Widget in various scenarios.

## Table of Contents
1. [Basic Setup](#basic-setup)
2. [Camera Scanning Examples](#camera-scanning-examples)
3. [Image Upload Examples](#image-upload-examples)
4. [Advanced Configuration](#advanced-configuration)
5. [Real-World Use Cases](#real-world-use-cases)
6. [Troubleshooting Examples](#troubleshooting-examples)

## Basic Setup

### 1. Simple Camera Scanner
```xml
<!-- Basic camera scanner with default settings -->
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

### 2. Image Upload Scanner
```xml
<!-- Image upload scanner for processing uploaded images -->
<BarcodeScanner
    scannedResultAttribute="ScannedCode"
    decodeMode="image"
    widthValue="100"
    heightValue="40"
    language="english"
    barcodeTypes="QR_CODE"
/>
```

## Camera Scanning Examples

### Example 1: Inventory Management
```xml
<!-- Continuous scanning for inventory updates -->
<BarcodeScanner
    scannedResultAttribute="ProductCode"
    scanMode="continuous"
    decodeMode="scan"
    widthValue="100"
    heightValue="70"
    language="english"
    barcodeTypes="CODE_128"
    onBarcodeDetected="UpdateInventory"
/>
```

**Microflow: UpdateInventory**
- Input: `scannedResult` (String)
- Actions:
  1. Find Product by Code
  2. Update Stock Quantity
  3. Log Scan Event
  4. Show Success Message

### Example 2: Event Check-in
```xml
<!-- QR code scanning for event attendees -->
<BarcodeScanner
    scannedResultAttribute="TicketCode"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="80"
    language="english"
    barcodeTypes="QR_CODE"
    onBarcodeDetected="ProcessCheckIn"
/>
```

**Microflow: ProcessCheckIn**
- Input: `scannedResult` (String)
- Actions:
  1. Find Attendee by Ticket Code
  2. Check if Already Checked In
  3. Update Check-in Status
  4. Send Confirmation Email

### Example 3: Mobile-First Design
```xml
<!-- Optimized for mobile devices -->
<BarcodeScanner
    scannedResultAttribute="ScannedValue"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="100"
    language="english"
    barcodeTypes="all"
/>
```

## Image Upload Examples

### Example 1: Batch Processing
```xml
<!-- Process multiple images containing barcodes -->
<BarcodeScanner
    scannedResultAttribute="BatchCode"
    decodeMode="image"
    widthValue="100"
    heightValue="50"
    language="english"
    barcodeTypes="all"
    onBarcodeDetected="ProcessBatchItem"
/>
```

### Example 2: Document Processing
```xml
<!-- Scan barcodes from documents -->
<BarcodeScanner
    scannedResultAttribute="DocumentCode"
    decodeMode="image"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="PDF_417"
    onBarcodeDetected="ProcessDocument"
/>
```

## Advanced Configuration

### Example 1: Custom License and CDN
```xml
<!-- Using custom Dynamsoft license and CDN -->
<BarcodeScanner
    scannedResultAttribute="ScannedCode"
    scanMode="continuous"
    decodeMode="both"
    widthValue="100"
    heightValue="80"
    language="english"
    barcodeTypes="all"
    licenseKey="YOUR_CUSTOM_LICENSE_KEY"
    engineResourcePath="https://your-cdn.com/dynamsoft/"
    onBarcodeDetected="HandleScan"
/>
```

### Example 2: Preload Mode for Performance
```xml
<!-- Preload SDK in background for faster subsequent scans -->
<BarcodeScanner
    preloadOnly="true"
    licenseKey="YOUR_LICENSE_KEY"
    engineResourcePath="https://unpkg.com/dynamsoft-javascript-barcode@9.6.42/dist/"
/>
```

### Example 3: Chinese Language Support
```xml
<!-- Chinese language interface -->
<BarcodeScanner
    scannedResultAttribute="扫描结果"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="60"
    language="chinese"
    barcodeTypes="QR_CODE"
    onBarcodeDetected="处理扫描结果"
/>
```

## Real-World Use Cases

### Use Case 1: Retail Point of Sale
**Scenario**: Cashier scanning product barcodes at checkout

**Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="ProductBarcode"
    scanMode="continuous"
    decodeMode="scan"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="CODE_128"
    onBarcodeDetected="AddToCart"
/>
```

**Microflow: AddToCart**
- Find Product by Barcode
- Add to Shopping Cart
- Update Total Price
- Play Success Sound

### Use Case 2: Warehouse Management
**Scenario**: Warehouse worker scanning items for inventory

**Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="ItemCode"
    scanMode="continuous"
    decodeMode="both"
    widthValue="100"
    heightValue="70"
    language="english"
    barcodeTypes="all"
    onBarcodeDetected="UpdateInventory"
/>
```

### Use Case 3: Healthcare Patient ID
**Scenario**: Nurse scanning patient wristbands

**Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="PatientID"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="80"
    language="english"
    barcodeTypes="QR_CODE"
    onBarcodeDetected="LoadPatientRecord"
/>
```

### Use Case 4: Asset Tracking
**Scenario**: IT department tracking equipment

**Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="AssetTag"
    scanMode="single"
    decodeMode="both"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="DATA_MATRIX"
    onBarcodeDetected="TrackAsset"
/>
```

## Troubleshooting Examples

### Issue 1: Camera Not Working
**Problem**: Camera doesn't start or shows error
**Solutions**:
1. Check browser permissions
2. Ensure HTTPS is used
3. Verify license key is valid
4. Check browser compatibility

**Debug Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="DebugResult"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="all"
    licenseKey="DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9"
    engineResourcePath="https://unpkg.com/dynamsoft-javascript-barcode@9.6.42/dist/"
/>
```

### Issue 2: Performance Issues
**Problem**: Slow loading or scanning
**Solutions**:
1. Use preload mode
2. Host your own CDN files
3. Limit barcode types
4. Optimize image quality

**Optimized Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="OptimizedResult"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="60"
    language="english"
    barcodeTypes="QR_CODE"
    licenseKey="YOUR_LICENSE_KEY"
    engineResourcePath="https://your-fast-cdn.com/dynamsoft/"
/>
```

### Issue 3: Mobile Compatibility
**Problem**: Widget doesn't work well on mobile
**Solutions**:
1. Use responsive sizing
2. Enable touch-friendly interface
3. Test on actual devices
4. Consider mobile-specific barcode types

**Mobile-Optimized Configuration**:
```xml
<BarcodeScanner
    scannedResultAttribute="MobileResult"
    scanMode="single"
    decodeMode="scan"
    widthValue="100"
    heightValue="100"
    language="english"
    barcodeTypes="QR_CODE"
/>
```

## Best Practices

### 1. Error Handling
Always implement proper error handling in your microflows:
- Check if scanned result is empty
- Validate barcode format
- Handle network errors
- Provide user feedback

### 2. Performance Optimization
- Use preload mode for better UX
- Limit barcode types when possible
- Host your own CDN files
- Implement proper cleanup

### 3. User Experience
- Provide clear instructions
- Show loading states
- Give immediate feedback
- Handle edge cases gracefully

### 4. Security Considerations
- Validate scanned data
- Sanitize input
- Use HTTPS in production
- Implement proper access controls

## Integration Examples

### With Mendix Data Grid
```xml
<!-- Scan barcode and add to data grid -->
<DataGrid>
    <BarcodeScanner
        scannedResultAttribute="NewItemCode"
        scanMode="single"
        decodeMode="scan"
        onBarcodeDetected="AddToGrid"
    />
</DataGrid>
```

### With Form Validation
```xml
<!-- Scan barcode and validate against database -->
<Form>
    <BarcodeScanner
        scannedResultAttribute="ValidationCode"
        scanMode="single"
        decodeMode="scan"
        onBarcodeDetected="ValidateCode"
    />
</Form>
```

### With List Operations
```xml
<!-- Scan multiple items and add to list -->
<List>
    <BarcodeScanner
        scannedResultAttribute="ListItemCode"
        scanMode="continuous"
        decodeMode="scan"
        onBarcodeDetected="AddToList"
    />
</List>
```

---

**Note**: These examples are provided by 兰博基尼织造 for educational purposes. Always test thoroughly in your specific environment and adjust configurations as needed.

