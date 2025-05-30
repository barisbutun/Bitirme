package org.example.bitirmeprojesi.entity;

import lombok.*;
import org.example.bitirmeprojesi.enums.Gender;
import org.example.bitirmeprojesi.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Document(indexName = "users_autocomplete")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserElastic {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Boolean)
    private boolean registered;

    @Field(type = FieldType.Text, index = false)
    private String password;

    @Field(type = FieldType.Keyword)
    private String email;

    @Field(type = FieldType.Keyword)
    private Role role;

    @Field(type = FieldType.Keyword)
    private String phone;

    @Field(type = FieldType.Text)
    private String address;

    @Field(type = FieldType.Double)
    private Double balance;

    @Field(type = FieldType.Keyword)
    private Gender gender;
}
