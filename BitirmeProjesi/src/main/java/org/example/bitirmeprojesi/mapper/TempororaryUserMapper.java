package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.TemproraryUserDto;
import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TempororaryUserMapper {

     TemproraryUser toEntity(final TemproraryUserDto temproraryUserDto);

     TemproraryUserDto toDto(final TemproraryUser temproraryUser);

}
