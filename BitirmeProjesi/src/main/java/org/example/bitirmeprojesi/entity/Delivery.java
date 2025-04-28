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

    @Column(name = "company_name")
    private String companyName="Fashion Design";

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Orders order;

    @Column(name = "delivery_state")
    private DeliveryStatus deliveryState;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;


    @PrePersist
    public void prePersist() {
        this.deliveryDate = LocalDateTime.now();
    }

}
