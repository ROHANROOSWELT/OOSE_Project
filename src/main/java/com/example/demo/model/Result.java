package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name="RESULT")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="RESULT_ID")
    private Long resultId;

    @Column(name="STUDENT_ID", nullable=false)
    private Long studentId;

    @Column(name="COURSE_NAME")
    private String courseName;

    @Column(name="SEMESTER")
    private int semester;

    @Column(name="MARKS")
    private int marks;

    @Column(name="STATUS") // PASS or FAIL
    private String status;

    public Long getResultId(){ return resultId; }
    public void setResultId(Long id){ this.resultId = id; }

    public Long getStudentId(){ return studentId; }
    public void setStudentId(Long id){ this.studentId = id; }

    public String getCourseName(){ return courseName; }
    public void setCourseName(String c){ this.courseName = c; }

    public int getSemester(){ return semester; }
    public void setSemester(int s){ this.semester = s; }

    public int getMarks(){ return marks; }
    public void setMarks(int m){
        this.marks = m;
        this.status = (m >= 50) ? "PASS" : "FAIL";
    }

    public String getStatus(){ return status; }
    public void setStatus(String s){ this.status = s; }
}
