package org.example.bitirmeprojesi.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.bitirmeprojesi.enums.Role;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Getter
@Setter
@ToString
public class User implements Serializable, UserDetails {
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

    @Column(name="user_name",unique = true)
    private String userName;

    @ToString.Exclude
    private boolean registered = true;

    @Column(name = "password")
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @ToString.Exclude
    private Role role = Role.USER;

    @Column(name = "phone", unique = true, nullable = true)
    private String phone;

    @Column(name = "address")
    private String address;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Orders> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Favourite> favourites;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.role != null ? List.of(new SimpleGrantedAuthority(this.role.name())) : List.of();
    }
    @Override
    public String getUsername() {
        return this.getEmail();
    }
}
