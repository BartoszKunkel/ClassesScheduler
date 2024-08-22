package com.kunkel.diploma.services;

import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.entities.MajorEntity;
import com.kunkel.diploma.models.entities.RoomsEntity;

import java.util.List;
import java.util.Optional;

public interface MajorService {

    MajorEntity save(MajorEntity majorEntity);

    List<MajorEntity> findAll();

    Optional<MajorEntity> findOne(Long id);

    boolean isExists(Long id);

    MajorEntity partialUpdate(Long id, MajorEntity majorEntity);

    void delete(Long id);

    List<MajorEntity> filter(MajorDto majorFilter, int group);
}
