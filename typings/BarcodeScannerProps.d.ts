/**
 * This file was generated from BarcodeScanner.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export type ScanModeEnum = "single" | "continuous";

export type DecodeModeEnum = "scan" | "image" | "both";

export type WidthUnitEnum = "pixels" | "percentage";

export type HeightUnitEnum = "pixels" | "percentage";

export type BarcodeTypesEnum = "all" | "QR_CODE" | "CODE_128" | "CODE_39" | "EAN_13" | "EAN_8" | "UPC_A" | "UPC_E" | "PDF_417" | "DATA_MATRIX" | "AZTEC";

export interface BarcodeScannerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    content?: ReactNode;
    scannedResultAttribute?: EditableValue<string>;
    scanMode: ScanModeEnum;
    decodeMode: DecodeModeEnum;
    widthUnit: WidthUnitEnum;
    widthValue: number;
    heightUnit: HeightUnitEnum;
    heightValue: number;
    barcodeTypes: BarcodeTypesEnum;
    textPreparingCamera?: DynamicValue<string>;
    textPointCamera?: DynamicValue<string>;
    textCameraReady?: DynamicValue<string>;
    textScanningContinuous?: DynamicValue<string>;
    textScanCompleted?: DynamicValue<string>;
    textStartAgain?: DynamicValue<string>;
    textLoadingSDK?: DynamicValue<string>;
    textUploadImage?: DynamicValue<string>;
    textDecoding?: DynamicValue<string>;
    textProcessingImage?: DynamicValue<string>;
    textUploadInstruction?: DynamicValue<string>;
    preloadOnly: boolean;
    licenseKey: DynamicValue<string>;
    engineResourcePath: DynamicValue<string>;
    onBarcodeDetected?: ActionValue;
}

export interface BarcodeScannerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    scannedResultAttribute: string;
    scanMode: ScanModeEnum;
    decodeMode: DecodeModeEnum;
    widthUnit: WidthUnitEnum;
    widthValue: number | null;
    heightUnit: HeightUnitEnum;
    heightValue: number | null;
    barcodeTypes: BarcodeTypesEnum;
    textPreparingCamera: string;
    textPointCamera: string;
    textCameraReady: string;
    textScanningContinuous: string;
    textScanCompleted: string;
    textStartAgain: string;
    textLoadingSDK: string;
    textUploadImage: string;
    textDecoding: string;
    textProcessingImage: string;
    textUploadInstruction: string;
    preloadOnly: boolean;
    licenseKey: string;
    engineResourcePath: string;
    onBarcodeDetected: {} | null;
}
