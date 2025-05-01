package org.example.bitirmeprojesi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.entity.TemporaryUser;

import java.io.Serializable;

/**
 * DTO for {@link TemporaryUser}
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TemporaryUserDto implements Serializable {
    private String email;
    private String code;
}