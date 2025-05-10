package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.QuestionDto;
import org.example.bitirmeprojesi.dto.RecommendProductDto;
import org.example.bitirmeprojesi.service.ChatBotService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    @PostMapping("/v1/question")
    public ResponseEntity<String> question(@RequestBody QuestionDto questionDto) throws Exception {
        return ResponseEntity.ok(chatBotService.sendMessage(questionDto));

    }
    @GetMapping("/v1/recommend")
    public ResponseEntity<RecommendProductDto> recommend(){
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(chatBotService.getProductRecommendation(userId));
    }



}
