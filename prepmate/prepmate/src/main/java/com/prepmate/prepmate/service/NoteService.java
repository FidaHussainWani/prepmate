package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.note.NoteRequest;
import com.prepmate.prepmate.dto.note.NoteResponse;
import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.CategoryRepository;
import com.prepmate.prepmate.repository.NoteRepository;
import com.prepmate.prepmate.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import com.prepmate.prepmate.entity.Category;
import org.springframework.stereotype.Service;
import com.prepmate.prepmate.entity.Tag;
import com.prepmate.prepmate.repository.TagRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

   public NoteResponse createNote(
        NoteRequest request,
        String email) {

    User user = getUser(email);

    Category category = null;

    if (request.getCategoryId() != null) {

        category = categoryRepository
                .findByIdAndUser(
                        request.getCategoryId(),
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"));
    }

    Note note = Note.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .favorite(false)
            .user(user)
            .category(category)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

     if (request.getTagIds() != null) {

        for (Long tagId : request.getTagIds()) {

            Tag tag = tagRepository
                    .findByIdAndUser(tagId, user)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Tag not found"));

            note.getTags().add(tag);
        }
    }

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
                    new RuntimeException(
                            "Note not found"));

    Category category = null;

    if (request.getCategoryId() != null) {

        category = categoryRepository
                .findByIdAndUser(
                        request.getCategoryId(),
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"));
    }

    note.setTitle(request.getTitle());
    note.setContent(request.getContent());
    note.setCategory(category);

    note.getTags().clear();

    if (request.getTagIds() != null) {

        for (Long tagId : request.getTagIds()) {

            Tag tag = tagRepository
                    .findByIdAndUser(tagId, user)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Tag not found"));

            note.getTags().add(tag);
        }
    }
    note.setUpdatedAt(LocalDateTime.now());

    Note updatedNote =
            noteRepository.save(note);

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

    public List<NoteResponse> searchNotes(
        String keyword,
        String email) {

    User user = getUser(email);

    return noteRepository
            .findByUserAndTitleContainingIgnoreCase(
                    user,
                    keyword
            )
            .stream()
            .map(this::convertToResponse)
            .toList();
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
    public List<NoteResponse> getFavoriteNotes(
        String email) {

    User user = getUser(email);

    return noteRepository
            .findByUserAndFavorite(user, true)
            .stream()
            .map(this::convertToResponse)
            .toList();
    }

    public List<NoteResponse> getNotesByCategory(
        Long categoryId,
        String email) {

    User user = getUser(email);

    return noteRepository
            .findByUserAndCategoryId(
                    user,
                    categoryId
            )
            .stream()
            .map(this::convertToResponse)
            .toList();
    }

   private NoteResponse convertToResponse(Note note) {

    Long categoryId = null;
    String categoryName = null;

    if (note.getCategory() != null) {

        categoryId = note.getCategory().getId();
        categoryName = note.getCategory().getName();
    }

    List<Long> tagIds = note.getTags()
            .stream()
            .map(Tag::getId)
            .toList();

    List<String> tagNames = note.getTags()
            .stream()
            .map(Tag::getName)
            .toList();

    return new NoteResponse(
            note.getId(),
            note.getTitle(),
            note.getContent(),
            note.isFavorite(),
            categoryId,
            categoryName,
            tagIds,
            tagNames,
            note.getCreatedAt(),
            note.getUpdatedAt()
    );
}
public Page<NoteResponse> getNotes(
        String email,
        int page,
        int size) {

    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    if (page < 0) {
        page = 0;
    }

    if (size < 1 || size > 50) {
        size = 10;
    }

    Pageable pageable =
            PageRequest.of(page, size);

    return noteRepository
            .findByUser(user, pageable)
            .map(this::convertToResponse);
}
public Page<NoteResponse> getFilteredNotes(
        String email,
        int page,
        int size,
        String keyword,
        Boolean favorite,
        Long categoryId) {

    User user = getUser(email);

    if (page < 0) {
        page = 0;
    }

    if (size < 1 || size > 50) {
        size = 10;
    }

    Pageable pageable = PageRequest.of(page, size);

    Page<Note> notes;

    if (keyword != null && !keyword.isBlank()) {

        notes = noteRepository
                .findByUserAndTitleContainingIgnoreCase(
                        user,
                        keyword,
                        pageable
                );

    } else if (favorite != null) {

        notes = noteRepository
                .findByUserAndFavorite(
                        user,
                        favorite,
                        pageable
                );

    } else if (categoryId != null) {

        notes = noteRepository
                .findByUserAndCategoryId(
                        user,
                        categoryId,
                        pageable
                );

    } else {

        notes = noteRepository
                .findByUser(
                        user,
                        pageable
                );
    }

    return notes.map(this::convertToResponse);
}
}