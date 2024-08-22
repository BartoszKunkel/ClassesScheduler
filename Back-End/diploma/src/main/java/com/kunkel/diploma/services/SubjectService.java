package com.kunkel.diploma.services;

import com.kunkel.diploma.models.entities.SubjectsEntity;

import java.util.List;
import java.util.Optional;

public interface SubjectService {

    SubjectsEntity save(SubjectsEntity subjectsEntity);

    List<SubjectsEntity> findAll();

    Optional<SubjectsEntity> findOne(Long id);

    boolean isExists(Long id);

    SubjectsEntity partialUpdate(Long id, SubjectsEntity subjectsEntity);

    void delete(Long id);
}
