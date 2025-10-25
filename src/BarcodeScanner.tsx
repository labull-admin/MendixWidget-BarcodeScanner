import { ReactElement, createElement, useRef, useEffect, useState } from "react";
import { BarcodeScannerContainerProps } from "../typings/BarcodeScannerProps";
import "./ui/BarcodeScanner.css";
import { BarcodeScanner as DynamsoftBarcodeScanner } from "dynamsoft-javascript-barcode";
import { preloadSDKFiles, initializeSDK } from "./utils/sdk";
import { getText } from "./utils/language";

// Start preloading immediately
preloadSDKFiles();

export function BarcodeScanner({ 
    content, 
    scannedResultAttribute,
    licenseKey,
    engineResourcePath,
    preloadOnly,
    onBarcodeDetected,
    scanMode,
    decodeMode,
    widthUnit,
    widthValue,
    heightUnit,
    heightValue,
    barcodeTypes,
    language
}: BarcodeScannerContainerProps): ReactElement {
    
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isDecodingImage, setIsDecodingImage] = useState(false);
    const [scanCompleted, setScanCompleted] = useState(false);
    
    // Track SDK initialization state globally
    const sdkInitializedRef = useRef(false);
    const currentLicenseRef = useRef<string>("");
    const scannerInstanceRef = useRef<any>(null);

    // Derived values from enumeration properties
    const continuousScan = scanMode === 'continuous';
    const enableImageDecode = decodeMode === 'image' || decodeMode === 'both';
    const enableCamera = decodeMode === 'scan' || decodeMode === 'both';

    // Debug logging for preload mode
    console.log('🔍 BarcodeScanner Component - preloadOnly:', preloadOnly);
    console.log('🔍 BarcodeScanner Component - scanMode:', scanMode);
    console.log('🔍 BarcodeScanner Component - decodeMode:', decodeMode);
    console.log('🔍 BarcodeScanner Component - scanCompleted:', scanCompleted);
    console.log('🔍 BarcodeScanner Component - continuousScan:', continuousScan);
    console.log('🔍 BarcodeScanner Component - enableCamera:', enableCamera);

    // Function to manually reload the SDK
    const reloadSDK = async () => {
        console.log('Manually reloading SDK...');
        
        // Reset global state
        window.dynamsoftSDKState!.initialized = false;
        window.dynamsoftSDKState!.license = "";
        window.dynamsoftSDKState!.loading = false;
        window.dynamsoftSDKState!.wasmLoaded = false;
        
        // Reset local state
        sdkInitializedRef.current = false;
        currentLicenseRef.current = "";
        setIsSDKLoaded(false);
        setError("");
        
        try {
            // Clear any existing instances
            if (typeof DynamsoftBarcodeScanner !== 'undefined') {
                try {
                    // Try to get instances using the correct method
                    const instances = (DynamsoftBarcodeScanner as any).getAllInstances?.() || [];
                    for (const instance of instances) {
                        await instance.close();
                    }
                } catch (err) {
                    console.warn('Could not close existing instances:', err);
                }
            }
            
            // Force reload the page to clear SDK state completely
            window.location.reload();
        } catch (err) {
            console.error('Error reloading SDK:', err);
            setError('Failed to reload SDK. Please refresh the page manually.');
        }
    };


    // Dimension calculation - height percentage can be direct or aspect ratio based
    const getDimensions = () => {
        const widthStyle: React.CSSProperties = {};
        const heightStyle: React.CSSProperties = {};
        let className = 'video-container dce-video-container';

        // Calculate width
        if (widthUnit === 'percentage' && widthValue !== null && widthValue !== undefined) {
            widthStyle.width = `${widthValue}%`;
        } else if (widthUnit === 'pixels' && widthValue !== null && widthValue !== undefined) {
            widthStyle.width = `${widthValue}px`;
        }

        // Calculate height - percentage can exceed 100% and be direct percentage
        if (heightUnit === 'percentage' && heightValue !== null && heightValue !== undefined) {
            // Direct percentage - no aspect ratio calculation
            heightStyle.height = `${heightValue}%`;
        } else if (heightUnit === 'pixels' && heightValue !== null && heightValue !== undefined) {
            heightStyle.height = `${heightValue}px`;
        }

        // Add square-container class if both width and height are 100%
        if (widthUnit === 'percentage' && heightUnit === 'percentage' && 
            widthValue === 100 && heightValue === 100) {
            className += ' square-container';
        }

        // Debug logging
        console.log('BarcodeScanner dimensions:', {
            widthUnit,
            widthValue,
            heightUnit,
            heightValue,
            widthStyle,
            heightStyle,
            className
        });

        return { widthStyle, heightStyle, className };
    };

    // Initialize SDK
    useEffect(() => {
        const initializeSDKWrapper = async () => {
            try {
                const licenseKeyValue = licenseKey?.value || 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9';
                const engineResourcePathValue = engineResourcePath?.value || 'https://unpkg.com/dynamsoft-javascript-barcode@9.6.42/dist/';
                
                console.log('🔍 Debug - preloadOnly value:', preloadOnly);
                console.log('🔍 Debug - licenseKeyValue:', licenseKeyValue);
                console.log('🔍 Debug - engineResourcePathValue:', engineResourcePathValue);
                
                if (preloadOnly) {
                    console.log('🔄 Starting Barcode Scanner SDK preload...');
                    console.log('📋 Preload configuration:');
                    console.log('  - License Key:', licenseKeyValue ? 'Configured' : 'Using default');
                    console.log('  - Engine Resource Path:', engineResourcePathValue);
                }
                
                await initializeSDK(licenseKeyValue, engineResourcePathValue);
                sdkInitializedRef.current = true;
                currentLicenseRef.current = licenseKeyValue;
                setIsSDKLoaded(true);
                
                if (preloadOnly) {
                    console.log('✅ Barcode Scanner SDK preloaded successfully');
                    console.log('📋 License Key:', licenseKeyValue ? 'Configured' : 'Using default');
                    console.log('🌐 Engine Resource Path:', engineResourcePathValue);
                    console.log('🚀 SDK resources are ready for use in other widgets');
                    console.log('🎯 Preload mode completed - widget is ready for background use');
                } else {
                    console.log('📱 Normal mode - SDK initialized for active scanning');
                }
            } catch (err: any) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("SDK configuration error details:", {
                    error: err,
                    message: errorMessage,
                    stack: err?.stack,
                    hostname: window.location.hostname,
                    port: window.location.port,
                    protocol: window.location.protocol
                });
                setError(`Failed to configure Dynamsoft SDK: ${errorMessage}`);
            }
        };

        initializeSDKWrapper();
    }, [licenseKey?.value, engineResourcePath?.value, preloadOnly]);

    // Initialize Scanner
    useEffect(() => {
        let scannerInstance: any = null;

        const initializeScanner = async () => {
            if (!isSDKLoaded || !enableCamera || !videoContainerRef.current || preloadOnly) {
                return;
            }

            console.log('Starting scanner initialization...');
            setIsInitializing(true);
            setError("");

            try {
                scannerInstance = await DynamsoftBarcodeScanner.createInstance();
                scannerInstanceRef.current = scannerInstance;
                
                // Configure barcode types if specified
                if (barcodeTypes && barcodeTypes !== 'all') {
                    const runtimeSettings = await scannerInstance.getRuntimeSettings();
                    let formatIds = 0;
                    if (barcodeTypes === 'QR_CODE') {
                        formatIds = 0x4000000;
                    } else if (barcodeTypes === 'CODE_128') {
                        formatIds = 0x1;
                    } else if (barcodeTypes === 'CODE_39') {
                        formatIds = 0x2;
                    } else if (barcodeTypes === 'EAN_13') {
                        formatIds = 0x4;
                    } else if (barcodeTypes === 'EAN_8') {
                        formatIds = 0x8;
                    } else if (barcodeTypes === 'UPC_A') {
                        formatIds = 0x10;
                    } else if (barcodeTypes === 'UPC_E') {
                        formatIds = 0x20;
                    } else if (barcodeTypes === 'PDF_417') {
                        formatIds = 0x2000000;
                    } else if (barcodeTypes === 'DATA_MATRIX') {
                        formatIds = 0x8000000;
                    } else if (barcodeTypes === 'AZTEC') {
                        formatIds = 0x10000000;
                    }
                    runtimeSettings.barcodeFormatIds = formatIds;
                    await scannerInstance.updateRuntimeSettings(runtimeSettings);
                }
                
                // Set up event handlers
                scannerInstance.onUniqueRead = async (txt: string, _result: any) => {
                    if (scannedResultAttribute) {
                        scannedResultAttribute.setValue(txt);
                    }
                    
                    if (onBarcodeDetected && onBarcodeDetected.canExecute) {
                        onBarcodeDetected.execute({ scannedResult: txt });
                    }
                    
                    // Handle scan completion based on continuous scan setting
                    if (!continuousScan) {
                        // Single scan mode - stop scanning after successful scan
                        console.log('Barcode scanned successfully, stopping camera (single scan mode)');
                        
                        try {
                            // Close the camera immediately
                            await scannerInstance.close();
                            console.log('Camera closed after successful scan');
                        } catch (err) {
                            console.warn('Error closing camera after scan:', err);
                        }
                        
                        setIsScanning(false);
                        setScanCompleted(true);
                    } else {
                        // Continuous scan mode - keep scanning
                        console.log('Barcode scanned successfully, continuing to scan (continuous mode)');
                    }
                };
                
                // Set up UI element
                if (videoContainerRef.current) {
                    await scannerInstance.setUIElement(videoContainerRef.current);
                    await scannerInstance.open();
                    console.log('Scanner opened successfully');
                    setIsScanning(true);
                }
                
            } catch (err: any) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Failed to initialize barcode scanner: ${errorMessage}`);
                console.error("Barcode scanner initialization error:", err);
            } finally {
                setIsInitializing(false);
            }
        };

        if (isSDKLoaded && enableCamera && !preloadOnly && !scanCompleted) {
            initializeScanner();
        }

        // Cleanup function
        return () => {
            if (scannerInstance) {
                try {
                    scannerInstance.close();
                    console.log('Scanner closed');
                } catch (err) {
                    console.warn('Error closing scanner:', err);
                }
            }
            setIsScanning(false);
        };
    }, [isSDKLoaded, barcodeTypes, enableCamera, scannedResultAttribute, onBarcodeDetected, preloadOnly, scanCompleted, continuousScan]);

    // Function to decode barcode from uploaded image
    const decodeImageBarcode = async (file: File) => {
        if (!isSDKLoaded) {
            setError(getText(language, 'sdkNotLoaded'));
            return;
        }

        setIsDecodingImage(true);
        setError("");

        try {
            // Create a reader instance for image decoding
            const reader = await DynamsoftBarcodeScanner.createInstance();
            
            // Configure barcode types if specified
            if (barcodeTypes && barcodeTypes !== 'all') {
                const runtimeSettings = await reader.getRuntimeSettings();
                let formatIds = 0;
                if (barcodeTypes === 'QR_CODE') {
                    formatIds = 0x4000000;
                } else if (barcodeTypes === 'CODE_128') {
                    formatIds = 0x1;
                } else if (barcodeTypes === 'CODE_39') {
                    formatIds = 0x2;
                } else if (barcodeTypes === 'EAN_13') {
                    formatIds = 0x4;
                } else if (barcodeTypes === 'EAN_8') {
                    formatIds = 0x8;
                } else if (barcodeTypes === 'UPC_A') {
                    formatIds = 0x10;
                } else if (barcodeTypes === 'UPC_E') {
                    formatIds = 0x20;
                } else if (barcodeTypes === 'PDF_417') {
                    formatIds = 0x2000000;
                } else if (barcodeTypes === 'DATA_MATRIX') {
                    formatIds = 0x8000000;
                } else if (barcodeTypes === 'AZTEC') {
                    formatIds = 0x10000000;
                }
                runtimeSettings.barcodeFormatIds = formatIds;
                await reader.updateRuntimeSettings(runtimeSettings);
            }

            // Decode the image
            const results = await reader.decode(file);
            
            if (results && results.length > 0) {
                const decodedText = results[0].barcodeText;
                
                // Update the attribute if provided
                if (scannedResultAttribute) {
                    scannedResultAttribute.setValue(decodedText);
                }
                
                // Call the onBarcodeDetected callback with the scanned result
                if (onBarcodeDetected && onBarcodeDetected.canExecute) {
                    onBarcodeDetected.execute({ scannedResult: decodedText });
                }
            } else {
                setError(getText(language, 'noBarcodeFound'));
            }
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Failed to decode image: ${errorMessage}`);
            console.error("Image decode error:", err);
        } finally {
            setIsDecodingImage(false);
        }
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setError(getText(language, 'selectImageFile'));
                return;
            }
            decodeImageBarcode(file);
        }
    };

    // Handle upload button click
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Function to restart scanning
    const restartScanning = async () => {
        if (scannerInstanceRef.current && videoContainerRef.current) {
            try {
                console.log('Restarting scanner...');
                
                // Reset states first
                setScanCompleted(false);
                setIsScanning(false);
                setError("");
                
                // Wait a moment for state updates
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Reopen the scanner
                await scannerInstanceRef.current.open();
                setIsScanning(true);
                console.log('Scanner restarted successfully');
            } catch (err) {
                console.error('Error restarting scanner:', err);
                setError('Failed to restart scanner');
                setIsScanning(false);
            }
        } else {
            console.error('Cannot restart scanner - missing instance or container');
            setError('Cannot restart scanner - missing components');
        }
    };

    const dimensions = getDimensions();

    return (
        <div className="barcode-reader">
            <div>{content}</div>
            
            {preloadOnly ? (
                <div className="preload-section">
                    {/* Preload mode - no visible UI, only console logging */}
                </div>
            ) : (
                (enableCamera || enableImageDecode) && (
                    <div className="scanner-section">
                        {enableCamera && (
                            <div className="camera-container" style={{ position: 'relative' }}>
                                <div 
                                    ref={videoContainerRef}
                                    className={dimensions.className}
                                    style={{
                                        ...dimensions.widthStyle,
                                        ...dimensions.heightStyle,
                                        position: 'relative'
                                    }}
                                >
                                    {isInitializing && (
                                        <div className="loading-overlay">
                                            <div className="loading-text">{getText(language, 'preparingCamera')}</div>
                                        </div>
                                    )}
                                    
                                    {scanCompleted && !continuousScan && (
                                        <div className="scan-completed-overlay" style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                            zIndex: 1000,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <button 
                                                onClick={restartScanning}
                                                className="start-again-button"
                                                style={{
                                                    padding: '12px 24px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    color: '#333',
                                                    border: '2px solid rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    fontWeight: '500',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: '120px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                                }}
                                            >
                                                {language === 'chinese' ? '重新扫描' : 'Start Again'}
                                            </button>
                                        </div>
                                    )}
                                    
                                    {!isScanning && !isInitializing && !scanCompleted && (
                                        <div className="camera-placeholder">
                                            <div className="placeholder-text">{getText(language, 'cameraReady')}</div>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="scan-info">
                                    {!isSDKLoaded ? getText(language, 'loadingSDK') :
                                     isInitializing ? getText(language, 'preparingCamera') : 
                                     isScanning ? (continuousScan ? (language === 'chinese' ? '连续扫描中... 将摄像头对准条形码' : 'Scanning continuously... Point camera at barcode') : getText(language, 'pointCamera')) : 
                                     scanCompleted && !continuousScan ? (language === 'chinese' ? '扫描完成！点击"重新扫描"扫描另一个条形码。' : 'Scan completed! Click "Start Again" to scan another barcode.') :
                                     error ? `Error: ${error}` :
                                     getText(language, 'cameraReady')}
                                </p>
                            </div>
                        )}

                        {enableImageDecode && (
                            <div className="image-decode-container">
                                <div className="upload-section">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        onClick={handleUploadClick}
                                        disabled={isDecodingImage || !isSDKLoaded}
                                        className="upload-button"
                                    >
                                        {isDecodingImage ? getText(language, 'decoding') : getText(language, 'uploadImage')}
                                    </button>
                                    <p className="upload-info">
                                        {isDecodingImage ? getText(language, 'processingImage') : 
                                         !isSDKLoaded ? getText(language, 'loadingSDK') : 
                                         getText(language, 'uploadInstruction')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}

            {error && (
                <div className="error-section">
                    <div className="error-message">{error}</div>
                    {error.includes('license is not allowed to change') && (
                        <button 
                            onClick={reloadSDK}
                            className="reload-button"
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Reload SDK
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}