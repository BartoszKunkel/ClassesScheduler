package com.kunkel.diploma.repositories;

import com.kunkel.diploma.models.entities.TeacherEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends CrudRepository<TeacherEntity, Long> {
}
