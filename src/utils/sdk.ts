import { BarcodeScanner as DynamsoftBarcodeScanner } from "dynamsoft-javascript-barcode";

// Global SDK state management to prevent multiple initializations
declare global {
    interface Window {
        dynamsoftSDKState?: {
            initialized: boolean;
            license: string;
            loading: boolean;
            wasmLoaded: boolean;
        };
    }
}

// Initialize global SDK state if not exists
if (!window.dynamsoftSDKState) {
    window.dynamsoftSDKState = {
        initialized: false,
        license: "",
        loading: false,
        wasmLoaded: false
    };
}

// Preload SDK files for faster loading
export const preloadSDKFiles = () => {
    try {
        // Use CDN for preloading - no need to preload local files
        console.log("SDK will be loaded from CDN - no preloading needed");
    } catch (err) {
        console.warn("Could not preload SDK files:", err);
    }
};

// Helper function to check if Dynamsoft SDK is already loaded
export const isDynamsoftSDKLoaded = async (): Promise<boolean> => {
    try {
        // Check if license is set and loadWasm function exists
        if (DynamsoftBarcodeScanner.license && typeof DynamsoftBarcodeScanner.loadWasm === "function") {
            // Try to create a test instance to verify WASM is loaded
            try {
                const testInstance = await DynamsoftBarcodeScanner.createInstance();
                await testInstance.close();
                return true;
            } catch (testErr) {
                return false;
            }
        }
        return false;
    } catch (err) {
        return false;
    }
};

// Helper function to check if license is already set
export const isLicenseAlreadySet = (): boolean => {
    try {
        // Check if DynamsoftBarcodeScanner.license is already set
        if (DynamsoftBarcodeScanner.license) {
            return true;
        }

        // Check if Dynamsoft.DBR.BarcodeReader.license is already set
        if (
            typeof (window as any).Dynamsoft !== "undefined" &&
            (window as any).Dynamsoft.DBR &&
            (window as any).Dynamsoft.DBR.BarcodeReader
        ) {
            const dbrLicense = (window as any).Dynamsoft.DBR.BarcodeReader.license;
            if (dbrLicense) {
                return true;
            }
        }

        return false;
    } catch (err) {
        console.warn("Could not check license:", err);
        return false;
    }
};

// Helper function to check if WASM is already loaded
export const isWasmAlreadyLoaded = (): boolean => {
    try {
        return DynamsoftBarcodeScanner.isWasmLoaded();
    } catch (err) {
        return false;
    }
};

// Initialize SDK with proper configuration
export const initializeSDK = async (licenseKey: string, engineResourcePath: string): Promise<void> => {
    const currentLicense = licenseKey || "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9";
    // Use provided CDN path or default UNPKG CDN
    const resourcePath = engineResourcePath || "https://unpkg.com/dynamsoft-javascript-barcode@9.6.42/dist/";

    console.log("=== SDK Initialization Debug ===");
    console.log("Current license:", currentLicense);
    console.log("Engine resource path:", resourcePath);
    console.log("DynamsoftBarcodeScanner.license:", DynamsoftBarcodeScanner.license);
    console.log("License already set:", isLicenseAlreadySet());

    // Check if SDK is already initialized globally with the same license
    if (window.dynamsoftSDKState!.initialized && window.dynamsoftSDKState!.license === currentLicense) {
        console.log("SDK already initialized globally with same license, skipping...");
        return;
    }

    // Check if Dynamsoft SDK is already loaded at the library level
    const isSDKAlreadyLoaded = await isDynamsoftSDKLoaded();
    if (isSDKAlreadyLoaded && DynamsoftBarcodeScanner.license === currentLicense) {
        console.log("Dynamsoft SDK already loaded with same license, skipping initialization...");
        window.dynamsoftSDKState!.initialized = true;
        window.dynamsoftSDKState!.license = currentLicense;
        window.dynamsoftSDKState!.loading = false;
        window.dynamsoftSDKState!.wasmLoaded = true;
        return;
    }

    // If SDK is initialized globally but license changed, we need to reload
    if (window.dynamsoftSDKState!.initialized && window.dynamsoftSDKState!.license !== currentLicense) {
        console.log("License changed, need to reload page...");
        throw new Error("License changed. Please reload the page to apply the new license.");
    }

    // If SDK is currently loading, wait for it
    if (window.dynamsoftSDKState!.loading) {
        console.log("SDK is currently loading, waiting...");
        // Poll until loading is complete
        return new Promise((resolve, reject) => {
            const checkLoading = setInterval(() => {
                if (!window.dynamsoftSDKState!.loading) {
                    clearInterval(checkLoading);
                    if (window.dynamsoftSDKState!.initialized) {
                        resolve();
                    } else {
                        reject(new Error("SDK loading failed"));
                    }
                }
            }, 100);
        });
    }

    const startTime = performance.now();
    console.log("Initializing Dynamsoft SDK with CDN...");
    console.log("Current hostname:", window.location.hostname);
    console.log("Current port:", window.location.port);
    console.log("Current protocol:", window.location.protocol);
    window.dynamsoftSDKState!.loading = true;

    // Only set license if no license is already set
    if (!isLicenseAlreadySet()) {
        console.log("Setting license:", currentLicense);
        DynamsoftBarcodeScanner.license = currentLicense;
    } else {
        console.log("License already exists, skipping license assignment");
    }

    // Configure SDK to use configurable engine resource path
    // Default is CDN, but developers can specify their own hosted files (e.g., AWS)
    DynamsoftBarcodeScanner.engineResourcePath = resourcePath;
    console.log("Using configurable engine resource path:", DynamsoftBarcodeScanner.engineResourcePath);
    console.log("Environment detection:", {
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol
    });

    // Check if WASM is already loaded before calling loadWasm
    const wasmAlreadyLoaded = isWasmAlreadyLoaded();
    if (!wasmAlreadyLoaded) {
        console.log("Loading WASM...");
        await DynamsoftBarcodeScanner.loadWasm();
    } else {
        console.log("WASM already loaded, skipping loadWasm call");
    }

    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`SDK loaded successfully in ${loadTime.toFixed(2)}ms`);
    window.dynamsoftSDKState!.initialized = true;
    window.dynamsoftSDKState!.license = currentLicense;
    window.dynamsoftSDKState!.loading = false;
    window.dynamsoftSDKState!.wasmLoaded = true;
};
