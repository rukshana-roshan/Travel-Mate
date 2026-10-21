package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.ContactMessageDTO;
import com.travelmate.travelmate.entity.ContactMessage;
import com.travelmate.travelmate.exception.ResourceNotFoundException;
import com.travelmate.travelmate.repository.ContactMessageRepository;
import com.travelmate.travelmate.service.impl.ContactServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceImplTest {

    @Mock
    private ContactMessageRepository contactMessageRepository;

    @InjectMocks
    private ContactServiceImpl contactService;

    private ContactMessage sampleMessage;
    private ContactMessageDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleMessage = new ContactMessage();
        sampleMessage.setId(1L);
        sampleMessage.setName("Ruwan Silva");
        sampleMessage.setEmail("ruwan@example.com");
        sampleMessage.setSubject("Visiting Richmond Castle Hours");
        sampleMessage.setMessage("Could you please confirm if the castle is open on public holidays?");
        sampleMessage.setRead(false);
        sampleMessage.setCreatedAt(LocalDateTime.now());

        sampleDTO = new ContactMessageDTO();
        sampleDTO.setName("Ruwan Silva");
        sampleDTO.setEmail("ruwan@example.com");
        sampleDTO.setSubject("Visiting Richmond Castle Hours");
        sampleDTO.setMessage("Could you please confirm if the castle is open on public holidays?");
    }

    @Test
    @DisplayName("TC20 - Submit contact message saves entity to database")
    void testSubmitMessage() {
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(sampleMessage);

        ContactMessageDTO result = contactService.submitMessage(sampleDTO);

        assertNotNull(result);
        assertEquals("Ruwan Silva", result.getName());
        assertEquals("ruwan@example.com", result.getEmail());
        assertFalse(result.isRead());
        verify(contactMessageRepository, times(1)).save(any(ContactMessage.class));
    }

    @Test
    @DisplayName("TC20 - Get all messages returns list ordered by creation date")
    void testGetAllMessages() {
        when(contactMessageRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Arrays.asList(sampleMessage));

        List<ContactMessageDTO> list = contactService.getAllMessages();

        assertEquals(1, list.size());
        assertEquals("Visiting Richmond Castle Hours", list.get(0).getSubject());
    }

    @Test
    @DisplayName("TC20 - Mark message as read updates entity status")
    void testMarkAsRead() {
        when(contactMessageRepository.findById(1L)).thenReturn(Optional.of(sampleMessage));
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(sampleMessage);

        ContactMessageDTO result = contactService.markAsRead(1L);

        assertNotNull(result);
        assertTrue(sampleMessage.isRead());
        verify(contactMessageRepository).save(sampleMessage);
    }

    @Test
    @DisplayName("TC20 - Mark non-existent message throws ResourceNotFoundException")
    void testMarkAsReadNotFound() {
        when(contactMessageRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> contactService.markAsRead(999L));
    }

    @Test
    @DisplayName("TC20 - Delete message removes record from repository")
    void testDeleteMessage() {
        when(contactMessageRepository.findById(1L)).thenReturn(Optional.of(sampleMessage));
        doNothing().when(contactMessageRepository).delete(sampleMessage);

        contactService.deleteMessage(1L);

        verify(contactMessageRepository).delete(sampleMessage);
    }
}
