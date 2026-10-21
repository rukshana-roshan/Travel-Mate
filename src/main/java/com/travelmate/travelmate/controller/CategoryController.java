package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.CategoryDTO;
import com.travelmate.travelmate.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryDTO>> getAll() {
        return ApiResponse.success("Categories fetched successfully", categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryDTO> getById(@PathVariable Long id) {
        return ApiResponse.success("Category fetched successfully", categoryService.getCategoryById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryDTO> create(@Valid @RequestBody CategoryDTO dto) {
        return ApiResponse.success("Category created successfully", categoryService.createCategory(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryDTO> update(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) {
        return ApiResponse.success("Category updated successfully", categoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success("Category deleted successfully", null);
    }
}
