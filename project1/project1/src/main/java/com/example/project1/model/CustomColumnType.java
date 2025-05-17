package com.example.project1.model;

/**
 * Defines the data types available for custom columns.
 * This allows for proper validation and formatting of custom column data.
 */
public enum CustomColumnType {
    TEXT,           // For text input
    NUMBER,         // For numeric values
    DATE,           // For date values
    BOOLEAN,        // For true/false values
    EMAIL,          // For email addresses
    URL,            // For URLs
    DROPDOWN,       // For predefined options
    PHONE,          // For phone numbers
    CURRENCY,       // For monetary values
    MULTILINE_TEXT, // For long text content
    FILE_REFERENCE  // For referencing file uploads
}
