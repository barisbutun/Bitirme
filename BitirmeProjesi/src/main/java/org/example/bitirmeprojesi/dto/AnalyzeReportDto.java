package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.AnalyzeReport}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class AnalyzeReportDto implements Serializable {
    @JsonIgnore
    private Long id;
    @JsonProperty("description")
    private String description;
}