import { BarcodeScannerPreviewProps } from "../typings/BarcodeScannerProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    values: BarcodeScannerPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    // If preloadOnly is enabled, hide all properties except license key and engine resource path
    if (values.preloadOnly) {
        return defaultProperties.map(group => {
            if (group.caption === "General") {
                // Hide General group completely when in preload mode
                return {
                    ...group,
                    properties: []
                };
            } else if (group.caption === "Barcode Reader") {
                // Hide Barcode Reader group completely when in preload mode
                return {
                    ...group,
                    properties: []
                };
            } else if (group.caption === "Advanced") {
                // Keep only preloadOnly, licenseKey, and engineResourcePath in Advanced group
                return {
                    ...group,
                    properties: group.properties?.filter(prop => 
                        prop.key === "preloadOnly" || 
                        prop.key === "licenseKey" || 
                        prop.key === "engineResourcePath"
                    )
                };
            } else if (group.caption === "Events") {
                // Hide Events group completely when in preload mode
                return {
                    ...group,
                    properties: []
                };
            }
            return group;
        }).filter(group => {
            // Remove empty groups
            return group.properties && group.properties.length > 0;
        });
    }
    
    return defaultProperties;
}

export function check(values: BarcodeScannerPreviewProps): Problem[] {
    const errors: Problem[] = [];
    
    // Validate width value based on unit
    if (values.widthUnit === "percentage" && values.widthValue !== null && (values.widthValue < 1 || values.widthValue > 100)) {
        errors.push({
            property: "widthValue",
            message: "Width value must be between 1 and 100 when using percentage unit.",
            severity: "error"
        });
    }
    
    if (values.widthUnit === "pixels" && values.widthValue !== null && values.widthValue < 1) {
        errors.push({
            property: "widthValue", 
            message: "Width value must be at least 1 when using pixels unit.",
            severity: "error"
        });
    }
    
    // Validate height value based on unit
    if (values.heightUnit === "percentage" && values.heightValue !== null && values.heightValue < 1) {
        errors.push({
            property: "heightValue",
            message: "Height value must be at least 1 when using percentage unit. Height percentage can exceed 100%.",
            severity: "error"
        });
    }
    
    if (values.heightUnit === "pixels" && values.heightValue !== null && values.heightValue < 1) {
        errors.push({
            property: "heightValue",
            message: "Height value must be at least 1 when using pixels unit.",
            severity: "error"
        });
    }
    
    return errors;
}

// export function getPreview(values: BarcodeScannerPreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: BarcodeScannerPreviewProps, platform: Platform): string {
//     return "BarcodeScanner";
// }
