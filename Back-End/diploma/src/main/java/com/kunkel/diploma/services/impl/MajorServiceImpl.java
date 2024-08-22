package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.entities.MajorEntity;
import com.kunkel.diploma.repositories.MajorRepository;
import com.kunkel.diploma.services.MajorService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class MajorServiceImpl implements MajorService {

    MajorRepository majorRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public MajorServiceImpl(MajorRepository majorRepository) {
        this.majorRepository = majorRepository;
    }

    @Override
    public MajorEntity save(MajorEntity majorEntity) {
        return majorRepository.save(majorEntity);
    }

    @Override
    public List<MajorEntity> findAll() {
       return StreamSupport.stream(majorRepository.findAll().spliterator(), false).collect(Collectors.toList());
    }

    @Override
    public Optional<MajorEntity> findOne(Long id) {
        return majorRepository.findById(id);
    }

    @Override
    public boolean isExists(Long id) {
        return majorRepository.existsById(id);
    }

    @Override
    public MajorEntity partialUpdate(Long id, MajorEntity majorEntity) {
        majorEntity.setMajor_id(id);
        return majorRepository.findById(id).map(existingMajor -> {
            Optional.ofNullable(majorEntity.getLab_group()).ifPresent(existingMajor::setLab_group);
            Optional.ofNullable(majorEntity.getPractice_group()).ifPresent(existingMajor::setPractice_group);
            Optional.ofNullable(majorEntity.getName()).ifPresent(existingMajor::setName);
            if(majorEntity.getLvl_degree() != 0)Optional.of(majorEntity.getLvl_degree()).ifPresent(existingMajor::setLvl_degree);
            if(majorEntity.getStudy_mode() != 0)Optional.of(majorEntity.getStudy_mode()).ifPresent(existingMajor::setStudy_mode);
            Optional.ofNullable(majorEntity.getStudy_year()).ifPresent(existingMajor::setStudy_year);
            Optional.ofNullable(majorEntity.getSpecialization()).ifPresent(existingMajor::setSpecialization);

            return majorRepository.save(existingMajor);
        }).orElseThrow(() -> new RuntimeException("Major does not exist"));
    }

    @Override
    public void delete(Long id) {
        majorRepository.deleteById(id);
    }

    @Override
    public List<MajorEntity> filter(MajorDto majorFilter, int group) {

        String hql = "From MajorEntity major WHERE 1=1";

        if(majorFilter.getStudy_mode() != -1){
            hql += " AND major.study_mode = :studyMode";
        }

        if (majorFilter.getLvl_degree() != -1) {
            hql += " AND major.lvl_degree = :lvlDegree";
        }

        if (majorFilter.getName() != null) {
            hql += " AND major.name = :name";
        }
        if (majorFilter.getSpecialization() != null) {
            hql += " AND major.specialization = :specialization";
        }
        if (majorFilter.getStudy_year() != null) {
            hql += " AND major.study_year = :studyYear";
        }
        if(group == 0 && majorFilter.getPractice_group() != null) {
            hql += " AND major.practice_group = :practiceGroup";
        }
        else if (group == 1 && majorFilter.getLab_group() != null){
            hql += " AND major.lab_group = :labGroup";
        }

        Query query = entityManager.createQuery(hql, MajorEntity.class);

        if (majorFilter.getStudy_mode() != -1) {
            query.setParameter("studyMode", majorFilter.getStudy_mode());
        }
        if (majorFilter.getLvl_degree() != -1) {
            query.setParameter("lvlDegree", majorFilter.getLvl_degree());
        }
        if (majorFilter.getName() != null) {
            query.setParameter("name", majorFilter.getName());
        }
        if (majorFilter.getSpecialization() != null) {
            query.setParameter("specialization", majorFilter.getSpecialization());
        }
        if (majorFilter.getStudy_year() != null) {
            query.setParameter("studyYear", majorFilter.getStudy_year());
        }
        if(group == 0 && majorFilter.getPractice_group() != null) {
            query.setParameter("practiceGroup", majorFilter.getPractice_group());
        } else if (group == 1 && majorFilter.getLab_group() != null){
            query.setParameter("labGroup", majorFilter.getLab_group());
        }


        return query.getResultList();
    }
}
