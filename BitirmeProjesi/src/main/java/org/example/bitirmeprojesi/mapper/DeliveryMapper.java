package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.DeliveryDto;
import org.example.bitirmeprojesi.entity.Delivery;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DeliveryMapper {


    Delivery toEntity(final DeliveryDto deliveryDto);

    DeliveryDto toDto(final Delivery delivery);

    List<DeliveryDto> toDtoList(final List<Delivery> deliveryList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final DeliveryDto deliveryDto, @MappingTarget final Delivery delivery);
}
