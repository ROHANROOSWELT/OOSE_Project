package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Course;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findBySemester(int semester);
    List<Course> findBySemesterAndCourseType(int semester, String courseType);
    List<Course> findByCourseType(String courseType);
    List<Course> findByCourseCodeIn(List<String> codes);
}
