package com.example.demo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="HALL_TICKET")
public class HallTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="HALL_TICKET_ID")
    private Long hallTicketId;

    @Column(name="REGISTRATION_ID", nullable=false)
    private Long registrationId;

    @Column(name="EXAM_SESSION")
    private String examSession; // APR/MAY 2026

    @Column(name="EXAM_CENTER")
    private String examCenter;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="ISSUE_DATE")
    private Date issueDate;

    @Column(name="HALL_TICKET_STATUS")
    private String hallTicketStatus;

    public Long getHallTicketId(){ return hallTicketId; }
    public void setHallTicketId(Long id){ this.hallTicketId = id; }

    public Long getRegistrationId(){ return registrationId; }
    public void setRegistrationId(Long id){ this.registrationId = id; }

    public String getExamSession(){ return examSession; }
    public void setExamSession(String s){ this.examSession = s; }

    public String getExamCenter(){ return examCenter; }
    public void setExamCenter(String s){ this.examCenter = s; }

    public Date getIssueDate(){ return issueDate; }
    public void setIssueDate(Date d){ this.issueDate = d; }

    public String getHallTicketStatus(){ return hallTicketStatus; }
    public void setHallTicketStatus(String s){ this.hallTicketStatus = s; }
}
