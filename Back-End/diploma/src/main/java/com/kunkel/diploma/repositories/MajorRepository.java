package com.kunkel.diploma.repositories;

import com.kunkel.diploma.models.entities.MajorEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorRepository extends CrudRepository<MajorEntity, Long> {
}
