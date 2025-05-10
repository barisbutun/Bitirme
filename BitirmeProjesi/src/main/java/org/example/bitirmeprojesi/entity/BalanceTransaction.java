package org.example.bitirmeprojesi.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "balance_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BalanceTransaction {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    private Double amount;

    private String description;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @PrePersist
    public void prePersist() {
        transactionDate = LocalDateTime.now();
    }


}
