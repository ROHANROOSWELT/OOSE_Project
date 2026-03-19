package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name="ADMIN")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ADMIN_ID")
    private Long adminId;

    @Column(name="USERNAME", unique=true, nullable=false)
    private String username;

    @Column(name="PASSWORD", nullable=false)
    private String password;

    @Column(name="FULL_NAME")
    private String fullName;

    public Long getAdminId(){ return adminId; }
    public void setAdminId(Long id){ this.adminId = id; }

    public String getUsername(){ return username; }
    public void setUsername(String u){ this.username = u; }

    public String getPassword(){ return password; }
    public void setPassword(String p){ this.password = p; }

    public String getFullName(){ return fullName; }
    public void setFullName(String f){ this.fullName = f; }
}
