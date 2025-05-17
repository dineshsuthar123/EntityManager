package com.example.project1.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.project1.model.MyEntity;
import com.example.project1.repository.EntityRepository;

@Service
public class EntityService {

    private final EntityRepository entityRepository;

    @Autowired
    public EntityService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    public List<MyEntity> findAll() {
        return entityRepository.findAll();
    }

    public Optional<MyEntity> findById(Long id) {
        return entityRepository.findById(id);
    }

    public MyEntity save(MyEntity entity) {
        return entityRepository.save(entity);
    }

    public void deleteById(Long id) {
        entityRepository.deleteById(id);
    }
}