package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/all")
    public List<Course> getAllCourses(){
        return courseRepository.findAll();
    }

    @GetMapping("/semester/{sem}")
    public List<Course> getCoursesBySemester(@PathVariable int sem){
        return courseRepository.findBySemester(sem);
    }
}
