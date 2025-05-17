package com.example.project1.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.opencsv.exceptions.CsvValidationException;

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

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

import com.example.project1.dto.MyEntityDTO;
import com.example.project1.model.CustomColumn;
import com.example.project1.model.CustomColumnType;
import com.example.project1.model.MyEntity;
import com.example.project1.repository.EntityRepository;

@Service
public class ExportImportService {
    
    @Autowired
    private EntityRepository entityRepository;
    
    private static String SHEET_NAME = "MyEntities";
    private static String[] HEADERS = { "ID", "Name", "Description" };
    
    public ByteArrayInputStream exportToExcel() {
        try (Workbook workbook = new XSSFWorkbook(); 
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet(SHEET_NAME);
            
            // Header style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            
            // Creating header row
            Row headerRow = sheet.createRow(0);
            
            // Standard headers
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
                cell.setCellStyle(headerCellStyle);
            }
            
            // Collect all unique custom column names
            List<String> customColumnNames = new ArrayList<>();
            List<MyEntity> entities = entityRepository.findAll();
            for (MyEntity entity : entities) {
                for (CustomColumn col : entity.getCustomColumns()) {
                    if (!customColumnNames.contains(col.getName())) {
                        customColumnNames.add(col.getName());
                    }
                }
            }
            
            // Add custom column headers
            int colIndex = HEADERS.length;
            for (String colName : customColumnNames) {
                Cell cell = headerRow.createCell(colIndex++);
                cell.setCellValue(colName);
                cell.setCellStyle(headerCellStyle);
            }
            
            // Data
            int rowIdx = 1;
            for (MyEntity entity : entities) {
                Row row = sheet.createRow(rowIdx++);
                
                row.createCell(0).setCellValue(entity.getId());
                row.createCell(1).setCellValue(entity.getName());
                row.createCell(2).setCellValue(entity.getDescription() != null ? entity.getDescription() : "");
                
                // Add custom column values
                for (int i = 0; i < customColumnNames.size(); i++) {
                    String colName = customColumnNames.get(i);
                    Cell cell = row.createCell(i + HEADERS.length);
                    
                    // Find the custom column with this name if it exists for this entity
                    String value = entity.getCustomColumns().stream()
                            .filter(c -> colName.equals(c.getName()))
                            .findFirst()
                            .map(CustomColumn::getValue)
                            .orElse("");
                    cell.setCellValue(value);
                }
            }
            
            // Resize columns to fit content
            for (int i = 0; i < HEADERS.length + customColumnNames.size(); i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to Excel file: " + e.getMessage());
        }
    }
      /**
     * Export entities to CSV format
     */
    public ByteArrayInputStream exportToCSV() {
        List<MyEntity> entities = entityRepository.findAll();
        List<String> customColumnNames = new ArrayList<>();
        
        // Collect all unique custom column names
        for (MyEntity entity : entities) {
            for (CustomColumn col : entity.getCustomColumns()) {
                if (!customColumnNames.contains(col.getName())) {
                    customColumnNames.add(col.getName());
                }
            }
        }
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVWriter csvWriter = new CSVWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8))) {
            
            // Create headers
            List<String> headerList = new ArrayList<>(Arrays.asList(HEADERS));
            headerList.addAll(customColumnNames);
            String[] headers = headerList.toArray(new String[0]);
            csvWriter.writeNext(headers);
            
            // Write data rows
            for (MyEntity entity : entities) {
                List<String> rowData = new ArrayList<>();
                rowData.add(entity.getId().toString());
                rowData.add(entity.getName());
                rowData.add(entity.getDescription() != null ? entity.getDescription() : "");
                
                // Add custom column values
                for (String colName : customColumnNames) {
                    String value = entity.getCustomColumns().stream()
                            .filter(c -> colName.equals(c.getName()))
                            .findFirst()
                            .map(CustomColumn::getValue)
                            .orElse("");
                    rowData.add(value);
                }
                
                csvWriter.writeNext(rowData.toArray(new String[0]));
            }
            
            csvWriter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to CSV file: " + e.getMessage());
        }
    }
      /**
     * Import entities from CSV file
     * @throws com.opencsv.exceptions.CsvValidationException if CSV validation fails
     */
    public List<MyEntity> importFromCSV(MultipartFile file) throws com.opencsv.exceptions.CsvValidationException {
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            List<MyEntity> entities = new ArrayList<>();
            
            // Read header
            String[] headers = reader.readNext();
            if (headers == null) {
                throw new IOException("CSV file is empty or contains no header");
            }
            
            // Map column indices
            Map<Integer, String> columnMappings = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                columnMappings.put(i, headers[i]);
            }
            
            // Read data rows
            String[] line;
            while ((line = reader.readNext()) != null) {
                MyEntity entity = new MyEntity();
                
                // Process each column based on header
                for (int i = 0; i < line.length; i++) {
                    String columnName = columnMappings.get(i);
                    String value = line[i];
                    
                    if (columnName.equals("ID") && !value.isEmpty()) {
                        try {
                            entity.setId(Long.parseLong(value));
                        } catch (NumberFormatException e) {
                            // Ignore invalid ID
                        }
                    } else if (columnName.equals("Name")) {
                        entity.setName(value);
                    } else if (columnName.equals("Description")) {
                        entity.setDescription(value);
                    } else {
                        // Handle as custom column
                        if (!value.isEmpty()) {
                            CustomColumn customCol = new CustomColumn(columnName, value, CustomColumnType.TEXT);
                            entity.getCustomColumns().add(customCol);
                        }
                    }
                }
                
                entities.add(entity);
            }              // Save all entities
            return entityRepository.saveAll(entities);
        } catch (Exception e) {
            throw new RuntimeException("Failed to import CSV data: " + e.getMessage(), e);
        }
    }
    
    public List<MyEntity> importFromExcel(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<MyEntity> entities = new ArrayList<>();
            
            // Get header row to identify columns
            Row headerRow = sheet.getRow(0);
            int numColumns = headerRow.getLastCellNum();
            
            // Map column indices to column names
            List<String> columnNames = new ArrayList<>();
            for (int i = 0; i < numColumns; i++) {
                Cell cell = headerRow.getCell(i);
                columnNames.add(cell.getStringCellValue());
            }
            
            // Process data rows
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                MyEntity entity = new MyEntity();
                  // Process standard columns
                int idColIndex = columnNames.indexOf("ID");
                if (idColIndex >= 0 && row.getCell(idColIndex) != null) {
                    Cell idCell = row.getCell(idColIndex);
                    if (idCell.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                        entity.setId((long) idCell.getNumericCellValue());
                    }
                }
                
                int nameColIndex = columnNames.indexOf("Name");
                if (nameColIndex >= 0 && row.getCell(nameColIndex) != null) {
                    entity.setName(row.getCell(nameColIndex).getStringCellValue());
                }
                
                int descColIndex = columnNames.indexOf("Description");
                if (descColIndex >= 0 && row.getCell(descColIndex) != null) {
                    entity.setDescription(row.getCell(descColIndex).getStringCellValue());
                }
                
                // Process custom columns
                for (int j = HEADERS.length; j < columnNames.size(); j++) {
                    String colName = columnNames.get(j);
                    Cell cell = row.getCell(j);
                      if (cell != null) {
                        String value = "";
                        org.apache.poi.ss.usermodel.CellType cellType = cell.getCellType();
                        if (cellType == org.apache.poi.ss.usermodel.CellType.STRING) {
                            value = cell.getStringCellValue();
                        } else if (cellType == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                            value = String.valueOf(cell.getNumericCellValue());
                        } else if (cellType == org.apache.poi.ss.usermodel.CellType.BOOLEAN) {
                            value = String.valueOf(cell.getBooleanCellValue());
                        }
                        
                        if (!value.isEmpty()) {
                            CustomColumn customCol = new CustomColumn(colName, value, CustomColumnType.TEXT);
                            entity.getCustomColumns().add(customCol);
                        }
                    }
                }
                
                entities.add(entity);
            }
            
            // Save all entities
            return entityRepository.saveAll(entities);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to import data: " + e.getMessage());
        }
    }
}
