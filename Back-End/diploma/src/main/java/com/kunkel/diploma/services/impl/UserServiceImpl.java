package com.kunkel.diploma.services.impl;

import com.kunkel.diploma.exceptions.AppException;
import com.kunkel.diploma.mappers.SignUpMapper;
import com.kunkel.diploma.mappers.impl.SignUpUserMapperImpl;
import com.kunkel.diploma.mappers.impl.UserMapperImpl;
import com.kunkel.diploma.models.dto.CredentialsDto;
import com.kunkel.diploma.models.dto.SignUpDto;
import com.kunkel.diploma.models.dto.UserDto;
import com.kunkel.diploma.models.entities.UserEntity;

import com.kunkel.diploma.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class UserServiceImpl{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SignUpMapper signUpMapper;
    private final UserMapperImpl userMapper;

    public UserDto login (CredentialsDto credentialsDto){


        System.out.println(userRepository.findByLogin(credentialsDto.login()));
        UserEntity user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));
        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()),
                user.getPassword())){
            return userMapper.mapTo(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto signUpDto){

        Optional<UserEntity> User = userRepository.findByLogin(signUpDto.login());

        if(User.isPresent()){
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        UserEntity userEntity = signUpMapper.signUpToUserEntity(signUpDto);
        userEntity.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.password())));
        userEntity.setAccesslvl(signUpDto.accesslvl());
        UserEntity savedUser = userRepository.save(userEntity);

        return userMapper.mapTo(savedUser);
    }

    public List<UserEntity> findAll() {
        return StreamSupport.stream(userRepository
                                .findAll()
                                .spliterator(),
                        false)
                .collect(Collectors.toList());
    }

    public boolean isExists(Long id) {
            return userRepository.existsById(id);
    }

    public UserEntity partialUpdate(Long id, UserEntity userEntity) {
        userEntity.setId(id);
        System.out.println(userEntity.getPassword());
        System.out.println(userEntity.getAccesslvl());

        return userRepository.findById(id).map(existingUser -> {
            Optional.ofNullable(userEntity.getLogin()).ifPresent(existingUser::setLogin);
            Optional.ofNullable(userEntity.getFirstName()).ifPresent(existingUser::setFirstName);
            Optional.ofNullable(userEntity.getLastName()).ifPresent(existingUser::setLastName);
            String password = userEntity.getPassword();
            if(existingUser.getPassword() != userEntity.getPassword()) {
                existingUser
                        .setPassword(passwordEncoder
                                .encode(CharBuffer.wrap(password)));
            }
            if(userEntity.getAccesslvl() != null)Optional.of(userEntity.getAccesslvl()).ifPresent(existingUser::setAccesslvl);
            System.out.println(userEntity.toString());
            System.out.println(existingUser.toString());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User does not exist"));
    }

    public void delete(Long id) { userRepository.deleteById(id);
    }
}
