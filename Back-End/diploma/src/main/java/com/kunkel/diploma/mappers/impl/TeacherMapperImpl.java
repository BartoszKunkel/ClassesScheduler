package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.TeacherDto;
import com.kunkel.diploma.models.entities.TeacherEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapperImpl implements Mapper<TeacherEntity, TeacherDto> {

    ModelMapper modelMapper;

    public TeacherMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public TeacherDto mapTo(TeacherEntity teacherEntity) {
        return modelMapper.map(teacherEntity, TeacherDto.class);
    }

    @Override
    public TeacherEntity mapFrom(TeacherDto teacherDto) {
        return modelMapper.map(teacherDto, TeacherEntity.class);
    }
}
