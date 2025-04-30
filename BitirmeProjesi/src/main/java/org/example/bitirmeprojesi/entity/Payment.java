package org.example.bitirmeprojesi.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="payment")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false)
    private UUID id;


    @Enumerated(EnumType.STRING)
    private PaymentState paymentState;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @JsonBackReference
    @OneToOne(mappedBy="payment", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private Orders order;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


    @PrePersist
    public void prePersist() {
        paymentDate = LocalDateTime.now();
    }

}
