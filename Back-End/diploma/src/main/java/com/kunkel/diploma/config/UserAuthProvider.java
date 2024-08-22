package com.kunkel.diploma.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.kunkel.diploma.exceptions.AppException;
import com.kunkel.diploma.mappers.impl.UserMapperImpl;
import com.kunkel.diploma.models.dto.UserDto;
import com.kunkel.diploma.models.entities.UserEntity;
import com.kunkel.diploma.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {
    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final String SECRET_KEY = "@fG3$3ds%Kl#9dPq1";
    private final UserMapperImpl userMapper;
    private final UserRepository userRepository;

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(SECRET_KEY.getBytes());
    }

    public String createToken(UserDto dto){
        Date now = new Date();
        Date validity = new Date(now.getTime() +  86_400_000);

        return JWT.create()
                .withIssuer(dto.getLogin())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("firstName", dto.getFirstName())
                .withClaim("lastName", dto.getLastName())
                .withClaim("accesslvl", dto.getAccesslvl())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public Authentication validateToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decoded = verifier.verify(token);

        UserDto userDto = UserDto.builder()
                .login(decoded.getIssuer())
                .firstName(decoded.getClaim("firstName").asString())
                .lastName(decoded.getClaim("lastName").asString())
                .accesslvl(decoded.getClaim("accesslvl").asLong())
                .build();

        return new UsernamePasswordAuthenticationToken(userDto, null, Collections.emptyList());
    }

    public Authentication validateTokenStrongly(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decoded = verifier.verify(token);

        UserEntity user = userRepository.findByLogin(decoded.getIssuer()).orElseThrow(() -> new AppException("Unknown user" , HttpStatus.NOT_FOUND));

        return new UsernamePasswordAuthenticationToken(userMapper.mapTo(user), null, Collections.emptyList());

    }
}
