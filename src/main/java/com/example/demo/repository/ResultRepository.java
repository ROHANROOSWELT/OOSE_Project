package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.demo.model.Result;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);

    @Query("SELECT COUNT(r) FROM Result r WHERE r.studentId = :studentId AND r.status = 'FAIL'")
    int countArrearsByStudentId(Long studentId);
}
