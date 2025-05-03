package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.ProductElastic;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ProductElasticRepository extends ElasticsearchRepository<ProductElastic,Long> {


    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"name.fuzzy^1.5\", \"description\"], \"fuzziness\": \"AUTO\" }}")
    List<ProductElastic> findByAutocomplete(String query);


    @Query("{\"bool\": {\"should\": [ {\"match\": {\"name\": {\"query\": \"?0\", \"fuzziness\": \"AUTO\"}}}, {\"match\": {\"description\": {\"query\": \"?1\", \"fuzziness\": \"AUTO\"}}} ]}}")
    List<ProductElastic> findByNameOrDescription(String name, String description);


    @Query("{ " +
            "\"bool\": { " +
            "   \"should\": [ " +
            "       { \"match\": { \"category\": \"?0\" } }, " +
            "       { \"match\": { \"name\": \"?1\" } } " +
            "   ], " +
            "   \"filter\": [ " +
            "       { \"range\": { \"price\": { \"gte\": \"?2\", \"lte\": \"?3\" } } } " +
            "   ] " +
            "} }")
    List<ProductElastic> searchByFilters(Integer category, String name, Double minPrice, Double maxPrice);
}
