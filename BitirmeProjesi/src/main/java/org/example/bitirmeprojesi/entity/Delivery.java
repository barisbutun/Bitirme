package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.dto.DeliveryDto;
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

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Orders order;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "delivery_state")
    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryState;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.deliveryDate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt= LocalDateTime.now();
    }

    public DeliveryDto toDto() {
        DeliveryDto deliveryDto = new DeliveryDto();
        deliveryDto.setId(this.id);
        deliveryDto.setCompanyName(this.companyName);
        deliveryDto.setDeliveryState(this.deliveryState);
        deliveryDto.setDeliveryDate(this.deliveryDate);
        deliveryDto.setUpdatedAt(this.updatedAt);
        return deliveryDto;
    }
}
