package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.TemporaryUserDto;
import org.example.bitirmeprojesi.entity.TemporaryUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TempororaryUserMapper {

     TemporaryUser toEntity(final TemporaryUserDto temporaryUserDto);

     TemporaryUserDto toDto(final TemporaryUser temporaryUser);

}
