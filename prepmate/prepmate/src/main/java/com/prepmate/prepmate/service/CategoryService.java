package com.prepmate.prepmate.service;

import com.prepmate.prepmate.dto.category.CategoryRequest;
import com.prepmate.prepmate.dto.category.CategoryResponse;
import com.prepmate.prepmate.entity.Category;
import com.prepmate.prepmate.entity.User;
import com.prepmate.prepmate.repository.CategoryRepository;
import com.prepmate.prepmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryResponse createCategory(
            CategoryRequest request,
            String email) {

        User user = getUser(email);

        if (categoryRepository.existsByNameAndUser(
                request.getName(), user)) {

            throw new RuntimeException(
                    "Category already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .user(user)
                .build();

        Category savedCategory =
                categoryRepository.save(category);

        return convertToResponse(savedCategory);
    }

    public List<CategoryResponse> getAllCategories(
            String email) {

        User user = getUser(email);

        return categoryRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request,
            String email) {

        User user = getUser(email);

        Category category =
                categoryRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"));

        category.setName(request.getName());

        Category updatedCategory =
                categoryRepository.save(category);

        return convertToResponse(updatedCategory);
    }

    public void deleteCategory(
            Long id,
            String email) {

        User user = getUser(email);

        Category category =
                categoryRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"));

        categoryRepository.delete(category);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    private CategoryResponse convertToResponse(
            Category category) {

        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }
}