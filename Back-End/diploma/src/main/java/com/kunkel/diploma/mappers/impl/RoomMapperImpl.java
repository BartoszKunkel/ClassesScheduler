package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.RoomsDto;
import com.kunkel.diploma.models.entities.RoomsEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class RoomMapperImpl implements Mapper<RoomsEntity, RoomsDto> {

    private ModelMapper modelMapper;

    public RoomMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public RoomsDto mapTo(RoomsEntity roomsEntity) {
        return modelMapper.map(roomsEntity, RoomsDto.class);
    }

    @Override
    public RoomsEntity mapFrom(RoomsDto roomsDto) {
        return modelMapper.map(roomsDto, RoomsEntity.class);
    }
}
