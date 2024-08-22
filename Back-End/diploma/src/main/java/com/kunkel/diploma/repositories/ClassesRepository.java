package com.kunkel.diploma.repositories;

import com.kunkel.diploma.models.entities.ClassesEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassesRepository extends CrudRepository<ClassesEntity, Long> {
}
