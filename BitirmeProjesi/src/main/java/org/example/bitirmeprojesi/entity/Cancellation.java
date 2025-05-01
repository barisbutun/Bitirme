package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "cancellation")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cancellation implements Serializable {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;


    @Column(name = "cancel_date")
    private LocalDateTime cancelDate;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @OneToMany(mappedBy = "cancellation", cascade={CascadeType.PERSIST,CascadeType.MERGE})
    private List<OrderItem> orderItems;

    @Column(name = "cancel_amount")
    private double cancelAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


    @PrePersist
    public void prePersist() {
        cancelDate = LocalDateTime.now();
    }

}
