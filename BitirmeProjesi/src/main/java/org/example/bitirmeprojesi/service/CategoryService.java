package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.entity.Category;
import org.example.bitirmeprojesi.mapper.CategoryMapper;
import org.example.bitirmeprojesi.repository.CategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {


    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto create(CategoryDto categoryDto) {
        Category category = categoryMapper.toEntity(categoryDto);
         categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }
    public CategoryDto findById(long id) {
        Category category=categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
        return categoryMapper.toDto(category);
    }
    @Cacheable(value = "categories", key = "'all'")
    public List<CategoryDto> findAll(){
        return categoryRepository.findAll().stream().map(categoryMapper::toDto).toList();
    }
    public Integer getCategoryCount() {
        return categoryRepository.findAll().size();
    }

    public HashMap<String, Integer> getCategoryCountMap() {
        HashMap<String, Integer> categoryCountMap = new HashMap<>();
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            categoryCountMap.put(category.getName(), category.getProducts().size());
        }
        return categoryCountMap;
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto update(CategoryDto categoryDto, long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
        categoryMapper.update(categoryDto, category);
        categoryRepository.save(category);
        return categoryMapper.toDto(category);

    }
    @CacheEvict(value = "categories", allEntries = true)
    public void delete(long id) {
        categoryRepository.deleteById(id);
    }

}
