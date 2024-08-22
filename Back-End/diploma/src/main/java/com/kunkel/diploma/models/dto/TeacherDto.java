package com.kunkel.diploma.models.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeacherDto {
    private Long t_id;
    private String name;
    private String surname;
    private String a_degree;

}
