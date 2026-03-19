package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.HallTicket;
import com.example.demo.service.HallTicketService;

@RestController
@RequestMapping("/hallticket")
public class HallTicketController {

    @Autowired
    private HallTicketService hallTicketService;

    @PostMapping("/generate/{registrationId}")
    public ResponseEntity<?> generateHallTicket(@PathVariable Long registrationId){
        try {
            HallTicket ht = hallTicketService.generateHallTicket(registrationId);
            return ResponseEntity.ok(ht);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{registrationId}")
    public ResponseEntity<?> getHallTicket(@PathVariable Long registrationId){
        HallTicket ht = hallTicketService.getHallTicketByRegistrationId(registrationId);
        if(ht == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ht);
    }
}
