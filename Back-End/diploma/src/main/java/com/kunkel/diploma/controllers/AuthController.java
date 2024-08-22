package com.kunkel.diploma.controllers;

import com.kunkel.diploma.config.UserAuthProvider;
import com.kunkel.diploma.mappers.SignUpMapper;
import com.kunkel.diploma.mappers.impl.SignUpUserMapperImpl;
import com.kunkel.diploma.mappers.impl.UserMapperImpl;
import com.kunkel.diploma.models.dto.*;
import com.kunkel.diploma.models.entities.RoomsEntity;
import com.kunkel.diploma.models.entities.UserEntity;
import com.kunkel.diploma.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserServiceImpl userService;
    private final UserAuthProvider userAuthProvider;
    private final UserMapperImpl userMapper;
    private final SignUpUserMapperImpl signUpUserMapper;
    private final SignUpMapper signUpMapper;
    @PostMapping("/login")
    public ResponseEntity<ReturnedUserDto> login(@RequestBody CredentialsDto credentialsDto){
        System.out.println(credentialsDto.toString());
        UserDto user = userService.login(credentialsDto);
        user.setToken(userAuthProvider.createToken(user));
        ReturnedUserDto userFinal = new ReturnedUserDto();
        userFinal.setId(user.getId());
        userFinal.setLogin(user.getLogin());
        userFinal.setFirstName(user.getFirstName());
        userFinal.setLastName(user.getLastName());
        userFinal.setToken(user.getToken());

        return ResponseEntity.ok(userFinal);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto singUpDto){
        UserDto user = userService.register(singUpDto);
        user.setToken(userAuthProvider.createToken(user));
        return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
    }

    @GetMapping("/login")
        public List<UserDto> listUsers(){
            List<UserEntity> users = userService.findAll();
            return users.stream()
                    .map(userMapper::mapTo)
                    .collect(Collectors.toList());
        }


    @PatchMapping(path = "/register/{id}")
    public ResponseEntity<UserDto> partialUpdate(@PathVariable("id") Long id,
                                                  @RequestBody SignUpDto signUpDto)
    {
        System.out.println(signUpDto.toString());
        if(!userService.isExists(id))
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        UserDto userDto = signUpUserMapper.mapTo(signUpDto);
        System.out.println(userDto.toString());
        UserEntity userEntity = signUpMapper.fullSignUpToUserEntity(signUpDto);
        System.out.println(userEntity.toString());
        UserEntity updatedUser = userService.partialUpdate(id, userEntity);
        return new ResponseEntity<>(userMapper.mapTo(updatedUser), HttpStatus.OK);
    }

    @DeleteMapping(path = "/login/{id}")
    public ResponseEntity deleteRoom(@PathVariable("id") Long id)
    {
        System.out.println(id);
        userService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
