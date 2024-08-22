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
@Table(name = "rooms")
public class RoomsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rooms_id_seq")
    @SequenceGenerator(name = "rooms_id_seq", sequenceName = "rooms_id_seq", allocationSize = 1, initialValue = 0)
    private Long r_id;
    private String building;
    private int numer;
    private String suffix;
}
