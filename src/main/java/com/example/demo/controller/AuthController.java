package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student){
        try {
            if(student.getRegisterNo() == null || student.getRegisterNo().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error","Register number is required"));
            if(student.getPassword() == null || student.getPassword().isBlank())
                return ResponseEntity.badRequest().body(Map.of("error","Password is required"));
            if(studentService.existsByRegisterNo(student.getRegisterNo()))
                return ResponseEntity.badRequest().body(Map.of("error","Student already exists"));
            Student saved = studentService.saveStudent(student);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error","Registration failed: "+e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        try {
            String registerNo = body.get("registerNo");
            String password   = body.get("password");
            if(registerNo == null || password == null)
                return ResponseEntity.badRequest().body(Map.of("error","Register number and password required"));
            Student student = studentService.findByRegisterNo(registerNo);
            if(student == null || !student.getPassword().equals(password))
                return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
            Map<String, Object> response = new HashMap<>();
            response.put("studentId",  student.getStudentId());
            response.put("name",       student.getName());
            response.put("registerNo", student.getRegisterNo());
            response.put("department", student.getDepartment());
            response.put("degree",     student.getDegree());
            response.put("semester",   student.getSemester());
            response.put("year",       student.getYear());
            response.put("email",      student.getEmail());
            response.put("phone",      student.getPhone());
            response.put("profilePhoto", student.getProfilePhoto());
            return ResponseEntity.ok(response);
        } catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error","Login failed: "+e.getMessage()));
        }
    }
}