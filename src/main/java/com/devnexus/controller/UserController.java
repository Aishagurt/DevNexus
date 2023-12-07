package com.devnexus.controller;

import com.devnexus.auth.AuthenticationRequest;
import com.devnexus.auth.AuthenticationResponse;
import com.devnexus.service.AuthenticationService;
import com.devnexus.model.User;
import com.devnexus.service.UserService;
import com.devnexus.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
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

    @GetMapping
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserDto());
        return "registration";
    }
    @PostMapping("/registration")
    public User registerUserAccount(@Validated @RequestBody UserDto user){
        return userService.save(user);
    }

    @GetMapping("/checkEmail")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        Map<String, Boolean> response = Map.of("exists", userService.doesEmailExist(email));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }

}