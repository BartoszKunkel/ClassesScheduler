package com.kunkel.diploma.repositories;

import com.kunkel.diploma.models.entities.SubjectsEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectsRepository extends CrudRepository<SubjectsEntity, Long> {
}
