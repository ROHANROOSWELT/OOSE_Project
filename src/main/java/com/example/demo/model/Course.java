package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name="COURSE")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="COURSE_ID")
    private Long courseId;

    @Column(name="COURSE_CODE", unique=true)
    private String courseCode;

    @Column(name="COURSE_NAME")
    private String courseName;

    @Column(name="SEMESTER")
    private int semester;

    @Column(name="CREDITS")
    private int credits;

    @Column(name="EXAM_DATE")
    private String examDate;

    @Column(name="EXAM_SESSION")
    private String examSession;

    @Column(name="COURSE_TYPE")
    private String courseType;

    public Long getCourseId(){ return courseId; }
    public void setCourseId(Long id){ this.courseId = id; }
    public String getCourseCode(){ return courseCode; }
    public void setCourseCode(String c){ this.courseCode = c; }
    public String getCourseName(){ return courseName; }
    public void setCourseName(String c){ this.courseName = c; }
    public int getSemester(){ return semester; }
    public void setSemester(int s){ this.semester = s; }
    public int getCredits(){ return credits; }
    public void setCredits(int c){ this.credits = c; }
    public String getExamDate(){ return examDate; }
    public void setExamDate(String d){ this.examDate = d; }
    public String getExamSession(){ return examSession; }
    public void setExamSession(String s){ this.examSession = s; }
    public String getCourseType(){ return courseType; }
    public void setCourseType(String t){ this.courseType = t; }
}
