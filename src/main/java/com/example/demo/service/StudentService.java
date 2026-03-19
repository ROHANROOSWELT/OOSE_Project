package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents(){ return studentRepository.findAll(); }

    public Student getStudentById(Long id){
        return studentRepository.findById(id).orElse(null);
    }

    public Student saveStudent(Student student){
        return studentRepository.save(student);
    }

    public Student findByRegisterNo(String registerNo){
        return studentRepository.findByRegisterNo(registerNo).orElse(null);
    }

    public boolean existsByRegisterNo(String registerNo){
        return studentRepository.existsByRegisterNo(registerNo);
    }
}
