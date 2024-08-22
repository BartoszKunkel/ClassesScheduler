package com.kunkel.diploma.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomsDto {
    private Long r_id;
    private String building;
    private int numer;

    private String suffix;
}
