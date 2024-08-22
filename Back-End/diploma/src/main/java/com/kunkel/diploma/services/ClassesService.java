package com.kunkel.diploma.services;

import com.kunkel.diploma.models.dto.TimeDto;
import com.kunkel.diploma.models.entities.ClassesEntity;

import java.util.List;
import java.util.Optional;

public interface ClassesService {

    ClassesEntity save(TimeDto time);

    List<ClassesEntity> saveP(TimeDto time, Long ammount);

    List<ClassesEntity> findAll();

    Optional<ClassesEntity> findOne(Long id);

    boolean isExists(Long id);

    ClassesEntity update(Long id, TimeDto timeDto);

    ClassesEntity partialUpdate(Long id, TimeDto timeDto);

    void delete(Long id);

    List<ClassesEntity> findAllClassesSortedByMajorId(Long mId);
}
