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
@Table(name = "major")
public class MajorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "major_id_seq")
    @SequenceGenerator(name = "major_id_seq", sequenceName = "major_id_seq", allocationSize = 1, initialValue = 0)
    private Long major_id;
    private String name;
    private String study_year;
    private String specialization;
    private String practice_group;
    private String lab_group;
    private int study_mode;
    private int lvl_degree;



}
