package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.repositories.RoomsRepository;
import com.kunkel.diploma.services.RoomsService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class RoomsServiceImpl implements RoomsService {

    private RoomsRepository roomsRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public RoomsServiceImpl(RoomsRepository roomsRepository) {
        this.roomsRepository = roomsRepository;
    }

    @Override
    public RoomsEntity save(RoomsEntity roomsEntity) {
       return roomsRepository.save(roomsEntity);
    }

    @Override
    public List<RoomsEntity> findAll() {
        return StreamSupport.stream(roomsRepository
                                .findAll()
                                .spliterator(),
                        false)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<RoomsEntity> findOne(Long id) {
        return roomsRepository.findById(id);
    }

    @Override
    public boolean isExists(Long id) {
       return roomsRepository.existsById(id);
    }

    @Override
    public RoomsEntity partialUpdate(Long id, RoomsEntity roomsEntity) {
        roomsEntity.setR_id(id);

       return roomsRepository.findById(id).map(existingRoom -> {
           Optional.ofNullable(roomsEntity.getBuilding()).ifPresent(existingRoom::setBuilding);
           if(roomsEntity.getNumer() != 0)Optional.of(roomsEntity.getNumer()).ifPresent(existingRoom::setNumer);
           Optional.ofNullable(roomsEntity.getSuffix()).ifPresent(existingRoom::setSuffix);

           return roomsRepository.save(existingRoom);
       }).orElseThrow(() -> new RuntimeException("Room does not exist"));
    }

    @Override
    public void delete(Long id) {
        roomsRepository.deleteById(id);
    }

    @Override
    public List<Long> findAvaibleRooms(String startTime, String endTime) {

            String query = "SELECT room.r_id " +
                    "FROM RoomsEntity room " +
                    "WHERE room.r_id NOT IN " +
                    "    (SELECT class.roomid.r_id " +
                    "    FROM ClassesEntity class " +
                    "    WHERE (TO_TIMESTAMP(class.start_time, 'YYYY-MM-DD HH24:MI') >= TO_TIMESTAMP(:startTime, 'YYYY-MM-DD HH24:MI') AND " +
                    "    TO_TIMESTAMP(class.end_time, 'YYYY-MM-DD HH24:MI') <= TO_TIMESTAMP(:endTime, 'YYYY-MM-DD HH24:MI')) OR " +
                    "    (class.start_time IS NULL OR class.end_time IS NULL)) " +
                    "GROUP BY room.r_id " +
                    "ORDER BY MIN(room.building || room.numer)";

        return entityManager.createQuery(query, Long.class)
                    .setParameter("startTime", startTime)
                    .setParameter("endTime", endTime)
                    .getResultList();
    }


    public List<Long> findAvaibleRoomsFromManyDates(String startTime, String endTime)
    {
        List<List<Long>> list = new ArrayList<>();

        String[] st = startTime.split(" "); //Podzielenie na datę oraz godzinę
        String[] et = endTime.split(" "); //Podzielenie na datę oraz godzinę

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        LocalDateTime currentStartDate = LocalDateTime.parse(startTime, formatter); //Zmiana na datę początek zakresu.
        LocalDateTime endWhile = LocalDateTime.parse(endTime, formatter);

        String currentEnd = st[0] + " " + et[1];
        LocalDateTime currentEndDate = LocalDateTime.parse(currentEnd, formatter);

        while(!currentStartDate.isAfter(endWhile)){

            list.add(findAvaibleRooms(
                    currentStartDate.format(formatter),
                    currentEndDate.format(formatter)));

            currentStartDate = currentStartDate.plusDays(7);
            currentEndDate = currentEndDate.plusDays(7);

        }

        return filterList(list);
    }

    private List<Long> filterList(List<List<Long>> lists)
    {
        Set<Long> commonSet = new HashSet<>();

        // Dodaj wszystkie elementy pierwszej listy do HashSet
        commonSet.addAll(lists.get(0));

        // Iteruj po reszcie list i zachowaj tylko elementy, które istnieją we wszystkich listach
        for (List<Long> list : lists) {
            Set<Long> currentSet = new HashSet<>(list);
            commonSet.retainAll(currentSet);
        }

        return new ArrayList<>(commonSet);
    }
}

