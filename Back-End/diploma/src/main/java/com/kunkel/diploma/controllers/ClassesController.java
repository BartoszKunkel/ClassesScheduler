package com.kunkel.diploma.controllers;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.ClassesDto;
import com.kunkel.diploma.models.dto.TimeDto;
import com.kunkel.diploma.models.entities.ClassesEntity;
import com.kunkel.diploma.services.ClassesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ClassesController {
    private ClassesService classesService;

    private Mapper<ClassesEntity, ClassesDto> classesMapper;

    public ClassesController(ClassesService classesService, Mapper<ClassesEntity, ClassesDto> classesMapper) {
        this.classesService = classesService;
        this.classesMapper = classesMapper;
    }


//    @PostMapping(path = "/classes/{majorid}/{subjectid}/{roomid}/{teacherid}")
//    public ResponseEntity<ClassesDto> createClasses(@PathVariable("majorid") Long majorid,
//                                                    @PathVariable("subjectid") Long subjectid,
//                                                    @PathVariable("roomid") Long roomid,
//                                                    @PathVariable("teacherid") Long teacherid,
//                                                    @RequestBody ClassesDto classes)
//    {
//        System.out.println(classes);
//        System.out.println(majorid + " --- " + subjectid + " --- " + roomid + " --- " + teacherid);
//        ClassesEntity classesEntity = classesMapper.mapFrom(classes);
//        ClassesEntity savedClassesEntity = classesService.createClass(majorid,subjectid,roomid,teacherid, classesEntity);
//        return new ResponseEntity<>(classesMapper.mapTo(savedClassesEntity), HttpStatus.CREATED);
//    }

    @PostMapping(path = "/classes")
    public ResponseEntity<ClassesDto> createClasses(@RequestBody TimeDto time)
    {
        ClassesEntity savedClassesEntity = classesService.save(time);
        return new ResponseEntity<>(classesMapper.mapTo(savedClassesEntity), HttpStatus.CREATED);
    }

    @PostMapping(path = "/classesp/{ammount}")
    public ResponseEntity<List<ClassesDto>> createPeriodicClasses(@PathVariable("ammount") Long ammount,
                                                                  @RequestBody TimeDto time)
    {
        List<ClassesEntity> classes = classesService.saveP(time, ammount);
        return new ResponseEntity<>(classes.stream()
                .map(classesMapper::mapTo)
                .collect(Collectors.toList()), HttpStatus.CREATED);
    }

    @GetMapping(path = "/classes")
    public List<ClassesDto> listClasses()
    {
        List<ClassesEntity> classes = classesService.findAll();
        return classes.stream()
                .map(classesMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/sortclasses/{m_id}")
    public List<ClassesDto> sortedListClasses(@PathVariable("m_id") Long m_id)
    {
        List<ClassesEntity> classes = classesService.findAllClassesSortedByMajorId(m_id);
        return classes.stream()
                .map(classesMapper::mapTo)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/classes/{c_id}")
    public ResponseEntity<ClassesDto> getClass(@PathVariable("c_id") Long id)
    {
        Optional<ClassesEntity> foundClass = classesService.findOne(id);
        return foundClass.map(classes -> {
            ClassesDto classesDto = classesMapper.mapTo(classes);
            return new ResponseEntity<>(classesDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(path = "/classes/{c_id}")
    public ResponseEntity<ClassesDto> updateClass(@PathVariable("c_id") Long id,
                                                  @RequestBody TimeDto timeDto)
    {
        if(!classesService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ClassesEntity savedClassesEntity = classesService.update(id, timeDto);
        return new ResponseEntity<>(classesMapper.mapTo(savedClassesEntity), HttpStatus.OK);    }

    @PatchMapping(path = "/classes/{c_id}")
    public ResponseEntity<ClassesDto> partialUpdateClass(@PathVariable("c_id") Long id,
                                                  @RequestBody TimeDto timeDto)
    {
        if(!classesService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ClassesEntity savedClassesEntity = classesService.partialUpdate(id, timeDto);
        return new ResponseEntity<>(classesMapper.mapTo(savedClassesEntity), HttpStatus.OK);    }

    @DeleteMapping(path = "/classes/{c_id}")
    public ResponseEntity deleteClasses(@PathVariable("c_id") Long id){
        classesService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
