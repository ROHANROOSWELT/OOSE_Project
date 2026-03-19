package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.ExamRegistration;
import com.example.demo.model.Eligibility;
import com.example.demo.repository.RegistrationRepository;
import java.util.Date;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EligibilityService eligibilityService;

    public ExamRegistration registerExam(ExamRegistration registration){
        Eligibility eligibility = eligibilityService.getEligibilityByStudentId(registration.getStudentId());

        if("NOT_ELIGIBLE".equals(eligibility.getEligibilityStatus()))
            throw new RuntimeException("Student is not eligible for exam registration");

        // Count regular courses — filter empty strings
        int regularCount = 0;
        if(registration.getRegisteredCourses() != null && !registration.getRegisteredCourses().isBlank()){
            regularCount = (int) java.util.Arrays.stream(registration.getRegisteredCourses().split(","))
                .filter(s -> !s.isBlank()).count();
        }

        if(regularCount > eligibility.getMaxCoursesAllowed())
            throw new RuntimeException("Course limit exceeded. Maximum allowed: " + eligibility.getMaxCoursesAllowed());

        // Count arrear courses — filter empty strings
        int arrearCount = 0;
        if(registration.getArrearCourses() != null && !registration.getArrearCourses().isBlank()){
            arrearCount = (int) java.util.Arrays.stream(registration.getArrearCourses().split(","))
                .filter(s -> !s.isBlank()).count();
        }

        // Fee: 500 per regular, 300 per arrear
        double fee = (regularCount * 500.0) + (arrearCount * 300.0);
        registration.setTotalFee(fee);
        registration.setRegistrationStatus("REGISTERED");
        registration.setRegistrationDate(new Date());

        return registrationRepository.save(registration);
    }

    public ExamRegistration getRegistrationByStudentId(Long studentId){
        return registrationRepository.findByStudentId(studentId).orElse(null);
    }
}