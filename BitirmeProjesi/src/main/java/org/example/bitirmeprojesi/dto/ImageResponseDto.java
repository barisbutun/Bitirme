package org.example.bitirmeprojesi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Image}
 */


@AllArgsConstructor
@Getter
@Setter
public class ImageResponseDto implements Serializable {

    private String response;
}