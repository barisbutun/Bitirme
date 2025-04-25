package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.DeliveryStatus;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Delivery {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "follow_number")
    private String followNumber;

    @Column(name = "company_name")
    private String companyName="Fashion Design";

    @Column(name = "delivery_state")
    private DeliveryStatus deliveryState;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;


    @PrePersist
    public void prePersist() {
        this.deliveryDate = LocalDateTime.now();
    }

}
