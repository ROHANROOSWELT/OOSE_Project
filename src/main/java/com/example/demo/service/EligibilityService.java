package com.example.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Eligibility;
import com.example.demo.repository.EligibilityRepository;

@Service
public class EligibilityService {
    @Autowired private EligibilityRepository eligibilityRepository;

    public int calculateMaxCourses(int arrearCount){
        if (arrearCount == 0)      return 9;
        else if (arrearCount <= 2) return 7;
        else if (arrearCount <= 4) return 5;
        else                       return 3;
    }

    public Eligibility getOrCreateEligibility(Long studentId){
        return eligibilityRepository.findByStudentId(studentId).orElseGet(() -> {
            Eligibility e = new Eligibility();
            e.setStudentId(studentId);
            e.setArrearCount(0);
            e.setArrearSubjects("");
            e.setEligibilityStatus("ELIGIBLE");
            e.setMaxCoursesAllowed(9);
            return eligibilityRepository.save(e);
        });
    }

    public Eligibility getEligibilityByStudentId(Long studentId){
        Eligibility e = eligibilityRepository.findByStudentId(studentId).orElse(null);
        if(e == null) return getOrCreateEligibility(studentId);
        e.setMaxCoursesAllowed(calculateMaxCourses(e.getArrearCount()));
        e.setEligibilityStatus(e.getArrearCount() <= 6 ? "ELIGIBLE" : "NOT_ELIGIBLE");
        return e;
    }
}
