package com.example.project1.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.example.project1.model.CustomColumn;
import com.example.project1.model.MyEntity;

public class MyEntityDTO {
    private Long id;    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;
    
    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;
    
    private List<CustomColumnDTO> customColumns = new ArrayList<>();

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<CustomColumnDTO> getCustomColumns() { return customColumns; }
    public void setCustomColumns(List<CustomColumnDTO> customColumns) { this.customColumns = customColumns; }    // Conversion methods
    public static MyEntityDTO fromEntity(MyEntity entity) {
        MyEntityDTO dto = new MyEntityDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        
        // Convert custom columns
        if (entity.getCustomColumns() != null) {
            List<CustomColumnDTO> columnDTOs = entity.getCustomColumns().stream()
                .map(col -> {
                    CustomColumnDTO colDTO = new CustomColumnDTO();
                    colDTO.setName(col.getName());
                    colDTO.setValue(col.getValue());
                    colDTO.setColumnType(col.getColumnType());
                    colDTO.setRequired(col.isRequired());
                    colDTO.setValidationPattern(col.getValidationPattern());
                    colDTO.setValidationErrorMessage(col.getValidationErrorMessage());
                    colDTO.setOptions(col.getOptions());
                    return colDTO;
                })
                .collect(Collectors.toList());
            dto.setCustomColumns(columnDTOs);
        }
        
        return dto;
    }
    
    public MyEntity toEntity() {
        MyEntity entity = new MyEntity();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setDescription(this.description);
        
        // Convert custom columns
        if (this.customColumns != null) {
            List<CustomColumn> columns = this.customColumns.stream()
                .map(colDTO -> {
                    CustomColumn col = new CustomColumn();
                    col.setName(colDTO.getName());
                    col.setValue(colDTO.getValue());
                    return col;
                })
                .collect(Collectors.toList());
            entity.setCustomColumns(columns);
        }
        
        return entity;
    }
}
