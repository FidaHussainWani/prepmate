package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.tag.TagRequest;
import com.prepmate.prepmate.dto.tag.TagResponse;
import com.prepmate.prepmate.entity.Tag;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.TagRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public TagResponse createTag(
            TagRequest request,
            String email) {

        User user = getUser(email);

        if (tagRepository.findByNameAndUser(
                request.getName(), user).isPresent()) {

            throw new RuntimeException(
                    "Tag already exists");
        }

        Tag tag = Tag.builder()
                .name(request.getName())
                .user(user)
                .build();

        Tag savedTag = tagRepository.save(tag);

        return convertToResponse(savedTag);
    }

    public List<TagResponse> getAllTags(String email) {

        User user = getUser(email);

        return tagRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public void deleteTag(
            Long id,
            String email) {

        User user = getUser(email);

        Tag tag = tagRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tag not found"));

        tagRepository.delete(tag);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    private TagResponse convertToResponse(Tag tag) {

        return new TagResponse(
                tag.getId(),
                tag.getName()
        );
    }
}