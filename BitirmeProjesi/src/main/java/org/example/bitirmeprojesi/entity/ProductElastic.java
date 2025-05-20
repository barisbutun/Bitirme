package org.example.bitirmeprojesi.entity;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Map;

@Document(indexName = "products_autocomplete")
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

    @Field(type = FieldType.Keyword, name = "stock_state")
    private String stockState;

    @Field(type = FieldType.Long, name = "category_id")
    private Long categoryId;

    @Field(type = FieldType.Object, name = "quantity")
    private Map<String, Integer> quantity;

}
