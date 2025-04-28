package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.PaymentDto;
import org.example.bitirmeprojesi.entity.Payment;
import org.mapstruct.*;


import java.util.List;
@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaymentMapper {

  @Mapping(source = "order.id",target ="orderId")
  PaymentDto toDto(final Payment payment);

  @Mapping(source="orderId",target="order.id")
  Payment toEntity(final PaymentDto paymentDto);

  List<PaymentDto> toDtoList(final List<Payment> payments);


  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void update(final PaymentDto paymentDto,@MappingTarget final Payment payment);




}




