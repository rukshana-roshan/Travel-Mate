package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.AttractionDTO;

import java.util.List;

public interface AttractionService {
    List<AttractionDTO> getAllAttractions();
    AttractionDTO getAttractionById(Long id);
    List<AttractionDTO> getAttractionsByCategory(Long categoryId);
    List<AttractionDTO> searchAttractions(String keyword);
    List<AttractionDTO> searchAttractionsByCategoryAndKeyword(Long categoryId, String keyword);
    AttractionDTO createAttraction(AttractionDTO dto);
    AttractionDTO updateAttraction(Long id, AttractionDTO dto);
    void deleteAttraction(Long id);
}
