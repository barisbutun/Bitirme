package org.example.bitirmeprojesi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.dto.QuestionDto;
import org.example.bitirmeprojesi.dto.RecommendProductDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.mapper.ProductMapper;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final RestTemplate restTemplate;
    private final String RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook";
    private final UserRepository userRepository;
    private final ProductMapper productMapper;


    public String sendMessage(QuestionDto questionDto) throws JsonProcessingException {
        String token = JwtUtil.getToken();

        Map<String, Object> requestBody = new HashMap<>();

        Map<String, String> metadata = new HashMap<>();
        if(!(token ==null)){
            metadata.put("Authorization", "Bearer " + token);
            requestBody.put("sender", JwtUtil.getUserIdFromToken().toString());
        }
        else{
            requestBody.put("sender", "guest");
        }

        requestBody.put("message", questionDto.getQuestion());
        requestBody.put("metadata", metadata);

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpHeaders headers = getHttpHeaders(jsonBody);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(RASA_API_URL, entity, String.class);


        return extractMessage(response.getBody());
    }





    private String extractMessage(String responseBody) {
        try {
            JSONArray jsonArray = new JSONArray(responseBody);
            if (jsonArray.length() > 0) {
                return jsonArray.getJSONObject(0).getString("text");
            }
        } catch (JSONException e) {
            return "Üzgünüm, yanıt oluşturulamadı.";
        }
        return "Üzgünüm, bir sorun oluştu.";
    }




    private static HttpHeaders getHttpHeaders(String jsonBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentLength(jsonBody.getBytes(StandardCharsets.UTF_8).length);
        if(!(JwtUtil.getToken() == null)){
            headers.setBearerAuth(JwtUtil.getToken());
        }
        return headers;
    }



    public RecommendProductDto getProductRecommendation(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        // Favorilerden ürünleri topla
        List<ProductDto> productsFavourites = user.getFavourites().stream()
                .map(favourite -> productMapper.toDto(favourite.getProduct()))
                .collect(Collectors.toMap(
                        ProductDto::getId,
                        productDto -> productDto,
                        (existing, duplicate) -> {
                            existing.setSameCount(existing.getSameCount() + 1);
                            return existing;
                        }
                ))
                .values()
                .stream()
                .toList();

        // İncelemelerden ürünleri topla
        List<ProductDto> productsReviews = user.getReviews().stream()
                .map(review -> productMapper.toDto(review.getProduct()))
                .collect(Collectors.toMap(
                        ProductDto::getId,
                        productDto -> productDto,
                        (existing, duplicate) -> {
                            existing.setSameCount(existing.getSameCount() + 1);
                            return existing;
                        }
                ))
                .values()
                .stream()
                .toList();

        // Alışveriş sepetinden ürünleri topla
        List<ProductDto> productsShoppingCartItems = user.getShoppingCartItems().stream()
                .map(shoppingCartItem -> productMapper.toDto(shoppingCartItem.getProduct()))
                .collect(Collectors.toMap(
                        ProductDto::getId,
                        productDto -> productDto,
                        (existing, duplicate) -> {
                            existing.setSameCount(existing.getSameCount() + 1);
                            return existing;
                        }
                ))
                .values()
                .stream()
                .toList();

        // Siparişlerden ürünleri topla
        List<ProductDto> productsOrderItems = user.getOrders().stream()
                .flatMap(order -> order.getOrderItems().stream())
                .map(orderItem -> productMapper.toDto(orderItem.getProduct()))
                .collect(Collectors.toMap(
                        ProductDto::getId,
                        productDto -> {
                            productDto.setSameCount(1); // İlk kez ekleniyorsa sameCount 1 olarak ayarlanır
                            return productDto;
                        },
                        (existing, duplicate) -> {
                            existing.setSameCount(existing.getSameCount() + 1); // Aynı ID'ye sahip ürünler için sameCount artırılır
                            return existing;
                        }
                ))
                .values()
                .stream()
                .toList();

        // RecommendProductDto nesnesini oluştur ve doldur
        RecommendProductDto recommendProductDto = new RecommendProductDto();
        recommendProductDto.setName(user.getName());
        recommendProductDto.setRole(user.getRole());
        recommendProductDto.setEmail(user.getEmail());
        recommendProductDto.setPhone(user.getPhone());
        recommendProductDto.setAddress(user.getAddress());
        recommendProductDto.setBalance(user.getBalance());
        recommendProductDto.setFavourites(productsFavourites);
        recommendProductDto.setReviews(productsReviews);
        recommendProductDto.setShoppingCartItems(productsShoppingCartItems);
        recommendProductDto.setOrders(productsOrderItems);

        return recommendProductDto;
    }




}
