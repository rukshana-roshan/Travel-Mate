package com.travelmate.travelmate.service;

import com.travelmate.travelmate.dto.ContactMessageDTO;
import java.util.List;

public interface ContactService {
    ContactMessageDTO submitMessage(ContactMessageDTO dto);
    List<ContactMessageDTO> getAllMessages();
    ContactMessageDTO getMessageById(Long id);
    ContactMessageDTO markAsRead(Long id);
    void deleteMessage(Long id);
    long countUnreadMessages();
}
