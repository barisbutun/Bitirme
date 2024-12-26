package org.example.bitirmeprojesi.entity;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductElastic {


    @Id
    @Field(type = FieldType.Long, name = "id")
    private Long id;

    @Field(type = FieldType.Text, name = "description")
    private String description;

    @Field(type = FieldType.Text, name = "name")
    private String name;

    @Field(type = FieldType.Double, name = "price")
    private double price;

    @Field(type = FieldType.Keyword, name = "stockState")
    private String stockState;

    @Field(type = FieldType.Long, name = "categoryId")
    private Long categoryId;

    @Field(type = FieldType.Integer, name = "quantity")
    private Integer quantity;



}
