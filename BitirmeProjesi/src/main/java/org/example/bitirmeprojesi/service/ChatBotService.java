package org.example.bitirmeprojesi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.example.bitirmeprojesi.dto.QuestionDto;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONException;
import org.json.JSONArray;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final RestTemplate restTemplate;
    private final String RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook";


    public String sendMessage(QuestionDto questionDto) throws JsonProcessingException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("sender", "user");
        requestBody.put("message", questionDto.getQuestion());

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpHeaders headers = getHttpHeaders();
        headers.setContentLength(jsonBody.getBytes(StandardCharsets.UTF_8).length);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(RASA_API_URL, entity, String.class);

        System.out.println("Response body:"+extractMessage(response.getBody()));
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




    private static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }


}
