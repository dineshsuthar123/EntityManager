package com.example.project1.model;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * Represents a custom column for an entity.
 * Enhanced with type support and validation options.
 */
@Embeddable
public class CustomColumn {
    
    @NotBlank(message = "Column name is required")
    @Size(max = 100, message = "Column name must be at most 100 characters")
    private String name;
    
    @Size(max = 2000, message = "Column value must be at most 2000 characters")
    private String value;
    
    private CustomColumnType columnType = CustomColumnType.TEXT;
    
    private boolean required = false;
    
    private String validationPattern;
    
    @Size(max = 100, message = "Error message must be at most 100 characters")
    private String validationErrorMessage;
    
    private String options; // For dropdown type, comma-separated values

    // Constructors
    public CustomColumn() {}
    
    public CustomColumn(String name, String value) {
        this.name = name;
        this.value = value;
    }
    
    public CustomColumn(String name, String value, CustomColumnType columnType) {
        this.name = name;
        this.value = value;
        this.columnType = columnType;
    }
    
    // Getters and setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getValue() {
        return value;
    }
    
    public void setValue(String value) {
        this.value = value;
    }
    
    public CustomColumnType getColumnType() {
        return columnType;
    }
    
    public void setColumnType(CustomColumnType columnType) {
        this.columnType = columnType;
    }
    
    public boolean isRequired() {
        return required;
    }
    
    public void setRequired(boolean required) {
        this.required = required;
    }
    
    public String getValidationPattern() {
        return validationPattern;
    }
    
    public void setValidationPattern(String validationPattern) {
        this.validationPattern = validationPattern;
    }
    
    public String getValidationErrorMessage() {
        return validationErrorMessage;
    }
    
    public void setValidationErrorMessage(String validationErrorMessage) {
        this.validationErrorMessage = validationErrorMessage;
    }
    
    public String getOptions() {
        return options;
    }
    
    public void setOptions(String options) {
        this.options = options;
    }
}
