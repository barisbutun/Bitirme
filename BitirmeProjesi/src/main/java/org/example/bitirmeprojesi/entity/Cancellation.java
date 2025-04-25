package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;
import java.time.LocalDateTime;


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

    @Column(name = "cancel_state")
    private boolean cancelState;

    @Column(name = "cancel_date")
    private LocalDateTime cancelDate;

    @Column(name = "cancelled_by")
    private Role cancelledBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Orders order;


    @PrePersist
    public void prePersist() {
        cancelDate = LocalDateTime.now();
    }

}
