package com.catringPlatFrom.authentication.repository;

import com.catringPlatFrom.authentication.entity.User;
import com.catringPlatFrom.authentication.enums.Role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(String role);}