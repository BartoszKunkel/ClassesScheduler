package com.kunkel.diploma.controllers;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.FilterDto;
import com.kunkel.diploma.models.dto.RoomsDto;
import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.services.RoomsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class RoomsController {

    private RoomsService roomsService;

    private Mapper<RoomsEntity, RoomsDto> roomsMapper;

    public RoomsController(RoomsService roomsService, Mapper<RoomsEntity, RoomsDto> roomsMapper){
        this.roomsService = roomsService;
        this.roomsMapper = roomsMapper;
    }

    //CRUD FUNCTIONS
    @PostMapping(path = "/rooms")
    public ResponseEntity<RoomsDto> createRoom(@RequestBody RoomsDto room){
        RoomsEntity roomsEntity = roomsMapper.mapFrom(room);
        RoomsEntity savedRoomsEntity = roomsService.save(roomsEntity);
        return new ResponseEntity<>(roomsMapper.mapTo(savedRoomsEntity), HttpStatus.CREATED);
    }

    @GetMapping(path = "/rooms")
    public List<RoomsDto> listRooms()
    {
        List<RoomsEntity> rooms = roomsService.findAll();
        return rooms.stream()
                .map(roomsMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/rooms/{r_id}")
    public ResponseEntity<RoomsDto> getRoom(@PathVariable("r_id") Long id)
    {
        Optional<RoomsEntity> foundRoom = roomsService.findOne(id);
        return foundRoom.map(roomsEntity -> {
            RoomsDto roomsDto = roomsMapper.mapTo(roomsEntity);
            return new ResponseEntity<>(roomsDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/rooms/{r_id}")
    public ResponseEntity<RoomsDto> fullUpdateRoom(
            @PathVariable("r_id") Long id,
            @RequestBody RoomsDto roomsDto)
    {
       if(!roomsService.isExists(id))
       {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
       }

       roomsDto.setR_id(id);
        RoomsEntity roomsEntity = roomsMapper.mapFrom(roomsDto);
        RoomsEntity savedRoomEntity = roomsService.save(roomsEntity);
        return new ResponseEntity<>(roomsMapper.mapTo(savedRoomEntity), HttpStatus.OK);
    }

    @PatchMapping(path = "/rooms/{r_id}")
    public ResponseEntity<RoomsDto> partialUpdate(@PathVariable("r_id") Long id,
                                                  @RequestBody RoomsDto roomsDto)
    {
        if(!roomsService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        RoomsEntity roomsEntity = roomsMapper.mapFrom(roomsDto);
        RoomsEntity updatedRoom = roomsService.partialUpdate(id, roomsEntity);
        return new ResponseEntity<>(roomsMapper.mapTo(updatedRoom), HttpStatus.OK);
    }

    @DeleteMapping(path = "/rooms/{r_id}")
    public ResponseEntity deleteRoom(@PathVariable("r_id") Long id)
    {
        roomsService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


    //CUSTOM QUERIES
    @GetMapping(path = "/rooms/filtered/{start}/{end}")
    public List<RoomsDto> avaibleRooms(@PathVariable String start,
                                       @PathVariable String end)
    {
        List<Long> rooms = roomsService.findAvaibleRooms(start,end);
        List<RoomsEntity> foundRoomsList = new ArrayList<>();
        RoomsEntity roomsEntity;
        for(int i = 0; i < rooms.size(); i++)
        {
            roomsEntity = roomsService.findOne(rooms.get(i)).orElse(null);
            foundRoomsList.add(roomsEntity);
        }
        return foundRoomsList.stream()
                .map(roomsMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/rooms/filtermany/{start}/{end}")
    public List<RoomsDto> manyAvaibleRooms(@PathVariable String start,
                                           @PathVariable String end)
    {
        List<Long> rooms = roomsService.findAvaibleRoomsFromManyDates(start, end);
        List<RoomsEntity> foundRoomsList = new ArrayList<>();
        RoomsEntity roomsEntity;
        for(int i = 0; i < rooms.size(); i++)
        {
            roomsEntity = roomsService.findOne(rooms.get(i)).orElse(null);
            foundRoomsList.add(roomsEntity);
        }
        return foundRoomsList.stream()
                .map(roomsMapper::mapTo)
                .collect(Collectors.toList());
    }

}
