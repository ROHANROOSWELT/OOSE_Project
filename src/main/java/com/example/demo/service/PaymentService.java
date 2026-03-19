package com.example.demo.service;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Payment;
import com.example.demo.model.ExamRegistration;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.RegistrationRepository;

@Service
public class PaymentService {
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private RegistrationRepository registrationRepository;

    public Payment makePayment(Payment payment){
        ExamRegistration reg = registrationRepository.findById(payment.getRegistrationId())
            .orElseThrow(() -> new RuntimeException("Registration not found"));
        if(!"REGISTERED".equals(reg.getRegistrationStatus()))
            throw new RuntimeException("Invalid registration status");
        if(payment.getAccountNo() == null || payment.getAccountNo().length() < 9)
            throw new RuntimeException("Invalid account number. Must be at least 9 digits.");
        String txnId = "TXN" + System.currentTimeMillis();
        payment.setTransactionId(txnId);
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(new Date());
        if(payment.getAmount() == 0) payment.setAmount(reg.getTotalFee());
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByRegistrationId(Long registrationId){
        return paymentRepository.findByRegistrationId(registrationId).orElse(null);
    }
}
