package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.ai.AIResponse;
import com.prepmate.prepmate.dto.ai.AISummaryRequest;
import com.prepmate.prepmate.service.AIService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import com.prepmate.prepmate.dto.ai.AIAskRequest;
import com.prepmate.prepmate.dto.ai.AIQuizRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/summarize")
    public AIResponse summarizeNote(
            @Valid @RequestBody AISummaryRequest request,
            Authentication authentication) {

        String result = aiService.summarizeNote(
                request.getNoteId(),
                authentication.getName()
        );

        return new AIResponse(result);
    }
    // @PostMapping("/ask")
    // public AIResponse askQuestion(
    //         @Valid @RequestBody AIAskRequest request,
    //         Authentication authentication) {

    //     String result = aiService.askQuestion(
    //             request.getNoteId(),
    //             request.getQuestion(),
    //             authentication.getName()
    //     );

    //     return new AIResponse(result);
    // }

    @PostMapping("/ask")
public AIResponse askQuestion(
        @Valid @RequestBody AIAskRequest request,
        Authentication authentication) {

    System.out.println("========== ASK CONTROLLER REACHED ==========");
    System.out.println("User: " + authentication.getName());
    System.out.println("Note ID: " + request.getNoteId());
    System.out.println("Question: " + request.getQuestion());

    String result = aiService.askQuestion(
            request.getNoteId(),
            request.getQuestion(),
            authentication.getName()
    );

    return new AIResponse(result);
}

    @PostMapping("/quiz")
    public AIResponse generateQuiz(
            @Valid @RequestBody AIQuizRequest request,
            Authentication authentication) {

        String result = aiService.generateQuiz(
                request.getNoteId(),
                request.getNumberOfQuestions(),
                authentication.getName()
        );

        return new AIResponse(result);
    }
}





