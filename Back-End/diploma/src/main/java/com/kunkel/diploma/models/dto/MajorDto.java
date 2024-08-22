package com.kunkel.diploma.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MajorDto {
    private Long major_id;
    private String name;
    private String study_year;

    private String specialization;
    private String practice_group;
    private String lab_group;
    private int study_mode;
    private int lvl_degree;

    @Override
    public String toString(){
        return this.major_id + " --- " + this.name + " --- " + this.study_year + " --- " + this.specialization + " --- " + this.practice_group + " --- " + this.lab_group + " --- " + this.study_mode + " --- " + this.lvl_degree;
    }
}
