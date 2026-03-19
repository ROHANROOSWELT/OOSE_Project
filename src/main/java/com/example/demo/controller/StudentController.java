package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import com.example.demo.service.EligibilityService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "*")
public class StudentController {
    @Autowired private StudentService studentService;
    @Autowired private EligibilityService eligibilityService;

    @GetMapping("/all")
    public List<Student> getAllStudents(){ return studentService.getAllStudents(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id){
        Student s = studentService.getStudentById(id);
        if(s == null) return ResponseEntity.notFound().build();
        s.setPassword(null);
        return ResponseEntity.ok(s);
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<?> checkEligibility(@PathVariable Long id){
        return ResponseEntity.ok(eligibilityService.getEligibilityByStudentId(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> body){
        try {
            Student s = studentService.getStudentById(id);
            if(s == null) return ResponseEntity.notFound().build();
            if(body.containsKey("phone"))        s.setPhone(body.get("phone"));
            if(body.containsKey("email"))        s.setEmail(body.get("email"));
            if(body.containsKey("profilePhoto")) s.setProfilePhoto(body.get("profilePhoto"));
            Student saved = studentService.saveStudent(s);
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
