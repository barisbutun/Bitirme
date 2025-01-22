package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "temprorary_user")
public class TemproraryUser implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "email",nullable = false,unique = true)
    private String email;

    @Column(name = "code")
    private String code;

    @Column(nullable = false,updatable = false)
    private LocalDateTime codeGeneratedAt;

    @Column(nullable = false)
    private boolean isVerified=false;

    @PrePersist
    public void prePersist() {
        this.codeGeneratedAt = LocalDateTime.now();
    }


}
