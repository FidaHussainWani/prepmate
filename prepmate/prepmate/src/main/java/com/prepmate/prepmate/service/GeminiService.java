
package com.prepmate.prepmate.service;

import com.google.genai.types.Schema;

import java.util.List;
import java.util.Map;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService() {
        this.client = new Client();
    }

    public String generate(String prompt) {

        System.out.println("================================");
        System.out.println("GEMINI REQUEST STARTED");
        System.out.println("================================");

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3.6-flash",
                            prompt,
                            null
                    );

            System.out.println("GEMINI RESPONSE RECEIVED");

            String result = response.text();

            System.out.println("AI RESULT:");
            System.out.println(result);

            if (result == null || result.isBlank()) {
                throw new RuntimeException(
                        "Gemini returned an empty response"
                );
            }

            return result;

        } catch (Exception e) {

            System.out.println("================================");
            System.out.println("GEMINI ERROR");
            System.out.println("================================");

            e.printStackTrace();

            throw new RuntimeException(
                    "Gemini API failed: " + e.getMessage(),
                    e
            );
        }
    }
    public String generateQuizJson(String prompt) {

    try {

        Schema quizSchema =
                Schema.builder()
                        .type("OBJECT")
                        .properties(
                                Map.of(
                                        "questions",
                                        Schema.builder()
                                                .type("ARRAY")
                                                .items(
                                                        Schema.builder()
                                                                .type("OBJECT")
                                                                .properties(
                                                                        Map.of(
                                                                                "question",
                                                                                Schema.builder()
                                                                                        .type("STRING")
                                                                                        .build(),

                                                                                "options",
                                                                                Schema.builder()
                                                                                        .type("ARRAY")
                                                                                        .items(
                                                                                                Schema.builder()
                                                                                                        .type("STRING")
                                                                                                        .build()
                                                                                        )
                                                                                        .build(),

                                                                                "correctAnswer",
                                                                                Schema.builder()
                                                                                        .type("STRING")
                                                                                        .build(),

                                                                                "explanation",
                                                                                Schema.builder()
                                                                                        .type("STRING")
                                                                                        .build()
                                                                        )
                                                                )
                                                                .required(
                                                                        List.of(
                                                                                "question",
                                                                                "options",
                                                                                "correctAnswer",
                                                                                "explanation"
                                                                        )
                                                                )
                                                                .build()
                                                )
                                                .build()
                                )
                        )
                        .required(List.of("questions"))
                        .build();

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .responseSchema(quizSchema)
                        .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        config
                );

        String result = response.text();

        if (result == null || result.isBlank()) {
            throw new RuntimeException(
                    "Gemini returned an empty quiz response"
            );
        }

        return result;

    } catch (Exception e) {

        e.printStackTrace();

        throw new RuntimeException(
                "Failed to generate quiz: "
                        + e.getMessage(),
                e
        );
    }
}

public String generateFlashcardsJson(String prompt) {

    try {

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        String result = response.text();

        if (result == null || result.isBlank()) {
            throw new RuntimeException(
                    "Gemini returned an empty flashcard response"
            );
        }

        return result;

    } catch (Exception e) {

        e.printStackTrace();

        throw new RuntimeException(
                "Failed to generate flashcards: "
                        + e.getMessage(),
                e
        );
    }
}
}