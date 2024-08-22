package com.kunkel.diploma.repositories;

import com.kunkel.diploma.models.entities.RoomsEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomsRepository extends CrudRepository<RoomsEntity, Long> {
}
