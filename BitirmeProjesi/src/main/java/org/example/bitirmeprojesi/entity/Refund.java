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


    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "order_item_id")
    private List<OrderItem> orderItems;


    @Column(name = "refund_reason", nullable = false)
    private String refundReason;

    private LocalDateTime refundDate;

    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @PrePersist
    public void prePersist() {
        refundDate = LocalDateTime.now();
        double price = 0.0;
        for (OrderItem orderItem : orderItems) {

            price+=orderItem.getQuantity()*orderItem.getProduct().getPrice();

        }
        refundAmount = price;
    }

}
