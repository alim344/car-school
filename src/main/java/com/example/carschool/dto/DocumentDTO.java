package com.example.carschool.dto;

import com.example.carschool.model.DocumentType;
import com.example.carschool.model.InstructorDocuments;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class DocumentDTO {

    private Long id;


    private DocumentType documentType;

    private LocalDate expiryDate;

    private Long inst_id;

    public DocumentDTO() {}

    public DocumentDTO(InstructorDocuments instructorDocuments) {
        this.id = instructorDocuments.getId();
        this.documentType = instructorDocuments.getDocumentType();
        this.expiryDate = instructorDocuments.getExpiryDate();
        this.inst_id = instructorDocuments.getInstructor().getId();

    }
}
