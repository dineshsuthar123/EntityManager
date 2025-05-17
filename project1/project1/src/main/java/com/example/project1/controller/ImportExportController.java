package com.example.project1.controller;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.project1.dto.MessageResponse;
import com.example.project1.dto.MyEntityDTO;
import com.example.project1.model.MyEntity;
import com.example.project1.service.ExportImportService;
import com.example.project1.service.CsvExportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/data")
@Tag(name = "Import/Export", description = "Import and export entity data")
@SecurityRequirement(name = "bearerAuth")
public class ImportExportController {
      @Autowired
    private ExportImportService exportImportService;
    
    @Autowired
    private CsvExportService csvExportService;
    
    @Operation(summary = "Export entities to Excel", description = "Exports all entities to an Excel file")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Entities exported successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })    @GetMapping("/export/excel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InputStreamResource> exportToExcel() {
        ByteArrayInputStream in = exportImportService.exportToExcel();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=entities.xlsx");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
      @Operation(summary = "Export entities to CSV", description = "Exports all entities to a CSV file")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Entities exported successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })    @GetMapping("/export/csv")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InputStreamResource> exportToCSV() {
        ByteArrayInputStream in = csvExportService.exportToCsv();
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=entities.csv");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }
    
    @Operation(summary = "Import entities from Excel", description = "Imports entities from an Excel file")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Entities imported successfully", 
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid file or data format",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })    @PostMapping("/import/excel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> importFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Please select a file to upload"));
        }
          String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.contains(".")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Invalid file name"));
        }
        
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (!fileExtension.equals("xlsx") && !fileExtension.equals("xls")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Please upload an Excel file (xlsx or xls)"));
        }
          try {
            List<MyEntity> importedEntities = exportImportService.importFromExcel(file);
            return ResponseEntity.ok(new MessageResponse("Imported " + importedEntities.size() + " entities successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to import data: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Import entities from CSV", description = "Imports entities from a CSV file")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Entities imported successfully", 
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid file or data format",
                    content = @Content(mediaType = "application/json", 
                    schema = @Schema(implementation = MessageResponse.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })    @PostMapping("/import/csv")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> importFromCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Please select a file to upload"));
        }
        
        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.contains(".")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Invalid file name"));
        }
        
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (!fileExtension.equals("csv")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Please upload a CSV file"));
        }
        
        try {
            List<MyEntity> importedEntities = csvExportService.importFromCsv(file);
            return ResponseEntity.ok(new MessageResponse("Imported " + importedEntities.size() + " entities successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to import data: " + e.getMessage()));
        }
    }
}
