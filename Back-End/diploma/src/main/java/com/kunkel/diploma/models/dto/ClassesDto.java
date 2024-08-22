package com.kunkel.diploma.models.dto;

import com.kunkel.diploma.models.entities.MajorEntity;
import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.models.entities.SubjectsEntity;
import com.kunkel.diploma.models.entities.TeacherEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClassesDto {
    private Long c_id;

    private MajorDto majorid;
    private String start_time;
    private String end_time;

    private SubjectsDto subjectid;

    private RoomsDto roomid;

    private TeacherDto teacherid;
    @Override
    public String toString(){
        return this.majorid + " --- " + this.start_time + " --- " + this.end_time + " --- " + this.subjectid + " --- " + this.roomid + " --- " + this.teacherid;
    }
}
