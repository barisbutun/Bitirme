package org.example.bitirmeprojesi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor(force = true)
public class QueryRequest implements Serializable {

    String query;

}
