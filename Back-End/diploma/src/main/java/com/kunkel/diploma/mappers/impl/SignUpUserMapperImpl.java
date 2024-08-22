package com.kunkel.diploma.mappers.impl;

import com.kunkel.diploma.mappers.Mapper;
import com.kunkel.diploma.models.dto.SignUpDto;
import com.kunkel.diploma.models.dto.UserDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.Mapping;

@Component
public class SignUpUserMapperImpl implements Mapper<SignUpDto, UserDto>{
    ModelMapper modelMapper;

    public SignUpUserMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override

    public UserDto mapTo(SignUpDto signUpDto) {
        return modelMapper.map(signUpDto, UserDto.class);
    }

    @Override
    public SignUpDto mapFrom(UserDto userDto){ return modelMapper.map(userDto, SignUpDto.class);}

}
