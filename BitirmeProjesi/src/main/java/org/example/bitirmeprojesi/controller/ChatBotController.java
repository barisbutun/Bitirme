package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.AnswerDto;
import org.example.bitirmeprojesi.dto.QuestionDto;
import org.example.bitirmeprojesi.service.ChatBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    @GetMapping("/v1/answers")
    public ResponseEntity<String> answer(@RequestBody AnswerDto answerDto) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/v1/question")
    public ResponseEntity<String> question(@RequestBody QuestionDto questionDto) throws Exception {
        return ResponseEntity.ok(chatBotService.sendMessage(questionDto));

    }


}
