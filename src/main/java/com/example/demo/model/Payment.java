package com.example.demo.model;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="PAYMENT")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="PAYMENT_ID")
    private Long paymentId;

    @Column(name="REGISTRATION_ID", nullable=false)
    private Long registrationId;

    @Column(name="AMOUNT")
    private double amount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="PAYMENT_DATE")
    private Date paymentDate;

    @Column(name="PAYMENT_STATUS")
    private String paymentStatus;

    @Column(name="ACCOUNT_NO")
    private String accountNo;

    @Column(name="TRANSACTION_ID")
    private String transactionId;

    public Long getPaymentId(){ return paymentId; }
    public void setPaymentId(Long id){ this.paymentId = id; }
    public Long getRegistrationId(){ return registrationId; }
    public void setRegistrationId(Long id){ this.registrationId = id; }
    public double getAmount(){ return amount; }
    public void setAmount(double a){ this.amount = a; }
    public Date getPaymentDate(){ return paymentDate; }
    public void setPaymentDate(Date d){ this.paymentDate = d; }
    public String getPaymentStatus(){ return paymentStatus; }
    public void setPaymentStatus(String s){ this.paymentStatus = s; }
    public String getAccountNo(){ return accountNo; }
    public void setAccountNo(String a){ this.accountNo = a; }
    public String getTransactionId(){ return transactionId; }
    public void setTransactionId(String t){ this.transactionId = t; }
}
