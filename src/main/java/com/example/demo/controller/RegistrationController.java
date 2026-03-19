package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.ExamRegistration;
import com.example.demo.service.RegistrationService;

@RestController
@RequestMapping("/exam")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerExam(@RequestBody ExamRegistration registration){
        try {
            ExamRegistration saved = registrationService.registerExam(registration);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getRegistration(@PathVariable Long studentId){
        ExamRegistration reg = registrationService.getRegistrationByStudentId(studentId);
        if(reg == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reg);
    }
}
