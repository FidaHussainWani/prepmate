package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.note.NoteRequest;
import com.prepmate.prepmate.dto.note.NoteResponse;
import com.prepmate.prepmate.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public NoteResponse createNote(
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {

        return noteService.createNote(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<NoteResponse> getAllNotes(
            Authentication authentication) {

        return noteService.getAllNotes(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public NoteResponse getNote(
            @PathVariable Long id,
            Authentication authentication) {

        return noteService.getNote(
                id,
                authentication.getName()
        );
    }

    @PutMapping("/{id}")
    public NoteResponse updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {

        return noteService.updateNote(
                id,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteNote(
            @PathVariable Long id,
            Authentication authentication) {

        noteService.deleteNote(
                id,
                authentication.getName()
        );

        return "Note deleted successfully";
    }

    @PatchMapping("/{id}/favorite")
    public NoteResponse toggleFavorite(
            @PathVariable Long id,
            Authentication authentication) {

        return noteService.toggleFavorite(
                id,
                authentication.getName()
        );
    }
}