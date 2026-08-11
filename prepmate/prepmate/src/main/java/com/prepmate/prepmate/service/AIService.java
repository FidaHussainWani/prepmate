package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.ai.QuizResponse;
import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepmate.prepmate.dto.ai.QuizResponse;
import com.prepmate.prepmate.dto.ai.FlashcardResponse;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

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

        return geminiService.generate(prompt);
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
            You are PrepMate, an AI study assistant.

            Answer the student's question using ONLY
            the information provided in the note below.

            If the answer cannot be found in the note,
            clearly say that the information is not
            available in the provided note.

            Explain the answer in simple language.

            NOTE TITLE:
            %s

            NOTE CONTENT:
            %s

            STUDENT QUESTION:
            %s
            """.formatted(
            note.getTitle(),
            note.getContent(),
            question
    );

    return geminiService.generate(prompt);
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

        String json =  geminiService.generateQuizJson(prompt);
        try {

    return objectMapper.readValue(
            json,
            QuizResponse.class
    );

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

    Note note = getUserNote(noteId, user);

    if (numberOfCards == null ||
            numberOfCards < 1 ||
            numberOfCards > 30) {

        numberOfCards = 10;
    }

    String prompt = """
            You are PrepMate, an AI study assistant.

            Create %d flashcards from the study note below.

            Each flashcard must contain:

            Question:
            Answer:

            Use only information present in the note.

            Make the flashcards useful for revision
            and exam preparation.

            Return the result as JSON in this format:

            {
              "flashcards": [
                {
                  "question": "...",
                  "answer": "..."
                }
              ]
            }

            NOTE TITLE:
            %s

            NOTE CONTENT:
            %s
            """.formatted(
            numberOfCards,
            note.getTitle(),
            note.getContent()
    );

    String json = geminiService.generateFlashcardsJson(prompt);

    try {

        return objectMapper.readValue(
                json,
                FlashcardResponse.class
        );

    } catch (Exception e) {

        throw new RuntimeException(
                "Failed to parse flashcard response",
                e
        );
    }
}

         private Note getUserNote(
            Long noteId,
            User user) {

        return noteRepository
                .findByIdAndUser(noteId, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Note not found"));
    }


}