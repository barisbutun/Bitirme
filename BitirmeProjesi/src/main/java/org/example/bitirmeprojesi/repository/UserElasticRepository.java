package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.entity.UserElastic;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.UUID;

public interface UserElasticRepository extends ElasticsearchRepository<UserElastic, UUID> {

    @Query("""
{
  "bool": {
    "should": [
      {
        "match": {
          "name": {
            "query": "?0",
            "fuzziness": "AUTO"
          }
        }
      },
      {
        "match": {
          "email": {
            "query": "?0",
            "fuzziness": "AUTO"
          }
        }
      }
    ]
  }
}
""")
    List<UserElastic> findByNameOrEmail(String keyword);


}
