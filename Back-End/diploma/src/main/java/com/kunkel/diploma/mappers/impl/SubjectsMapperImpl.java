package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.SubjectsDto;
import com.kunkel.diploma.models.entities.SubjectsEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class SubjectsMapperImpl implements Mapper<SubjectsEntity, SubjectsDto> {

    ModelMapper modelMapper;

    public SubjectsMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public SubjectsDto mapTo(SubjectsEntity subjectsEntity) {
        return modelMapper.map(subjectsEntity, SubjectsDto.class);
    }

    @Override
    public SubjectsEntity mapFrom(SubjectsDto subjectsDto) {
        return modelMapper.map(subjectsDto, SubjectsEntity.class);
    }
}
