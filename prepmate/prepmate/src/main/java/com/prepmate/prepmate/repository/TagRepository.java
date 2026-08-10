package com.prepmate.prepmate.repository;

import com.prepmate.prepmate.entity.Tag;
import com.prepmate.prepmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUser(User user);

    Optional<Tag> findByIdAndUser(Long id, User user);

    Optional<Tag> findByNameAndUser(String name, User user);
}