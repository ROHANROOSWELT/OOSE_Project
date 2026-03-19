package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Eligibility;
import java.util.Optional;

public interface EligibilityRepository extends JpaRepository<Eligibility, Long> {
    Optional<Eligibility> findByStudentId(Long studentId);
}
