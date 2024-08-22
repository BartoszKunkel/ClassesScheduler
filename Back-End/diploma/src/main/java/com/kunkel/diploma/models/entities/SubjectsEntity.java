package com.kunkel.diploma.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "subjects")
public class SubjectsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subjects_id_seq")
    @SequenceGenerator(name = "subjects_id_seq", sequenceName = "subjects_id_seq", allocationSize = 1, initialValue = 0)
    private Long s_id;
    private String name;

}
