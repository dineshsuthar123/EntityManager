package com.example.project1.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project1.model.MyEntity;
import com.example.project1.repository.EntityRepository;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.xml.JRXmlLoader;

@Service
public class ReportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    
    @Autowired
    private EntityRepository entityRepository;
    
    /**
     * Generates a PDF report of all entities
     * @return ByteArrayInputStream containing the PDF report
     */
    public ByteArrayInputStream generateEntityReport() {
        try {
            List<MyEntity> entities = entityRepository.findAll();
            
            // Load the JRXML template
            JasperDesign jasperDesign = JRXmlLoader.load(getClass().getResourceAsStream("/reports/entities_report.jrxml"));
            
            // Compile the report template
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
            
            // Create data source
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(entities);
            
            // Add parameters
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("createdBy", "System Administrator");
            
            // Fill the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            
            // Export to PDF
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(jasperPrint, outStream);
              return new ByteArrayInputStream(outStream.toByteArray());
        } catch (JRException e) {
            logger.error("Error generating report: ", e);
            throw new RuntimeException("Error generating report", e);
        }
    }
      /**
     * Generates a custom report based on specific criteria
     * @param reportName The name of the report template
     * @param parameters Parameters for the report
     * @return ByteArrayInputStream containing the PDF report
     */
    public ByteArrayInputStream generateCustomReport(String reportName, Map<String, Object> parameters) {
        try {
            // Load the custom JRXML template
            JasperDesign jasperDesign = JRXmlLoader.load(getClass().getResourceAsStream("/reports/" + reportName + ".jrxml"));
            
            // Compile the report template
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
            
            // Create data source - this could be customized based on reportName
            List<MyEntity> data = entityRepository.findAll();
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
            
            // Fill the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            
            // Export to PDF
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(jasperPrint, outStream);
            
            return new ByteArrayInputStream(outStream.toByteArray());
        } catch (JRException e) {
            logger.error("Error generating custom report: ", e);
            throw new RuntimeException("Error generating custom report", e);
        }
    }
    
    /**
     * Generates a report for entities within a date range
     * @param startDate The start date
     * @param endDate The end date
     * @return ByteArrayInputStream containing the PDF report
     */
    public ByteArrayInputStream generateDateRangeReport(Date startDate, Date endDate) {
        try {
            // Convert java.util.Date to LocalDateTime
            LocalDateTime start = convertToLocalDateTime(startDate);
            LocalDateTime end = convertToLocalDateTime(endDate);
            
            // Filter entities by date range
            List<MyEntity> filteredEntities = entityRepository.findAll().stream()
                .filter(entity -> {
                    LocalDateTime createdDate = entity.getCreatedDate();
                    return createdDate != null && 
                           (createdDate.isEqual(start) || createdDate.isAfter(start)) && 
                           (createdDate.isEqual(end) || createdDate.isBefore(end));
                })
                .collect(Collectors.toList());
            
            // Load the report template
            JasperDesign jasperDesign = JRXmlLoader.load(getClass().getResourceAsStream("/reports/entities_report.jrxml"));
            
            // Compile the report template
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
            
            // Create data source
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(filteredEntities);
            
            // Add parameters
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("startDate", startDate);
            parameters.put("endDate", endDate);
            parameters.put("entityCount", filteredEntities.size());
            
            // Fill the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            
            // Export to PDF
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(jasperPrint, outStream);
              return new ByteArrayInputStream(outStream.toByteArray());
        } catch (JRException e) {
            logger.error("Error generating date range report: ", e);
            throw new RuntimeException("Error generating date range report", e);
        }
    }
    
    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
    }
}
