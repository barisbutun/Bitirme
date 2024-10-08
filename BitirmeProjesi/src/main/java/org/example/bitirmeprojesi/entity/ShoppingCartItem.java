package org.example.bitirmeprojesi.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="shopping_cart_item")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShoppingCartItem {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @Column(name="quantity", nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

}
