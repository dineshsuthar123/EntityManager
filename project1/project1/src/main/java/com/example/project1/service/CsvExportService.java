package com.example.project1.service;

import com.example.project1.model.CustomColumn;
import com.example.project1.model.CustomColumnType;
import com.example.project1.model.MyEntity;
import com.example.project1.repository.EntityRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

@Service
public class CsvExportService {

    private final EntityRepository entityRepository;

    @Autowired
    public CsvExportService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    private static final String[] HEADERS = { "ID", "Name", "Description" };

    /**
     * Export entities to CSV format
     */
    public ByteArrayInputStream exportToCsv() {
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
     */
    public List<MyEntity> importFromCsv(MultipartFile file) {
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
                            CustomColumn customCol = new CustomColumn();
                            customCol.setName(columnName);
                            customCol.setValue(value);
                            customCol.setColumnType(CustomColumnType.TEXT);
                            entity.getCustomColumns().add(customCol);
                        }
                    }
                }
                
                entities.add(entity);
            }
            
            // Save all entities
            return entityRepository.saveAll(entities);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to import CSV data: " + e.getMessage());
        }
    }
}
