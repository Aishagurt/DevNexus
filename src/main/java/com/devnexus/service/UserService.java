package com.devnexus.service;

import com.devnexus.mapper.UserMapper;
import com.devnexus.model.db.User;
import com.devnexus.repository.UserRepository;
import com.devnexus.dto.UserDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        super();
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto save(UserDto userDto) {
        User user = new User(userDto.getName(), userDto.getSurname(),
                userDto.getBirthDate(), userDto.getEmail(),
                passwordEncoder.encode(userDto.getPassword()), List.of(roleService.findRoleByName("ROLE_USER")));
        return UserMapper.userToUserDto(userRepository.save(user));
    }

    public Boolean doesEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
