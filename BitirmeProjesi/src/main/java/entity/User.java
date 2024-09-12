package entity;

import enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Getter
@Setter
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ToString.Exclude
    private boolean registered=false;

    private String password;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @ToString.Exclude
    private Role role = Role.USER;


}
