package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.models.entities.SubjectsEntity;
import com.kunkel.diploma.repositories.SubjectsRepository;
import com.kunkel.diploma.services.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
public class SubjectServiceImpl implements SubjectService {

    SubjectsRepository subjectsRepository;

    public SubjectServiceImpl(SubjectsRepository subjectsRepository) {
        this.subjectsRepository = subjectsRepository;
    }

    @Override
    public SubjectsEntity save(SubjectsEntity subjectsEntity) {
        return subjectsRepository.save(subjectsEntity);
    }

    @Override
    public List<SubjectsEntity> findAll() {
        return StreamSupport.stream(subjectsRepository
                        .findAll()
                        .spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SubjectsEntity> findOne(Long id) {
        return subjectsRepository.findById(id);
    }

    @Override
    public boolean isExists(Long id) {
        return subjectsRepository.existsById(id);
    }

    @Override
    public SubjectsEntity partialUpdate(Long id, SubjectsEntity subjectsEntity) {
        subjectsEntity.setS_id(id);
        return subjectsRepository.findById(id).map(existingRoom -> {
            Optional.ofNullable(subjectsEntity.getName()).ifPresent(existingRoom::setName);
            return subjectsRepository.save(existingRoom);
        }).orElseThrow(() -> new RuntimeException("Subject does not exist"));
    }

    @Override
    public void delete(Long id) {
        subjectsRepository.deleteById(id);
    }
}
