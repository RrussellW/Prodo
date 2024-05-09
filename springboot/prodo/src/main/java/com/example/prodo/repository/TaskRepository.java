package com.example.prodo.repository;

import com.example.prodo.model.Task;
import com.example.prodo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT t FROM Task t WHERE t.name = :name")
    Optional<Task> findByName(String name);
}
