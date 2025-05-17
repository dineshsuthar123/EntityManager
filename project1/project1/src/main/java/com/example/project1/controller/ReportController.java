package com.example.project1.controller;

import java.io.ByteArrayInputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.project1.service.ReportService;
import com.example.project1.service.EntityStatisticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Generate various reports")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @Autowired
    private EntityStatisticsService statisticsService;
      @Operation(summary = "Generate entity report", description = "Generates a PDF report of all entities")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @GetMapping("/entities")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> generateEntityReport() {
        ByteArrayInputStream bis = reportService.generateEntityReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=entities_report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
      @Operation(summary = "Generate custom columns report", description = "Generates a PDF report of entities with their custom columns")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @GetMapping("/custom-columns")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> generateCustomColumnsReport(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String generatedBy) {
        
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("reportTitle", title != null ? title : "Entities with Custom Columns");
        parameters.put("generatedBy", generatedBy);
        
        ByteArrayInputStream bis = reportService.generateCustomReport("custom_columns_report", parameters);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=custom_columns_report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
      @Operation(summary = "Generate statistics report", description = "Generates a PDF report with entity statistics")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> generateStatisticsReport() {
        // Get statistics data
        Map<String, Object> parameters = statisticsService.prepareStatisticsReportParameters();
        
        // Generate report
        ByteArrayInputStream bis = reportService.generateCustomReport("entity_statistics_report", parameters);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=entity_statistics_report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
    
    @Operation(summary = "Generate date range report", description = "Generates a PDF report of entities created within a date range")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> generateDateRangeReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("startDate", startDate);
        parameters.put("endDate", endDate);
        parameters.put("reportTitle", "Entities by Date Range Report");
        
        ByteArrayInputStream bis = reportService.generateDateRangeReport(startDate, endDate);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=date_range_report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
    
    @Operation(summary = "Generate custom report", description = "Generates a custom PDF report based on template name")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @GetMapping("/custom/{reportName}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> generateCustomReport(
            @PathVariable String reportName,
            @RequestParam(required = false) Map<String, String> queryParams) {
        
        // Convert query parameters to report parameters
        Map<String, Object> reportParams = new HashMap<>();
        queryParams.forEach((key, value) -> reportParams.put(key, value));
        
        ByteArrayInputStream bis = reportService.generateCustomReport(reportName, reportParams);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + reportName + "_report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
