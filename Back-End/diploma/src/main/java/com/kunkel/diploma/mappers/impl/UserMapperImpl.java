package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.TeacherDto;
import com.kunkel.diploma.models.dto.UserDto;
import com.kunkel.diploma.models.entities.TeacherEntity;
import com.kunkel.diploma.models.entities.UserEntity;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements Mapper<UserEntity, UserDto> {

    ModelMapper modelMapper;

    public UserMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public UserDto mapTo(UserEntity userEntity) {
        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public UserEntity mapFrom(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }

}
