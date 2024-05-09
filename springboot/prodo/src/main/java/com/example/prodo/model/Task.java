package com.example.prodo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table
public class Task {
    @Id
    @GeneratedValue
    private int task_id;
    private String email;
    private String name;
    private String description;
    private LocalDate deadline;
    private String category;
    private String color;

    public Task() {
    }

    public Task(String email, String name, String description, LocalDate deadline, String category, String color) {
        this.email = email;
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.category = category;
        this.color = color;
    }

    public int getTask_id() {
        return task_id;
    }

    public void setTask_id(int task_id) {
        this.task_id = task_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "Tasks{" +
                "task_id=" + task_id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", deadline=" + deadline +
                ", category='" + category + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
}
