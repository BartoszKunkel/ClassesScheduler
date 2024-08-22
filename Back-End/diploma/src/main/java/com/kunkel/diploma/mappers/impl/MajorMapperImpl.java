package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.MajorDto;
import com.kunkel.diploma.models.entities.MajorEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MajorMapperImpl implements Mapper<MajorEntity, MajorDto> {

    private ModelMapper modelMapper;

    public MajorMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public MajorDto mapTo(MajorEntity majorEntity) {
        return modelMapper.map(majorEntity, MajorDto.class);
    }

    @Override
    public MajorEntity mapFrom(MajorDto majorDto) {
        return modelMapper.map(majorDto, MajorEntity.class);
    }
}
