package org.example.bitirmeprojesi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.TemproraryUser}
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TemproraryUserDto implements Serializable {
    private String email;
    private String code;
}