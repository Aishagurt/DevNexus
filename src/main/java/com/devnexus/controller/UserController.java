package com.devnexus.controller;

import com.devnexus.mapper.UserMapper;
import com.devnexus.model.api.AuthenticationRequest;
import com.devnexus.model.api.AuthenticationResponse;
import com.devnexus.service.AuthenticationService;
import com.devnexus.service.UserService;
import com.devnexus.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationService authService;

    public UserController(UserService userService, AuthenticationService service) {
        super();
        this.userService = userService;
        this.authService = service;
    }

    @PostMapping("/registration")
    public UserDto registerUserAccount(@Validated @RequestBody UserDto user){
        return userService.save(user);
    }

    @GetMapping("/checkEmail")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        Map<String, Boolean> response = Map.of("exists", userService.doesEmailExist(email));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{email}")
    public UserDto getUser(@PathVariable String email) {
        return UserMapper.userToUserDto(userService.findUserByEmail(email));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authService.refreshToken(request, response);
    }

    @PutMapping("/update/{email}")
    public UserDto updateUser(@PathVariable(name = "email") String email, @RequestBody UserDto userDto) {
        return userService.update(email, userDto);
    }

}
