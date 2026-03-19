package com.example.demo.service;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.HallTicket;
import com.example.demo.model.Payment;
import com.example.demo.repository.HallTicketRepository;
import com.example.demo.repository.PaymentRepository;

@Service
public class HallTicketService {

    @Autowired
    private HallTicketRepository hallTicketRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public HallTicket generateHallTicket(Long registrationId){
        Payment payment = paymentRepository.findByRegistrationId(registrationId)
            .orElseThrow(() -> new RuntimeException("Payment not found. Please complete payment first."));

        if(!"SUCCESS".equals(payment.getPaymentStatus())){
            throw new RuntimeException("Payment is not successful. Hall ticket cannot be generated.");
        }

        // Return existing if already generated
        HallTicket existing = hallTicketRepository.findByRegistrationId(registrationId).orElse(null);
        if(existing != null) return existing;

        HallTicket hallTicket = new HallTicket();
        hallTicket.setRegistrationId(registrationId);
        hallTicket.setExamSession("APR/MAY 2026");
        hallTicket.setExamCenter("Loyola-ICAM College of Engineering and Technology, Chennai");
        hallTicket.setIssueDate(new Date());
        hallTicket.setHallTicketStatus("GENERATED");

        return hallTicketRepository.save(hallTicket);
    }

    public HallTicket getHallTicketByRegistrationId(Long registrationId){
        return hallTicketRepository.findByRegistrationId(registrationId).orElse(null);
    }
}
