package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.entity.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {

    CategoryDto toDto(final Category category);

    Category toEntity(final CategoryDto categoryDto);

    List<CategoryDto> toDtoList(final List<Category> categoryList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final CategoryDto categoryDto, @MappingTarget final Category category);

}
