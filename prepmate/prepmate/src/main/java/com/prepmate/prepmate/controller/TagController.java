package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.tag.TagRequest;
import com.prepmate.prepmate.dto.tag.TagResponse;
import com.prepmate.prepmate.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public TagResponse createTag(
            @Valid @RequestBody TagRequest request,
            Authentication authentication) {

        return tagService.createTag(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<TagResponse> getAllTags(
            Authentication authentication) {

        return tagService.getAllTags(
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteTag(
            @PathVariable Long id,
            Authentication authentication) {

        tagService.deleteTag(
                id,
                authentication.getName()
        );

        return "Tag deleted successfully";
    }
}