package com.kunkel.diploma.mappers;

import com.kunkel.diploma.models.dto.SignUpDto;
import com.kunkel.diploma.models.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SignUpMapper {

    @Mapping(target = "password", ignore = true)
    UserEntity signUpToUserEntity(SignUpDto signUpDto);

    @Mapping(target = "password", ignore = false)
    UserEntity fullSignUpToUserEntity(SignUpDto signUpDto);

    default String map(char[] value) {
        return new String(value);
    }
}
