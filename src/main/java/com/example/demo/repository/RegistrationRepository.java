package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.ExamRegistration;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<ExamRegistration, Long> {
    Optional<ExamRegistration> findByStudentId(Long studentId);
}