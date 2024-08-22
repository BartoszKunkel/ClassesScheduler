package com.kunkel.diploma.services;

import com.kunkel.diploma.models.entities.RoomsEntity;

import java.util.List;
import java.util.Optional;

public interface RoomsService {
    RoomsEntity save(RoomsEntity roomsEntity);

    List<RoomsEntity> findAll();

    Optional<RoomsEntity> findOne(Long id);

    boolean isExists(Long id);

    RoomsEntity partialUpdate(Long id, RoomsEntity roomsEntity);


    void delete(Long id);

    List<Long> findAvaibleRooms(String startTime, String endTime);

    List<Long> findAvaibleRoomsFromManyDates(String startTime, String endTime);
}
