package com.example.project1.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project1.dto.MyEntityDTO;
import com.example.project1.model.MyEntity;
import com.example.project1.service.EntityService;

@RestController
@RequestMapping("/api/entities")
@Validated
public class MyEntityRestController {
    @Autowired
    private EntityService entityService;

    @GetMapping
    public List<MyEntityDTO> getAll() {
        return entityService.findAll().stream()
                .map(MyEntityDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MyEntityDTO> getById(@PathVariable Long id) {
        Optional<MyEntity> entity = entityService.findById(id);
        return entity.map(value -> ResponseEntity.ok(MyEntityDTO.fromEntity(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MyEntityDTO> create(@Valid @RequestBody MyEntityDTO dto) {
        MyEntity saved = entityService.save(dto.toEntity());
        return new ResponseEntity<>(MyEntityDTO.fromEntity(saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MyEntityDTO> update(@PathVariable Long id, @Valid @RequestBody MyEntityDTO dto) {
        Optional<MyEntity> existing = entityService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        MyEntity entity = dto.toEntity();
        entity.setId(id);
        MyEntity updated = entityService.save(entity);
        return ResponseEntity.ok(MyEntityDTO.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (entityService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        entityService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
