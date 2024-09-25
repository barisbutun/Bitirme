package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.sql.Time;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class Orders implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name="name")
    private String name;

    @Column(name = "sale_date")
    private Time saleDate;

    @Column(name = "sum_price")
    private Integer sumPrice;

    @ToString.Exclude
    private StockState stockState=StockState.AVAILABLE;

    @Column(name = "payment_state")
    private PaymentState paymentState;

    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems;



}