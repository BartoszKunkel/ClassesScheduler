package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.models.entities.TeacherEntity;
import com.kunkel.diploma.repositories.TeacherRepository;
import com.kunkel.diploma.services.TeacherService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class TeacherServiceImpl implements TeacherService {
        TeacherRepository teacherRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Override
    public TeacherEntity save(TeacherEntity teacher) {
        return teacherRepository.save(teacher);
    }

    @Override
    public List<TeacherEntity> findAll() {
        return StreamSupport.stream(teacherRepository
                .findAll()
                .spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TeacherEntity> findOne(Long id) {
        return teacherRepository.findById(id);
    }

    @Override
    public boolean isExists(Long id) {
        return teacherRepository.existsById(id);
    }

    @Override
    public TeacherEntity partialUpdate(Long id, TeacherEntity teacherEntity) {
        teacherEntity.setT_id(id);
        return teacherRepository.findById(id).map(existingTeacher -> {
            Optional.ofNullable(teacherEntity.getName()).ifPresent(existingTeacher::setName);
            Optional.ofNullable(teacherEntity.getA_degree()).ifPresent(existingTeacher::setA_degree);
            Optional.ofNullable(teacherEntity.getSurname()).ifPresent(existingTeacher::setSurname);

            return teacherRepository.save(existingTeacher);
        }).orElseThrow(() -> new RuntimeException("Teacher does not exist"));
    }

    @Override
    public void delete(Long id) {
        teacherRepository.deleteById(id);
    }
}
