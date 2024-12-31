package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.ProductElastic;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ProductElasticRepository extends ElasticsearchRepository<ProductElastic,Long> {


    @Query("{\"multi_match\": {\"query\": \"#{[0]}\", \"fields\": [\"name^2\", \"description\"], \"fuzziness\": \"AUTO\", \"type\": \"bool_prefix\"}}")
    List<ProductElastic> findByAutocomplete(String query);



    @Query("{\"bool\": {\"should\": [ {\"match\": {\"name\": {\"query\": \"?0\", \"fuzziness\": \"AUTO\"}}}, {\"match\": {\"description\": {\"query\": \"?1\", \"fuzziness\": \"AUTO\"}}} ]}}")
    List<ProductElastic> findByNameOrDescription(String name, String description);

}
