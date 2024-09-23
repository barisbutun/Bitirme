package org.example.bitirmeprojesi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;


@Entity
@Table(name="cancellation")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cancellation implements Serializable {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name="description")
    private String description;

    @Column(name="cancel_state")
    private boolean cancelState;


}
