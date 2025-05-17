package com.example.project1.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project1.model.CustomColumn;
import com.example.project1.model.CustomColumnType;
import com.example.project1.model.MyEntity;
import com.example.project1.repository.EntityRepository;

@Service
public class EntityStatisticsService {
    
    @Autowired
    private EntityRepository entityRepository;
    
    /**
     * Counts the total number of entities
     */
    public int countTotalEntities() {
        return (int) entityRepository.count();
    }
    
    /**
     * Counts the number of entities that have at least one custom column
     */
    public int countEntitiesWithCustomColumns() {
        List<MyEntity> entities = entityRepository.findAll();
        return (int) entities.stream()
                .filter(entity -> entity.getCustomColumns() != null && !entity.getCustomColumns().isEmpty())
                .count();
    }
    
    /**
     * Counts the total number of custom columns across all entities
     */
    public int countTotalCustomColumns() {
        List<MyEntity> entities = entityRepository.findAll();
        return entities.stream()
                .filter(entity -> entity.getCustomColumns() != null)
                .mapToInt(entity -> entity.getCustomColumns().size())
                .sum();
    }
    
    /**
     * Finds the most common custom column type
     */
    public String getMostCommonColumnType() {
        List<MyEntity> entities = entityRepository.findAll();
        Map<CustomColumnType, Integer> typeCount = new HashMap<>();
        
        entities.stream()
                .filter(entity -> entity.getCustomColumns() != null)
                .flatMap(entity -> entity.getCustomColumns().stream())
                .forEach(column -> {
                    CustomColumnType type = column.getColumnType();
                    typeCount.put(type, typeCount.getOrDefault(type, 0) + 1);
                });
        
        if (typeCount.isEmpty()) {
            return "None";
        }
        
        return typeCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .get().getKey().toString();
    }
    
    /**
     * Generates a pie chart image of custom column types
     * @return Path to the generated chart image
     */
    public String generateColumnTypePieChart() {
        try {
            List<MyEntity> entities = entityRepository.findAll();
            Map<CustomColumnType, Integer> typeCount = new HashMap<>();
            
            entities.stream()
                    .filter(entity -> entity.getCustomColumns() != null)
                    .flatMap(entity -> entity.getCustomColumns().stream())
                    .forEach(column -> {
                        CustomColumnType type = column.getColumnType();
                        typeCount.put(type, typeCount.getOrDefault(type, 0) + 1);
                    });
              DefaultPieDataset dataset = new DefaultPieDataset();
            typeCount.forEach((type, count) -> dataset.setValue(type.toString(), count));
            
            JFreeChart chart = ChartFactory.createPieChart(
                    "Custom Column Types Distribution",
                    dataset,
                    true,
                    true,
                    false);
              String timestamp = LocalDateTime.now().toString().replace(":", "-").replace(".", "-");
            String fileName = "column_types_" + timestamp + ".png";
            String filePath = System.getProperty("java.io.tmpdir") + File.separator + fileName;
            
            ChartUtils.saveChartAsPNG(new File(filePath), chart, 500, 300);
            
            return filePath;
        } catch (Exception e) {
            throw new RuntimeException("Error generating chart: " + e.getMessage(), e);
        }
    }
    
    /**
     * Prepares the parameters for statistics report
     * @return Map of parameters
     */
    public Map<String, Object> prepareStatisticsReportParameters() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("totalEntities", countTotalEntities());
        parameters.put("entitiesWithCustomColumns", countEntitiesWithCustomColumns());
        parameters.put("totalCustomColumns", countTotalCustomColumns());
        parameters.put("mostCommonColumnType", getMostCommonColumnType());
        parameters.put("reportDate", new java.util.Date());
        parameters.put("chartImagePath", generateColumnTypePieChart());
        
        return parameters;
    }
}
