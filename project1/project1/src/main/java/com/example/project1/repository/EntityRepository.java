package com.example.project1.repository;

import com.example.project1.model.MyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntityRepository extends JpaRepository<MyEntity, Long> {
    // Additional query methods can be defined here
}