package org.example.bitirmeprojesi.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.enums.Size;


import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
@Getter
@Setter
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    @Column(name = "price")
    private double price;

    @ElementCollection
    @CollectionTable(name = "product_quantities", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @Column(name = "stock")
    private Map<Size, Integer> quantity = new HashMap<>();

    @Column(name = "stock_state")
    @Enumerated(EnumType.STRING)
    private StockState stockState;

    @Column(name="review_count")
    private int reviewCount=0;

    @Column(name="favourite_count")
    private int favouriteCount=0;

    @Column(name="total_rating")
    private int totalRating=0;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    private Size size;

    @Column(name = "average_rating")
    private double averageRating=0.0;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ShoppingCartItem> shoppingCartItems;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Image> images;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Favourite> favourites;


    @PrePersist
    public void prePersist() {
        createdDate = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Product product = (Product) o;

        return id != null && id.equals(product.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }


}
