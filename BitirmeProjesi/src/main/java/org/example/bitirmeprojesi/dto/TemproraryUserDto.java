package org.example.bitirmeprojesi.dto;

import lombok.*;

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