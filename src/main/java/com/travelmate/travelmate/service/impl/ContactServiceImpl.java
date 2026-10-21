package com.travelmate.travelmate.service.impl;

import com.travelmate.travelmate.dto.ContactMessageDTO;
import com.travelmate.travelmate.entity.ContactMessage;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.ContactMessageRepository;
import com.travelmate.travelmate.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactServiceImpl(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    @Transactional
    public ContactMessageDTO submitMessage(ContactMessageDTO dto) {
        ContactMessage entity = ContactMessage.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .isRead(false)
                .build();

        ContactMessage saved = contactMessageRepository.save(entity);
        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageDTO> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageDTO getMessageById(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        return toDTO(msg);
    }

    @Override
    @Transactional
    public ContactMessageDTO markAsRead(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        msg.setIsRead(true);
        ContactMessage updated = contactMessageRepository.save(msg);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        contactMessageRepository.delete(msg);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadMessages() {
        return contactMessageRepository.countByIsReadFalse();
    }

    private ContactMessageDTO toDTO(ContactMessage entity) {
        return ContactMessageDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .isRead(entity.getIsRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
