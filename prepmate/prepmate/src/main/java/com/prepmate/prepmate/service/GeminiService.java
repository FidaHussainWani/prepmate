
package com.prepmate.prepmate.service;

import com.google.genai.Client;
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
}