export interface LanguageTexts {
    loadingSDK: string;
    preparingCamera: string;
    pointCamera: string;
    cameraReady: string;
    uploadImage: string;
    decoding: string;
    processingImage: string;
    uploadInstruction: string;
    noBarcodeFound: string;
    selectImageFile: string;
    sdkNotLoaded: string;
}

export const languageTexts: Record<string, LanguageTexts> = {
    english: {
        loadingSDK: 'Loading SDK...',
        preparingCamera: 'Preparing camera...',
        pointCamera: 'Point camera at barcode to scan',
        cameraReady: 'Camera ready',
        uploadImage: 'Upload Image',
        decoding: 'Decoding...',
        processingImage: 'Processing image...',
        uploadInstruction: 'Click to upload an image containing a barcode',
        noBarcodeFound: 'No barcode found in the uploaded image',
        selectImageFile: 'Please select an image file',
        sdkNotLoaded: 'SDK not loaded yet. Please wait...'
    },
    chinese: {
        loadingSDK: '正在加载SDK...',
        preparingCamera: '正在准备摄像头...',
        pointCamera: '将摄像头对准条形码进行扫描',
        cameraReady: '摄像头已就绪',
        uploadImage: '上传图片',
        decoding: '正在解码...',
        processingImage: '正在处理图片...',
        uploadInstruction: '点击上传包含条形码的图片',
        noBarcodeFound: '在上传的图片中未找到条形码',
        selectImageFile: '请选择图片文件',
        sdkNotLoaded: 'SDK尚未加载，请稍候...'
    }
};

export const getText = (language: string, key: keyof LanguageTexts): string => {
    return languageTexts[language]?.[key] || languageTexts.english[key];
};
