package com.prepmate.prepmate.controller;

import com.prepmate.prepmate.dto.category.CategoryRequest;
import com.prepmate.prepmate.dto.category.CategoryResponse;
import com.prepmate.prepmate.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CategoryResponse createCategory(
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        return categoryService.createCategory(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories(
            Authentication authentication) {

        return categoryService.getAllCategories(
                authentication.getName()
        );
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        return categoryService.updateCategory(
                id,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {

        categoryService.deleteCategory(
                id,
                authentication.getName()
        );

        return "Category deleted successfully";
    }
}