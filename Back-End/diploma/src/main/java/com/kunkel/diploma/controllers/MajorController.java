package com.kunkel.diploma.controllers;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.entities.MajorEntity;
import com.kunkel.diploma.services.MajorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class MajorController {

    private MajorService majorService;

    private Mapper<MajorEntity, MajorDto> majorMapper;

    public MajorController(MajorService majorService, Mapper<MajorEntity, MajorDto> majorMapper){
        this.majorService = majorService;
        this.majorMapper = majorMapper;
    }
    @PostMapping(path = "/major")
    public ResponseEntity<MajorDto> createMajor(@RequestBody MajorDto major){
        MajorEntity majorEntity = majorMapper.mapFrom(major);
        MajorEntity savedMajorEntity = majorService.save(majorEntity);
        return new ResponseEntity<>(majorMapper.mapTo(savedMajorEntity), HttpStatus.CREATED);
    }

    @GetMapping(path = "/major")
    public List<MajorDto> listMajor()
    {
        List<MajorEntity> major = majorService.findAll();
        return major.stream()
                .map(majorMapper::mapTo)
                .collect(Collectors.toList());
    }


    @PostMapping(path = "/majorfilter/{group}")
    public List<MajorDto> filtrMajor(@RequestBody MajorDto majorFilter,
                                     @PathVariable int group){
        List<MajorEntity> major = majorService.filter(majorFilter, group);
        return major.stream()
                .map(majorMapper::mapTo)
                .collect(Collectors.toList());
    }


    @GetMapping(path = "/major/{major_id}")
    public ResponseEntity<MajorDto> getMajor(@PathVariable("major_id") Long id)
    {
        Optional<MajorEntity> foundRoom = majorService.findOne(id);
        return foundRoom.map(majorEntity -> {
            MajorDto majorDto = majorMapper.mapTo(majorEntity);
            return new ResponseEntity<>(majorDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/major/{major_id}")
    public ResponseEntity<MajorDto> fullUpdateMajor(
            @PathVariable("major_id") Long id,
            @RequestBody MajorDto majorDto)
    {
        if(!majorService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        majorDto.setMajor_id(id);
        MajorEntity majorEntity = majorMapper.mapFrom(majorDto);
        MajorEntity savedRoomEntity = majorService.save(majorEntity);
        return new ResponseEntity<>(majorMapper.mapTo(savedRoomEntity), HttpStatus.OK);
    }

    @PatchMapping(path = "/major/{major_id}")
    public ResponseEntity<MajorDto> partialUpdate(@PathVariable("major_id") Long id,
                                                  @RequestBody MajorDto majorDto)
    {
        if(!majorService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        MajorEntity majorEntity = majorMapper.mapFrom(majorDto);
        MajorEntity updatedRoom = majorService.partialUpdate(id, majorEntity);
        return new ResponseEntity<>(majorMapper.mapTo(updatedRoom), HttpStatus.OK);
    }

    @DeleteMapping(path = "/major/{major_id}")
    public ResponseEntity deteleMajor(@PathVariable("major_id") Long id)
    {
        majorService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


}
