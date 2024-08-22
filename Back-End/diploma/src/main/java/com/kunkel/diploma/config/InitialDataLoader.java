package com.kunkel.diploma.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.kunkel.diploma.models.entities.UserEntity;
import com.kunkel.diploma.repositories.UserRepository;

import java.nio.CharBuffer;

@Component
public class InitialDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public InitialDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByLogin("admin").isEmpty()) {
            UserEntity adminUser = new UserEntity();
            adminUser.setLogin("admin");
            adminUser.setPassword(passwordEncoder.encode(CharBuffer.wrap("adminPassword")));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setAccesslvl(4L);
            userRepository.save(adminUser);

        }
    }
}