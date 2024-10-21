package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "favourite")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Favourite implements Serializable {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private long id;


    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "user_id", referencedColumnName = "id"),
            @JoinColumn(name = "user_name", referencedColumnName = "name")
    })


    private User user;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "product_id", referencedColumnName = "id"),
            @JoinColumn(name = "product_name", referencedColumnName = "name")
    })
    private Product product;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "category_id", referencedColumnName = "id"),
            @JoinColumn(name = "category_name", referencedColumnName = "name")
    })
    private Category category;
}
