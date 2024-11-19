package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.ImageDto;
import org.example.bitirmeprojesi.entity.Image;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ImageMapper {

    Image toEntity(final ImageDto imageDto);

    ImageDto toDto(final Image image);

    List<ImageDto> toDtoList(final List<Image> imageList);

    void update(final ImageDto imageDto, @MappingTarget final Image image);

}
