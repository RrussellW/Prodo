package com.example.prodo.controller;

import com.example.prodo.model.Task;
import com.example.prodo.model.User;
import com.example.prodo.service.TaskService;
import com.example.prodo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="api/v1/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskService.getTasks();
    }

    @PostMapping("/user")
    public List<Task> getTasksByEmail(@RequestBody String email) {
        return taskService.getTasksByEmail(email);
    }

    @PostMapping
    public String registerNewTask(@RequestBody Task task) {
        return taskService.addNewTask(task);
    }
}
