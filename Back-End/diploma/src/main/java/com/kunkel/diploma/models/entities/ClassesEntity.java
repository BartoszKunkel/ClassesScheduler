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
@Table(name = "classes")
public class ClassesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "class_id_seq")
    @SequenceGenerator(name = "class_id_seq", sequenceName = "class_id_seq", allocationSize = 1, initialValue = 0)
    private Long c_id;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "major_id")
    private MajorEntity majorid;
    private String start_time;
    private String end_time;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "s_id")
    private SubjectsEntity subjectid;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "r_id")
    private RoomsEntity roomid;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "t_id")
    private TeacherEntity teacherid;

}
