package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.ClassesDto;
import com.kunkel.diploma.models.entities.ClassesEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class ClassesMapperImpl implements Mapper<ClassesEntity, ClassesDto> {

    ModelMapper modelMapper;

    public ClassesMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public ClassesDto mapTo(ClassesEntity classesEntity) {
        return modelMapper.map(classesEntity, ClassesDto.class);
    }

    @Override
    public ClassesEntity mapFrom(ClassesDto classesDto) {
        return modelMapper.map(classesDto, ClassesEntity.class);
    }
}
