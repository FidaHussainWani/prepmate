package com.prepmate.prepmate.repository;

import com.prepmate.prepmate.entity.Note;
import com.prepmate.prepmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(User user);

    Optional<Note> findByIdAndUser(Long id, User user);

     List<Note> findByUserAndTitleContainingIgnoreCase(
            User user,
            String keyword
    );

    List<Note> findByUserAndFavorite(
            User user,
            boolean favorite
    );

    List<Note> findByUserAndCategoryId(
            User user,
            Long categoryId
    );
}