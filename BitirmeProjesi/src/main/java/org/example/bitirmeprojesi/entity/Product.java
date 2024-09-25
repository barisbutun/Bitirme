package org.example.bitirmeprojesi.entity;


import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
@Data
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private double price;

    @Column(name = "stock_state")
    private boolean stockState;

    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems;


}
