package com.example.demo.model;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="EXAM_REGISTRATION")
public class ExamRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="REGISTRATION_ID")
    private Long registrationId;

    @Column(name="STUDENT_ID", nullable=false)
    private Long studentId;

    @Column(name="EXAM_TYPE")
    private String examType;

    @Column(name="REGISTRATION_STATUS")
    private String registrationStatus;

    @Column(name="REGISTERED_COURSES", length=2000)
    private String registeredCourses;

    @Column(name="ARREAR_COURSES", length=2000)
    private String arrearCourses;

    @Column(name="TOTAL_FEE")
    private double totalFee;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="REGISTRATION_DATE")
    private Date registrationDate;

    public Long getRegistrationId(){ return registrationId; }
    public void setRegistrationId(Long id){ this.registrationId = id; }
    public Long getStudentId(){ return studentId; }
    public void setStudentId(Long id){ this.studentId = id; }
    public String getExamType(){ return examType; }
    public void setExamType(String e){ this.examType = e; }
    public String getRegistrationStatus(){ return registrationStatus; }
    public void setRegistrationStatus(String s){ this.registrationStatus = s; }
    public String getRegisteredCourses(){ return registeredCourses; }
    public void setRegisteredCourses(String c){ this.registeredCourses = c; }
    public String getArrearCourses(){ return arrearCourses; }
    public void setArrearCourses(String c){ this.arrearCourses = c; }
    public double getTotalFee(){ return totalFee; }
    public void setTotalFee(double f){ this.totalFee = f; }
    public Date getRegistrationDate(){ return registrationDate; }
    public void setRegistrationDate(Date d){ this.registrationDate = d; }
}
