package com.example.project1.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Entity for tracking changes to records (audit trail).
 */
@Entity
@Table(name = "entity_revisions")
public class EntityRevision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private Long entityId;
    
    @ManyToOne
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    private RevisionType revisionType;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String previousState;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String newState;
    
    private String changeDescription;
    
    // Enum for revision types
    public enum RevisionType {
        CREATE, 
        UPDATE, 
        DELETE
    }
    
    // Constructors
    public EntityRevision() {}
    
    public EntityRevision(String entityType, Long entityId, User user, RevisionType revisionType,
            String previousState, String newState, String changeDescription) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.user = user;
        this.timestamp = LocalDateTime.now();
        this.revisionType = revisionType;
        this.previousState = previousState;
        this.newState = newState;
        this.changeDescription = changeDescription;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public RevisionType getRevisionType() {
        return revisionType;
    }

    public void setRevisionType(RevisionType revisionType) {
        this.revisionType = revisionType;
    }

    public String getPreviousState() {
        return previousState;
    }

    public void setPreviousState(String previousState) {
        this.previousState = previousState;
    }

    public String getNewState() {
        return newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
    }

    public String getChangeDescription() {
        return changeDescription;
    }

    public void setChangeDescription(String changeDescription) {
        this.changeDescription = changeDescription;
    }
}
