package com.kunkel.diploma.services;

import com.kunkel.diploma.models.entities.TeacherEntity;

import java.util.List;
import java.util.Optional;

public interface TeacherService {

    TeacherEntity save(TeacherEntity teacher);

    List<TeacherEntity> findAll();

    Optional<TeacherEntity> findOne(Long id);

    boolean isExists(Long id);

    TeacherEntity partialUpdate(Long id, TeacherEntity teacherEntity);

    void delete(Long id);
}
