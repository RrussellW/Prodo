package com.example.prodo.service;

import com.example.prodo.model.User;
import com.example.prodo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public String getUser(User user) {
        Optional<User> userOptional = userRepository.findUser(user.getEmail(), user.getPassword());

        if (userOptional.isPresent()) {
            return userOptional.get().getEmail();
        }
        return "User does not exist";
    }

    public String addNewUser(User user) {
       Optional<User> userOptional = userRepository.findByEmail(user.getEmail());
        if (userOptional.isPresent()) {
            return "Email already taken";
        }

        userRepository.save(user);
        return "Success";
    }
}
