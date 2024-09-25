package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "follow_number")
    private String followNumber;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "delivery_state")
    private boolean deliveryState;

    @Column(name = "delivery_date")
    private Date deliveryDate;

}
