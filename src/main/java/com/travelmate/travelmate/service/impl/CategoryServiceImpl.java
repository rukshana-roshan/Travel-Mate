package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.CategoryDTO;
import com.travelmate.travelmate.entity.Category;
import com.travelmate.travelmate.exception.DuplicateResourceException;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.CategoryRepository;
import com.travelmate.travelmate.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = findCategoryOrThrow(id);
        return toDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException("Category already exists: " + dto.getName());
        }
        Category category = Category.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .color(dto.getColor())
                .isFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false)
                .build();
        return toDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = findCategoryOrThrow(id);
        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());
        category.setColor(dto.getColor());
        if (dto.getIsFeatured() != null) {
            category.setIsFeatured(dto.getIsFeatured());
        }
        return toDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = findCategoryOrThrow(id);
        categoryRepository.delete(category);
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryDTO toDTO(Category category) {
        int count = 0;
        if (category.getAttractions() != null) {
            count = category.getAttractions().size();
        }
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .color(category.getColor())
                .isFeatured(category.getIsFeatured())
                .attractionCount(count)
                .build();
    }
}
