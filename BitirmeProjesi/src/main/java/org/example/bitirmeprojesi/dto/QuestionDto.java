package org.example.bitirmeprojesi.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class QuestionDto implements Serializable {
    @JsonProperty("message")
    String question;
}
