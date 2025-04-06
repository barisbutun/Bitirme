package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.ReviewDto;
import org.example.bitirmeprojesi.entity.Review;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {

    @Mapping(source = "product.id", target = "productId")
    ReviewDto toDto(final Review review);

    @Mapping(source = "productId", target = "product.id")
    Review toEntity(final ReviewDto reviewDto);

    List<ReviewDto> toDtoList(final List<Review> review);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final ReviewDto reviewDto, @MappingTarget final Review review);

}
