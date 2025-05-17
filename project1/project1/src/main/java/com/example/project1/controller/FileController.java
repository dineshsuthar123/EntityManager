package com.example.project1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.project1.dto.MessageResponse;
import com.example.project1.dto.UploadFileResponse;
import com.example.project1.service.FileStorageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Management", description = "Upload, download, and manage files")
@SecurityRequirement(name = "bearerAuth")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Operation(summary = "Upload a file", description = "Upload a single file and return file details")
    @ApiResponse(responseCode = "200", description = "File uploaded successfully")
    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(fileName)
                .toUriString();

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @Operation(summary = "Upload multiple files", description = "Upload multiple files and return details for each")
    @ApiResponse(responseCode = "200", description = "Files uploaded successfully")
    @PostMapping("/uploadMultiple")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file))
                .collect(Collectors.toList());
    }

    @Operation(summary = "Download a file", description = "Download a file by its filename")
    @ApiResponse(responseCode = "200", description = "File downloaded successfully")
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Default to octet-stream
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    
    @Operation(summary = "Delete a file", description = "Delete a file by its filename")
    @ApiResponse(responseCode = "200", description = "File deleted successfully", 
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)))
    @DeleteMapping("/delete/{fileName:.+}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteFile(@PathVariable String fileName) {
        boolean deleted = fileStorageService.deleteFile(fileName);
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("File deleted successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("File not found"));
        }
    }
}
