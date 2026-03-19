package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Admin;
import com.example.demo.model.Eligibility;
import com.example.demo.model.Student;
import com.example.demo.service.AdminService;
import com.example.demo.repository.RegistrationRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.HallTicketRepository;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private RegistrationRepository registrationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private HallTicketRepository hallTicketRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        try {
            Admin admin = adminService.login(body.get("username"), body.get("password"));
            if(admin == null)
                return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
            return ResponseEntity.ok(Map.of(
                "adminId",  admin.getAdminId(),
                "username", admin.getUsername(),
                "fullName", admin.getFullName()
            ));
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(){
        try {
            List<Student> students = adminService.getAllStudents();
            List<Map<String, Object>> result = new ArrayList<>();

            for(Student s : students){
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("studentId",   s.getStudentId());
                row.put("registerNo",  s.getRegisterNo());
                row.put("name",        s.getName());
                row.put("department",  s.getDepartment());
                row.put("degree",      s.getDegree());
                row.put("semester",    s.getSemester());
                row.put("year",        s.getYear());

                Eligibility e = adminService.getEligibility(s.getStudentId());
                row.put("arrearCount",       e != null ? e.getArrearCount() : 0);
                row.put("arrearSubjects",    e != null ? e.getArrearSubjects() : "");
                row.put("maxCourses",        e != null ? e.getMaxCoursesAllowed() : 9);
                row.put("eligibilityStatus", e != null ? e.getEligibilityStatus() : "ELIGIBLE");

                var reg = registrationRepository.findByStudentId(s.getStudentId());
                if(reg.isPresent()){
                    var r = reg.get();
                    row.put("registrationStatus", r.getRegistrationStatus());
                    row.put("examType",           r.getExamType());
                    row.put("totalFee",           r.getTotalFee());
                    row.put("registeredCourses",  r.getRegisteredCourses());
                    row.put("arrearCourses",      r.getArrearCourses());
                    row.put("registrationId",     r.getRegistrationId());

                    var pay = paymentRepository.findByRegistrationId(r.getRegistrationId());
                    if(pay.isPresent()){
                        row.put("paymentStatus",    pay.get().getPaymentStatus());
                        row.put("transactionId",    pay.get().getTransactionId());
                        var ht = hallTicketRepository.findByRegistrationId(r.getRegistrationId());
                        row.put("hallTicketStatus", ht.isPresent() ? "GENERATED" : "PENDING");
                        row.put("overallStatus",    ht.isPresent() ? "COMPLETED" : "HALL_TICKET_PENDING");
                    } else {
                        row.put("paymentStatus",    "PENDING");
                        row.put("hallTicketStatus", "PENDING");
                        row.put("overallStatus",    "PAYMENT_PENDING");
                    }
                } else {
                    row.put("registrationStatus", "NOT_REGISTERED");
                    row.put("paymentStatus",      "PENDING");
                    row.put("hallTicketStatus",   "PENDING");
                    row.put("overallStatus",      "NOT_REGISTERED");
                }
                result.add(row);
            }
            return ResponseEntity.ok(result);
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/student/{studentId}/arrears")
    public ResponseEntity<?> setArrears(
            @PathVariable Long studentId,
            @RequestBody Map<String, Object> body){
        try {
            int arrearCount = (Integer) body.get("arrearCount");
            String arrearSubjects = (String) body.getOrDefault("arrearSubjects", "");
            if(arrearCount < 0)
                return ResponseEntity.badRequest().body(Map.of("error","Cannot be negative"));
            Eligibility e = adminService.setArrearCount(studentId, arrearCount, arrearSubjects);
            return ResponseEntity.ok(Map.of(
                "studentId",         studentId,
                "arrearCount",       e.getArrearCount(),
                "arrearSubjects",    e.getArrearSubjects(),
                "maxCourses",        e.getMaxCoursesAllowed(),
                "eligibilityStatus", e.getEligibilityStatus(),
                "message",           "Updated successfully"
            ));
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(){
        try {
            return ResponseEntity.ok(Map.of(
                "totalStudents",      adminService.getAllStudents().size(),
                "totalRegistrations", registrationRepository.count(),
                "totalPayments",      paymentRepository.count(),
                "totalHallTickets",   hallTicketRepository.count()
            ));
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}