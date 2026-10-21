package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.AttractionDTO;
import com.travelmate.travelmate.entity.Attraction;
import com.travelmate.travelmate.entity.Category;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.AttractionRepository;
import com.travelmate.travelmate.repository.CategoryRepository;
import com.travelmate.travelmate.service.impl.AttractionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the attraction service layer, mocking out the repositories
 * so these run in milliseconds with no database at all.
 */
@ExtendWith(MockitoExtension.class)
class AttractionServiceImplTest {

    @Mock
    private AttractionRepository attractionRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @InjectMocks
    private AttractionServiceImpl attractionService;

    private Category beachCategory;
    private Attraction pearlBay;

    @BeforeEach
    void setUp() {
        beachCategory = Category.builder().id(1L).name("Beach").icon("bi-water").build();
        pearlBay = Attraction.builder()
                .id(1L)
                .name("Pearl Bay")
                .category(beachCategory)
                .description("A scenic bay")
                .distanceKm(12.5)
                .durationMinutes(90)
                .openingHours("06:00 - 18:00")
                .entranceFee(BigDecimal.ZERO)
                .latitude(6.5721)
                .longitude(79.9612)
                .imageUrl("https://example.com/pearl-bay.jpg")
                .averageRating(4.6)
                .build();
    }

    @Test
    void getAllAttractions_mapsEntitiesToDtosCorrectly() {
        when(attractionRepository.findAll()).thenReturn(List.of(pearlBay));

        List<AttractionDTO> result = attractionService.getAllAttractions();

        assertThat(result).hasSize(1);
        AttractionDTO dto = result.get(0);
        assertThat(dto.getName()).isEqualTo("Pearl Bay");
        assertThat(dto.getCategoryId()).isEqualTo(1L);
        assertThat(dto.getCategoryName()).isEqualTo("Beach");
        assertThat(dto.getDistanceKm()).isEqualTo(12.5);
    }

    @Test
    void getAttractionById_throwsResourceNotFound_whenIdDoesNotExist() {
        when(attractionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attractionService.getAttractionById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createAttraction_throwsResourceNotFound_whenCategoryMissing() {
        AttractionDTO dto = AttractionDTO.builder()
                .name("New Spot")
                .categoryId(42L)
                .distanceKm(5.0)
                .latitude(6.0)
                .longitude(80.0)
                .build();
        when(categoryRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attractionService.createAttraction(dto))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(attractionRepository, never()).save(any());
    }

    @Test
    void createAttraction_savesAndReturnsMappedDto_whenCategoryExists() {
        AttractionDTO dto = AttractionDTO.builder()
                .name("Sunset Point")
                .categoryId(1L)
                .distanceKm(7.5)
                .durationMinutes(60)
                .latitude(6.6)
                .longitude(80.1)
                .entranceFee(BigDecimal.valueOf(200))
                .build();
        Attraction saved = Attraction.builder()
                .id(2L).name("Sunset Point").category(beachCategory)
                .distanceKm(7.5).durationMinutes(60).latitude(6.6).longitude(80.1)
                .entranceFee(BigDecimal.valueOf(200)).averageRating(0.0)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(beachCategory));
        when(attractionRepository.save(any(Attraction.class))).thenReturn(saved);

        AttractionDTO result = attractionService.createAttraction(dto);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getCategoryName()).isEqualTo("Beach");
        assertThat(result.getAverageRating()).isEqualTo(0.0);
    }

    @Test
    void deleteAttraction_throwsResourceNotFound_whenIdMissing() {
        when(attractionRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attractionService.deleteAttraction(5L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    /**
     * Regression test for a Phase 5 bug: the controller used to only branch on
     * categoryId OR keyword, silently dropping the keyword whenever a category
     * filter chip AND a search box were both active (a normal combo on the
     * Places page). Confirms the combined repository query is actually used.
     */
    @Test
    void searchAttractionsByCategoryAndKeyword_delegatesToCombinedRepositoryQuery() {
        when(attractionRepository.findByCategoryIdAndNameContainingIgnoreCase(1L, "bay"))
                .thenReturn(List.of(pearlBay));

        List<AttractionDTO> result = attractionService.searchAttractionsByCategoryAndKeyword(1L, "bay");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Pearl Bay");
        verify(attractionRepository).findByCategoryIdAndNameContainingIgnoreCase(1L, "bay");
    }
}
