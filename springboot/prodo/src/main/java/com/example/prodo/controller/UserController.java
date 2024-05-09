package com.example.prodo.controller;

import com.example.prodo.model.User;
import com.example.prodo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="api/v1/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping
    public String registerNewUser(@RequestBody User user) {
        return userService.addNewUser(user);
    }

    @PostMapping("/login")
    public String userLogin(@RequestBody User user) {
        return userService.getUser(user);
    }
}
