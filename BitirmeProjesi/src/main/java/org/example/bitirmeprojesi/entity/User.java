package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;
import java.math.BigInteger;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Getter
@Setter
@ToString
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ToString.Exclude
    private boolean registered=false;

    @Column(name="password")
    private String password;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @ToString.Exclude
    private Role role = Role.USER;


}
