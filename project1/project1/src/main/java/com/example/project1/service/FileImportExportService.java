package com.example.project1.service;

import com.example.project1.dto.MyEntityDTO;
import com.example.project1.model.CustomColumn;
import com.example.project1.model.CustomColumnType;
import com.example.project1.model.MyEntity;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FileImportExportService {

    private final EntityService entityService;

    @Autowired
    public FileImportExportService(EntityService entityService) {
        this.entityService = entityService;
    }

    /**
     * Export entities to CSV format
     */
    public ByteArrayInputStream exportEntitiesToCSV(List<MyEntityDTO> entities) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (Writer writer = new OutputStreamWriter(out, StandardCharsets.UTF_8)) {
            // Create CSV writer
            StatefulBeanToCsv<MyEntityDTO> csvWriter = new StatefulBeanToCsvBuilder<MyEntityDTO>(writer)
                    .withQuotechar('\"')
                    .withSeparator(',')
                    .build();
            
            try {
                csvWriter.write(entities);
            } catch (CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
                throw new IOException("Failed to export data to CSV file: " + e.getMessage());
            }
        }
        
        return new ByteArrayInputStream(out.toByteArray());
    }

    /**
     * Export entities to Excel format
     */
    public ByteArrayInputStream exportEntitiesToExcel(List<MyEntityDTO> entities) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Entities");
            
            // Header font style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            
            // Header cell style
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            
            // Define headers
            String[] columns = {"ID", "Name", "Description", "Custom Columns"};
            
            // Creating header cells
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }
            
            // Create data rows
            int rowIdx = 1;
            for (MyEntityDTO entity : entities) {
                Row row = sheet.createRow(rowIdx++);
                
                row.createCell(0).setCellValue(entity.getId() != null ? entity.getId() : 0);
                row.createCell(1).setCellValue(entity.getName());
                row.createCell(2).setCellValue(entity.getDescription() != null ? entity.getDescription() : "");
                
                // Format custom columns as JSON string
                String customColumns = entity.getCustomColumns().stream()
                    .map(col -> col.getName() + ":" + col.getValue())
                    .collect(Collectors.joining(", "));
                
                row.createCell(3).setCellValue(customColumns);
            }
            
            // Resize columns to fit content
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    /**
     * Import entities from CSV file
     */
    public List<MyEntity> importEntitiesFromCSV(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            // Configure CSV reader
            HeaderColumnNameMappingStrategy<MyEntityDTO> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(MyEntityDTO.class);
            
            CsvToBean<MyEntityDTO> csvToBean = new CsvToBeanBuilder<MyEntityDTO>(reader)
                    .withType(MyEntityDTO.class)
                    .withMappingStrategy(strategy)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withSeparator(',')
                    .build();
            
            List<MyEntityDTO> dtos = csvToBean.parse();
            List<MyEntity> entities = new ArrayList<>();
            
            // Convert DTOs to entities and save
            for (MyEntityDTO dto : dtos) {
                MyEntity entity = dto.toEntity();
                entities.add(entity);
            }
            
            return entities;
        }
    }

    /**
     * Import entities from Excel file
     */
    public List<MyEntity> importEntitiesFromExcel(MultipartFile file) throws IOException {
        List<MyEntity> entities = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip the header row (row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    MyEntityDTO dto = new MyEntityDTO();
                      // ID column may be empty for new entities
                    Cell idCell = row.getCell(0);
                    if (idCell != null && idCell.getCellType() != org.apache.poi.ss.usermodel.CellType.BLANK) {
                        try {
                            dto.setId((long) idCell.getNumericCellValue());
                        } catch (Exception e) {
                            // Ignore ID if it's not a valid number
                        }
                    }
                    
                    // Name column
                    Cell nameCell = row.getCell(1);
                    if (nameCell != null) {
                        dto.setName(nameCell.getStringCellValue());
                    }
                    
                    // Description column
                    Cell descCell = row.getCell(2);
                    if (descCell != null) {
                        dto.setDescription(descCell.getStringCellValue());
                    }
                    
                    // Custom columns
                    Cell customColsCell = row.getCell(3);
                    if (customColsCell != null) {
                        String customColsStr = customColsCell.getStringCellValue();
                        String[] customColsPairs = customColsStr.split(",");
                        
                        List<CustomColumn> customColumns = Arrays.stream(customColsPairs)
                            .filter(pair -> pair.contains(":"))
                            .map(pair -> {
                                String[] parts = pair.trim().split(":");
                                CustomColumn col = new CustomColumn();
                                col.setName(parts[0].trim());
                                col.setValue(parts.length > 1 ? parts[1].trim() : "");
                                col.setColumnType(CustomColumnType.TEXT); // Default type
                                return col;
                            })
                            .collect(Collectors.toList());
                        
                        dto.getCustomColumns().clear();
                        customColumns.forEach(col -> {
                            com.example.project1.dto.CustomColumnDTO colDto = new com.example.project1.dto.CustomColumnDTO();
                            colDto.setName(col.getName());
                            colDto.setValue(col.getValue());
                            colDto.setColumnType(col.getColumnType());
                            dto.getCustomColumns().add(colDto);
                        });
                    }
                    
                    entities.add(dto.toEntity());
                }
            }
        }
        
        return entities;
    }
    
    /**
     * Save imported entities to the database
     */
    public List<MyEntityDTO> saveImportedEntities(List<MyEntity> entities) {
        List<MyEntityDTO> savedDtos = new ArrayList<>();
        
        for (MyEntity entity : entities) {
            MyEntity saved = entityService.save(entity);
            savedDtos.add(MyEntityDTO.fromEntity(saved));
        }
        
        return savedDtos;
    }
}
