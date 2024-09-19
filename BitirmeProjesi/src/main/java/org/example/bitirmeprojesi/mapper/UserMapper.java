package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserDto toDto(final User user);

    User toEntity(final UserDto userDto);

    List<UserDto> toDtoList(final List<User> userList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void Update(final UserDto userDto,@MappingTarget final User user);

}
