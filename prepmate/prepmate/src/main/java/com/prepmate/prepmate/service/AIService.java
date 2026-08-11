package com.prepmate.prepmate.service;

import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

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
}