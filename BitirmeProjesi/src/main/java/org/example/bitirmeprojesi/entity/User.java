package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.bitirmeprojesi.enums.Role;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Getter
@Setter
@ToString
public class User implements Serializable {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name")
    private String name;

    @ToString.Exclude
    private boolean registered=false;

    @Column(name="password")
    private String password;

    @Column(name = "email",unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @ToString.Exclude
    private Role role = Role.USER;

    @OneToMany(mappedBy = "user")
    private List<OrderItem> orderItems;


}
