package com.example.prodo.service;

import com.example.prodo.model.Task;
import com.example.prodo.model.User;
import com.example.prodo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public String addNewTask(Task task) {
        Optional<Task> taskOptional = taskRepository.findByName(task.getName());
        if (taskOptional.isPresent()) {
            return "Task already exists";
        }

        taskRepository.save(task);
        return "Success";
    }
}
