package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.CommentDto;
import org.example.bitirmeprojesi.entity.Comment;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CommentMapper {

    @Mapping(target = "productId", source = "product.id")
    CommentDto toDto(final Comment comment);

    @Mapping(target = "product.id", source = "productId")
    Comment toEntity(final CommentDto commentDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final CommentDto commentDto, @MappingTarget final Comment comment);


}
