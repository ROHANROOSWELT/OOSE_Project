package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name="ELIGIBILITY")
public class Eligibility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ELIGIBILITY_ID")
    private Long eligibilityId;

    @Column(name="STUDENT_ID")
    private Long studentId;

    @Column(name="ARREAR_COUNT")
    private int arrearCount;

    @Column(name="ARREAR_SUBJECTS", length=2000)
    private String arrearSubjects;

    @Column(name="ELIGIBILITY_STATUS")
    private String eligibilityStatus;

    @Column(name="MAX_COURSES_ALLOWED")
    private int maxCoursesAllowed;

    public Long getEligibilityId(){ return eligibilityId; }
    public void setEligibilityId(Long id){ this.eligibilityId = id; }
    public Long getStudentId(){ return studentId; }
    public void setStudentId(Long id){ this.studentId = id; }
    public int getArrearCount(){ return arrearCount; }
    public void setArrearCount(int a){ this.arrearCount = a; }
    public String getArrearSubjects(){ return arrearSubjects; }
    public void setArrearSubjects(String a){ this.arrearSubjects = a; }
    public String getEligibilityStatus(){ return eligibilityStatus; }
    public void setEligibilityStatus(String s){ this.eligibilityStatus = s; }
    public int getMaxCoursesAllowed(){ return maxCoursesAllowed; }
    public void setMaxCoursesAllowed(int m){ this.maxCoursesAllowed = m; }
}
