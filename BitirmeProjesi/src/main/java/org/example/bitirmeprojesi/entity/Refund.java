package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.example.bitirmeprojesi.enums.RefundStatus;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Slf4j
public class Refund {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false)
    private UUID id;


    @Column(name = "refund_amount", nullable = false)
    private double refundAmount;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Orders orders;


    @OneToMany(mappedBy = "refund" ,cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;


    @Column(name = "refund_reason", nullable = false)
    private String refundReason;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


    private LocalDateTime refundDate;

    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @PrePersist
    public void prePersist() {
        refundDate = LocalDateTime.now();

    }

}
