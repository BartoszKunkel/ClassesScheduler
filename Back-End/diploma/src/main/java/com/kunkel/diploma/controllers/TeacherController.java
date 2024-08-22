package com.kunkel.diploma.controllers;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.TeacherDto;
import com.kunkel.diploma.models.entities.TeacherEntity;
import com.kunkel.diploma.services.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class TeacherController {

    private TeacherService teacherService;
    private Mapper<TeacherEntity, TeacherDto> teacherMapper;

    public TeacherController(TeacherService teacherService, Mapper<TeacherEntity, TeacherDto> teacherMapper) {
        this.teacherService = teacherService;
        this.teacherMapper = teacherMapper;
    }

    @PostMapping(path = "/teacher")
    public ResponseEntity<TeacherDto> createTeacher(@RequestBody TeacherDto teacher){
        TeacherEntity teacherEntity = teacherMapper.mapFrom(teacher);
        TeacherEntity savedTeacherEntity = teacherService.save(teacherEntity);
        return new ResponseEntity<>(teacherMapper.mapTo(savedTeacherEntity), HttpStatus.CREATED);
    }

    @GetMapping(path = "/teacher")
    public List<TeacherDto> listTeacher()
    {
        List<TeacherEntity> teacher = teacherService.findAll();
        return teacher.stream()
                .map(teacherMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/teacher/{t_id}")
    public ResponseEntity<TeacherDto> getTeacher(@PathVariable("t_id") Long id)
    {
        Optional<TeacherEntity> foundRoom = teacherService.findOne(id);
        return foundRoom.map(teacherEntity -> {
            TeacherDto teacherDto = teacherMapper.mapTo(teacherEntity);
            return new ResponseEntity<>(teacherDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/teacher/{t_id}")
    public ResponseEntity<TeacherDto> fullUpdateteacher(
            @PathVariable("t_id") Long id,
            @RequestBody TeacherDto teacherDto)
    {
        if(!teacherService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        teacherDto.setT_id(id);
        TeacherEntity teacherEntity = teacherMapper.mapFrom(teacherDto);
        TeacherEntity savedRoomEntity = teacherService.save(teacherEntity);
        return new ResponseEntity<>(teacherMapper.mapTo(savedRoomEntity), HttpStatus.OK);
    }

    @PatchMapping(path = "/teacher/{teacher_id}")
    public ResponseEntity<TeacherDto> partialUpdate(@PathVariable("teacher_id") Long id,
                                                     @RequestBody TeacherDto teacherDto)
    {
        if(!teacherService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        TeacherEntity teacherEntity = teacherMapper.mapFrom(teacherDto);
        TeacherEntity updatedRoom = teacherService.partialUpdate(id, teacherEntity);
        return new ResponseEntity<>(teacherMapper.mapTo(updatedRoom), HttpStatus.OK);
    }

    @DeleteMapping(path = "/teacher/{teacher_id}")
    public ResponseEntity deleteTeacher(@PathVariable("teacher_id") Long id){
        teacherService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


}
