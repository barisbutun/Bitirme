package org.example.bitirmeprojesi.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "analyze_report")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AnalyzeReport {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

}
