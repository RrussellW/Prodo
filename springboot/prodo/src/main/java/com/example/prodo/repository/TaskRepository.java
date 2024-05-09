package com.example.prodo.repository;

import com.example.prodo.model.Task;
import com.example.prodo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT t FROM Task t WHERE t.name = :name AND t.email = :email")
    Optional<Task> findByName(String name, String email);

    @Query("SELECT t FROM Task t WHERE t.email = :email")
    List<Task> findByEmail(String email);
}
