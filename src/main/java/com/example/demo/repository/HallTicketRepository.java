package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.HallTicket;
import java.util.Optional;

public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {
    Optional<HallTicket> findByRegistrationId(Long registrationId);
}
