package com.kunkel.diploma.controllers;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.SubjectsDto;
import com.kunkel.diploma.models.entities.SubjectsEntity;
import com.kunkel.diploma.services.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class SubjectsController {

    private SubjectService subjectsService;

    private Mapper<SubjectsEntity, SubjectsDto> subjectsMapper;

    public SubjectsController(SubjectService subjectsService, Mapper<SubjectsEntity, SubjectsDto> subjectsMapper) {
        this.subjectsService = subjectsService;
        this.subjectsMapper = subjectsMapper;
    }

    @PostMapping(path = "/subject")
    public ResponseEntity<SubjectsDto> createSubject(@RequestBody SubjectsDto subject){
        SubjectsEntity subjectsEntity = subjectsMapper.mapFrom(subject);
        SubjectsEntity savedSubjectsEntity = subjectsService.save(subjectsEntity);
        return new ResponseEntity<>(subjectsMapper.mapTo(savedSubjectsEntity), HttpStatus.CREATED);
    }

    @GetMapping(path = "/subjects")
    public List<SubjectsDto> listsubjects()
    {
        List<SubjectsEntity> subjects = subjectsService.findAll();
        return subjects.stream()
                .map(subjectsMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/subjects/{s_id}")
    public ResponseEntity<SubjectsDto> getsubjects(@PathVariable("s_id") Long id)
    {
        Optional<SubjectsEntity> foundRoom = subjectsService.findOne(id);

        return foundRoom.map(subjectsEntity -> {
            SubjectsDto subjectsDto = subjectsMapper.mapTo(subjectsEntity);
            return new ResponseEntity<>(subjectsDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/subjects/{subjects_id}")
    public ResponseEntity<SubjectsDto> fullUpdatesubjects(
            @PathVariable("subjects_id") Long id,
            @RequestBody SubjectsDto subjectsDto)
    {
        if(!subjectsService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        subjectsDto.setS_id(id);
        SubjectsEntity subjectsEntity = subjectsMapper.mapFrom(subjectsDto);
        SubjectsEntity savedRoomEntity = subjectsService.save(subjectsEntity);
        return new ResponseEntity<>(subjectsMapper.mapTo(savedRoomEntity), HttpStatus.OK);
    }

    @PatchMapping(path = "/subjects/{subjects_id}")
    public ResponseEntity<SubjectsDto> partialUpdate(@PathVariable("subjects_id") Long id,
                                                  @RequestBody SubjectsDto subjectsDto)
    {
        if(!subjectsService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        SubjectsEntity subjectsEntity = subjectsMapper.mapFrom(subjectsDto);
        SubjectsEntity updatedRoom = subjectsService.partialUpdate(id, subjectsEntity);
        return new ResponseEntity<>(subjectsMapper.mapTo(updatedRoom), HttpStatus.OK);
    }

    @DeleteMapping(path = "/subjects/{subjects_id}")
    public ResponseEntity deleteSubject(@PathVariable("subjects_id") Long id)
    {
        subjectsService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
