package com.example.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Admin;
import com.example.demo.model.Eligibility;
import com.example.demo.model.Student;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.EligibilityRepository;
import com.example.demo.repository.StudentRepository;
import java.util.List;

@Service
public class AdminService {
    @Autowired private AdminRepository adminRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private EligibilityRepository eligibilityRepository;
    @Autowired private EligibilityService eligibilityService;

    public Admin login(String username, String password){
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if(admin != null && admin.getPassword().equals(password)) return admin;
        return null;
    }

    public List<Student> getAllStudents(){ return studentRepository.findAll(); }

    public Eligibility setArrearCount(Long studentId, int arrearCount, String arrearSubjects){
        Eligibility eligibility = eligibilityRepository.findByStudentId(studentId).orElseGet(() -> {
            Eligibility e = new Eligibility();
            e.setStudentId(studentId);
            return e;
        });
        eligibility.setArrearCount(arrearCount);
        eligibility.setArrearSubjects(arrearSubjects != null ? arrearSubjects : "");
        eligibility.setMaxCoursesAllowed(eligibilityService.calculateMaxCourses(arrearCount));
        eligibility.setEligibilityStatus(arrearCount <= 6 ? "ELIGIBLE" : "NOT_ELIGIBLE");
        return eligibilityRepository.save(eligibility);
    }

    public Eligibility getEligibility(Long studentId){
        return eligibilityRepository.findByStudentId(studentId).orElse(null);
    }
}
