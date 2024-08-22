package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.models.dto.TimeDto;
import com.kunkel.diploma.models.entities.*;
import com.kunkel.diploma.repositories.*;
import com.kunkel.diploma.services.ClassesService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ClassesServiceImpl implements ClassesService {

        ClassesRepository classesRepository;
        MajorRepository majorRepository;
        SubjectsRepository subjectsRepository;
        RoomsRepository roomsRepository;
        TeacherRepository teacherRepository;

        @PersistenceContext
        private EntityManager entityManager;
    public ClassesServiceImpl(ClassesRepository classesRepository, MajorRepository majorRepository, SubjectsRepository subjectsRepository, RoomsRepository roomsRepository, TeacherRepository teacherRepository) {
        this.classesRepository = classesRepository;
        this.majorRepository = majorRepository;
        this.subjectsRepository = subjectsRepository;
        this.roomsRepository = roomsRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public ClassesEntity save(TimeDto time) {
        ClassesEntity classes = new ClassesEntity();
        MajorEntity majorEntity = majorRepository.findById(time.getMajorid()).orElse(null);
        SubjectsEntity subjectsEntity = subjectsRepository.findById(time.getSubjectid()).orElse(null);
        RoomsEntity roomsEntity = roomsRepository.findById(time.getRoomid()).orElse(null);
        TeacherEntity teachearEntity = teacherRepository.findById(time.getTeacherid()).orElse(null);
        String start_time = time.getStart_time();
        String end_time = time.getEnd_time();
        classes.setMajorid(majorEntity);
        classes.setSubjectid(subjectsEntity);
        classes.setRoomid(roomsEntity);
        classes.setTeacherid(teachearEntity);
        classes.setStart_time(start_time);
        classes.setEnd_time(end_time);
        return classesRepository.save(classes);
    }

    @Override
    public List<ClassesEntity> saveP(TimeDto time, Long ammount) {
        List<ClassesEntity> classesEntities = new ArrayList<ClassesEntity>();
        String start_time = time.getStart_time(); //Czas początkowy/zakres początkowy
        String end_time = time.getEnd_time(); //Czas końcowy/zakres końcowy
        String[] st = start_time.split(" "); //Podzielenie na datę oraz godzinę
        String[] et = end_time.split(" "); //Podzielenie na datę oraz godzinę
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime currentStartDate = LocalDateTime.parse(start_time, formatter); //Zmiana na datę początek zakresu.
        LocalDateTime endWhile = LocalDateTime.parse(end_time, formatter);
        String currentEnd = st[0] + " " + et[1];
        LocalDateTime currentEndDate = LocalDateTime.parse(currentEnd, formatter);
        while(!currentStartDate.isAfter(endWhile)){
            time.setStart_time(currentStartDate.format(formatter));
            time.setEnd_time(currentEndDate.format(formatter));
            classesEntities.add(save(time));
            if(ammount == 1) {
                currentStartDate = currentStartDate.plusDays(7);
                currentEndDate = currentEndDate.plusDays(7);
            }else{
                currentStartDate = currentStartDate.plusDays(14);
                currentEndDate = currentEndDate.plusDays(14);
            }
        }
        return classesEntities;
    }



    @Override
    public List<ClassesEntity> findAll() {
       return StreamSupport.stream(classesRepository
                        .findAll().spliterator(),
                        false)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassesEntity> findAllClassesSortedByMajorId(Long mId) {
        String query = "SELECT c " +
                "FROM ClassesEntity c "+
                "WHERE c.majorid.major_id = :mid";

        return entityManager.createQuery(query, ClassesEntity.class)
                .setParameter("mid", mId)
                .getResultList();
    }

    @Override
    public Optional<ClassesEntity> findOne(Long id) {
        return classesRepository.findById(id);
    }

    @Override
    public boolean isExists(Long id) {
        return classesRepository.existsById(id);
    }

    @Override
    public ClassesEntity update(Long id, TimeDto time) {
        Optional<ClassesEntity> getclasses = findOne(id);
        MajorEntity majorEntity = majorRepository.findById(time.getMajorid()).orElse(null);
        SubjectsEntity subjectsEntity = subjectsRepository.findById(time.getSubjectid()).orElse(null);
        RoomsEntity roomsEntity = roomsRepository.findById(time.getRoomid()).orElse(null);
        TeacherEntity teachearEntity = teacherRepository.findById(time.getTeacherid()).orElse(null);
        String start_time = time.getStart_time();
        String end_time = time.getEnd_time();
        ClassesEntity classes = getclasses.get();
        classes.setMajorid(majorEntity);
        classes.setSubjectid(subjectsEntity);
        classes.setRoomid(roomsEntity);
        classes.setTeacherid(teachearEntity);
        classes.setStart_time(start_time);
        classes.setEnd_time(end_time);
        return classesRepository.save(classes);
    }

    @Override
    public ClassesEntity partialUpdate(Long id, TimeDto time) {

        Optional<ClassesEntity> getclasses = findOne(id);
        ClassesEntity classes = getclasses.get();
        if(time.getMajorid()!=null)classes.setMajorid(majorRepository.findById(time.getMajorid()).orElse(null));
        if(time.getSubjectid()!=null)classes.setSubjectid(subjectsRepository.findById(time.getSubjectid()).orElse(null));
        if(time.getRoomid()!=null)classes.setRoomid(roomsRepository.findById(time.getRoomid()).orElse(null));
        if(time.getTeacherid()!=null)classes.setTeacherid(teacherRepository.findById(time.getTeacherid()).orElse(null));
        classes.setStart_time(time.getStart_time());
        classes.setEnd_time(time.getEnd_time());

        return classesRepository.findById(id).map(existingClasses -> {
            Optional.ofNullable(classes.getSubjectid()).ifPresent(existingClasses::setSubjectid);
            Optional.ofNullable(classes.getRoomid()).ifPresent(existingClasses::setRoomid);
            Optional.ofNullable(classes.getMajorid()).ifPresent(existingClasses::setMajorid);
            Optional.ofNullable(classes.getTeacherid()).ifPresent(existingClasses::setTeacherid);
            Optional.ofNullable(classes.getStart_time()).ifPresent(existingClasses::setStart_time);
            Optional.ofNullable(classes.getEnd_time()).ifPresent(existingClasses::setEnd_time);

            return classesRepository.save(existingClasses);
        }).orElseThrow(() -> new RuntimeException("Major does not exist"));
    }

    @Override
    public void delete(Long id) {
        classesRepository.deleteById(id);
    }
}
