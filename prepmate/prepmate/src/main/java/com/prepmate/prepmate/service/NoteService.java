package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.note.NoteRequest;
import com.prepmate.prepmate.dto.note.NoteResponse;
import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteResponse createNote(
            NoteRequest request,
            String email) {

        User user = getUser(email);

        Note note = Note.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Note savedNote = noteRepository.save(note);

        return convertToResponse(savedNote);
    }

    public List<NoteResponse> getAllNotes(String email) {

        User user = getUser(email);

        return noteRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public NoteResponse getNote(
            Long id,
            String email) {

        User user = getUser(email);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        return convertToResponse(note);
    }

    public NoteResponse updateNote(
            Long id,
            NoteRequest request,
            String email) {

        User user = getUser(email);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setUpdatedAt(LocalDateTime.now());

        Note updatedNote = noteRepository.save(note);

        return convertToResponse(updatedNote);
    }

    public void deleteNote(
            Long id,
            String email) {

        User user = getUser(email);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        noteRepository.delete(note);
    }

    public NoteResponse toggleFavorite(
            Long id,
            String email) {

        User user = getUser(email);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        note.setFavorite(!note.isFavorite());
        note.setUpdatedAt(LocalDateTime.now());

        Note updatedNote = noteRepository.save(note);

        return convertToResponse(updatedNote);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private NoteResponse convertToResponse(Note note) {

        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.isFavorite(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}