package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<?> makePayment(@RequestBody Payment payment){
        try {
            Payment saved = paymentService.makePayment(payment);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<?> getPayment(@PathVariable Long registrationId){
        Payment p = paymentService.getPaymentByRegistrationId(registrationId);
        if(p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }
}
