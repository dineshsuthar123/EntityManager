export enum CustomColumnType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    DATE = 'DATE',
    BOOLEAN = 'BOOLEAN',
    EMAIL = 'EMAIL',
    URL = 'URL',
    DROPDOWN = 'DROPDOWN',
    PHONE = 'PHONE',
    CURRENCY = 'CURRENCY',
    MULTILINE_TEXT = 'MULTILINE_TEXT',
    FILE_REFERENCE = 'FILE_REFERENCE'
}

export interface CustomColumn {
    name: string;
    value: string;
    columnType?: CustomColumnType;
    required?: boolean;
    validationPattern?: string;
    validationErrorMessage?: string;
    options?: string; // For dropdown type, comma-separated values
}

export interface User {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles?: string[];
}

export interface MyEntityDTO {
    id?: number;
    name: string;
    description?: string;
    customColumns?: CustomColumn[];
    createdBy?: User;
    lastModifiedBy?: User;
    createdDate?: string;
    lastModifiedDate?: string;
}
