package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name="STUDENT")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="STUDENT_ID")
    private Long studentId;

    @Column(name="REGISTER_NO", unique=true, nullable=false)
    private String registerNo;

    @Column(name="STUDENT_NAME", nullable=false)
    private String name;

    @Column(name="DEPARTMENT")
    private String department;

    @Column(name="DEGREE")
    private String degree;

    @Column(name="SEMESTER")
    private int semester;

    @Column(name="STUDY_YEAR")
    private int year;

    @Column(name="PASSWORD", nullable=false)
    private String password;

    @Column(name="PHONE")
    private String phone;

    @Column(name="EMAIL")
    private String email;

    @Column(name="PROFILE_PHOTO", columnDefinition="TEXT")
    private String profilePhoto;

    public Long getStudentId(){ return studentId; }
    public void setStudentId(Long id){ this.studentId = id; }
    public String getRegisterNo(){ return registerNo; }
    public void setRegisterNo(String r){ this.registerNo = r; }
    public String getName(){ return name; }
    public void setName(String n){ this.name = n; }
    public String getDepartment(){ return department; }
    public void setDepartment(String d){ this.department = d; }
    public String getDegree(){ return degree; }
    public void setDegree(String d){ this.degree = d; }
    public int getSemester(){ return semester; }
    public void setSemester(int s){ this.semester = s; }
    public int getYear(){ return year; }
    public void setYear(int y){ this.year = y; }
    public String getPassword(){ return password; }
    public void setPassword(String p){ this.password = p; }
    public String getPhone(){ return phone; }
    public void setPhone(String p){ this.phone = p; }
    public String getEmail(){ return email; }
    public void setEmail(String e){ this.email = e; }
    public String getProfilePhoto(){ return profilePhoto; }
    public void setProfilePhoto(String p){ this.profilePhoto = p; }
}
