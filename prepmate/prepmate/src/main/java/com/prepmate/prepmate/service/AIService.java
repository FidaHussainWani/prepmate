package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.ai.QuizResponse;
import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.AIActivityRepository;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.prepmate.prepmate.entity.AIActivity;
import com.prepmate.prepmate.dto.ai.FlashcardResponse;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {
        
    private final AIActivityRepository aiActivityRepository;    
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

         // =========================
        // SUMMARIZE NOTE
        // =========================

    public String summarizeNote(
            Long noteId,
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        Note note = noteRepository
                .findByIdAndUser(noteId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Note not found"));

        String prompt = """
                You are an AI study assistant called PrepMate.

                Summarize the following study note
                in simple and clear language.

                Give:
                1. A short summary
                2. Important points
                3. Key terms

                Keep the response useful for a student.

                Note title:
                %s

                Note content:
                %s
                """.formatted(
                note.getTitle(),
                note.getContent()
        );

       String result = geminiService.generate(prompt);

        aiActivityRepository.save(
        AIActivity.builder()
                .user(user)
                .note(note)
                .type(AIActivity.ActivityType.SUMMARY)
                .build()
        );

        return result;
    }

        // =========================
        // ASK QUESTION
        // =========================

        public String askQuestion(
                Long noteId,
                String question,
                String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Note note = noteRepository
                .findByIdAndUser(noteId, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));


        String prompt = """
                You are PrepMate, an intelligent AI study tutor.

                Your job is to help the student understand the
                study note and answer their question accurately.

                IMPORTANT INSTRUCTIONS:

                1. Carefully read and understand the entire note
                before answering.

                2. Answer questions using the information in the
                note as the primary source.

                3. You may explain, summarize, rephrase, compare,
                connect related concepts, and make simple logical
                inferences when they are clearly supported by
                the note.

                4. Do NOT simply look for an exact sentence in the
                note. Understand the meaning of the content.

                5. If the student asks "what", "why", "how",
                "explain", "difference between", "example",
                or a similar conceptual question, provide a
                clear explanation based on the note.

                6. If the question is partially answered by the
                note, answer the part that is supported and
                clearly mention what is not covered.

                7. Do NOT invent facts, statistics, definitions,
                examples, or information that contradicts the
                note.

                8. If the question is completely unrelated to the
                note and cannot reasonably be answered from it,
                say:
                "This question is not covered in this note."

                9. Use simple language suitable for a student.

                10. Give a direct answer first, followed by a short
                        explanation when useful.

                11. If the question asks for a comparison, use a
                        simple structured comparison.

                12. If the question asks for an example and the note
                        contains enough information to derive one,
                        provide the example and explain it.

                NOTE TITLE:
                %s

                NOTE CONTENT:
                %s

                STUDENT QUESTION:
                %s

                Now answer the student's question.
                """.formatted(
                note.getTitle(),
                note.getContent(),
                question
        );


        String result =
                geminiService.generate(prompt);


        aiActivityRepository.save(
                AIActivity.builder()
                        .user(user)
                        .note(note)
                        .type(
                                AIActivity.ActivityType.QUESTION
                        )
                        .build()
        );


        return result;
        }


        public QuizResponse generateQuiz(
                Long noteId,
                Integer numberOfQuestions,
                String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Note note = noteRepository
                .findByIdAndUser(noteId, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        if (numberOfQuestions == null ||
                numberOfQuestions < 1 ||
                numberOfQuestions > 20) {

                numberOfQuestions = 5;
        }

        String prompt = """
                You are PrepMate, an AI study assistant.

                Create %d multiple-choice questions
                from the study note below.

                For every question provide:

                Question:
                A.
                B.
                C.
                D.
                Correct Answer:
                Explanation:

                Make the questions useful for exam preparation.

                Do not create questions about information
                that is not present in the note.

                NOTE TITLE:
                %s

                NOTE CONTENT:
                %s
                """.formatted(
                numberOfQuestions,
                note.getTitle(),
                note.getContent()
        );

        String json = geminiService.generateQuizJson(prompt);

        try {

        QuizResponse result = objectMapper.readValue(
                json,
                QuizResponse.class
        );

        aiActivityRepository.save(
                AIActivity.builder()
                        .user(user)
                        .note(note)
                        .type(AIActivity.ActivityType.QUIZ)
                        .build()
        );

        return result;

        } catch (Exception e) {

        throw new RuntimeException(
                "Failed to parse quiz response",
                e
        );
        }
        }

        public FlashcardResponse generateFlashcards(
        Long noteId,
        Integer numberOfCards,
        String email) {

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Note note = noteRepository
        .findByIdAndUser(noteId, user)
        .orElseThrow(() ->
                new RuntimeException("Note not found"));

    if (numberOfCards == null ||
            numberOfCards < 1 ||
            numberOfCards > 30) {

        numberOfCards = 10;
    }

    String prompt = """
            You are PrepMate, an AI study assistant.

            Create exactly %d flashcards from the study note below.

            Each flashcard must contain:
            - question
            - answer

            Use ONLY information present in the note.

            Return ONLY valid JSON.

            Do NOT use markdown.
            Do NOT use ```json.
            Do NOT add any explanation before or after the JSON.

            Return EXACTLY this structure:

            {
              "flashcards": [
                {
                  "question": "Question here",
                  "answer": "Answer here"
                }
              ]
            }

            Create exactly %d flashcards.

            NOTE TITLE:
            %s

            NOTE CONTENT:
            %s
            """.formatted(
            numberOfCards,
            numberOfCards,
            note.getTitle(),
            note.getContent()
    );

    String json =
            geminiService.generateFlashcardsJson(prompt);

    try {

        System.out.println("========== FLASHCARD RAW RESPONSE ==========");
        System.out.println(json);

        // Remove markdown fences if Gemini still adds them
        json = json
                .replace("```json", "")
                .replace("```", "")
                .trim();

        // Extract JSON object
        int start = json.indexOf("{");
        int end = json.lastIndexOf("}");

        if (start == -1 || end == -1) {

            throw new RuntimeException(
                    "No valid JSON object found in Gemini response"
            );
        }

        json = json.substring(
                start,
                end + 1
        );

        System.out.println("========== FLASHCARD CLEAN JSON ==========");
        System.out.println(json);

        FlashcardResponse result =
                objectMapper.readValue(
                        json,
                        FlashcardResponse.class
                );

        if (result.getFlashcards() == null ||
                result.getFlashcards().isEmpty()) {

            throw new RuntimeException(
                    "Gemini returned no flashcards"
            );
        }

        aiActivityRepository.save(
                AIActivity.builder()
                        .user(user)
                        .note(note)
                        .type(
                                AIActivity.ActivityType.FLASHCARDS
                        )
                        .build()
        );

        return result;

    } catch (Exception e) {

        System.out.println(
                "========== FLASHCARD PARSE ERROR =========="
        );

        e.printStackTrace();

        throw new RuntimeException(
                "Failed to parse flashcard response",
                e
        );
    }
}

}