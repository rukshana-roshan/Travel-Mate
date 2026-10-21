package com.travelmate.travelmate.controller;

import com.travelmate.travelmate.dto.ApiResponse;
import com.travelmate.travelmate.dto.ContactMessageDTO;
import com.travelmate.travelmate.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ContactMessageDTO> submit(@Valid @RequestBody ContactMessageDTO dto) {
        ContactMessageDTO saved = contactService.submitMessage(dto);
        return ApiResponse.success("Thank you! Your message has been received.", saved);
    }

    @GetMapping("/messages")
    public ApiResponse<List<ContactMessageDTO>> getAll() {
        return ApiResponse.success("Contact messages retrieved", contactService.getAllMessages());
    }

    @GetMapping("/messages/{id}")
    public ApiResponse<ContactMessageDTO> getById(@PathVariable Long id) {
        return ApiResponse.success("Contact message details", contactService.getMessageById(id));
    }

    @PutMapping("/messages/{id}/read")
    public ApiResponse<ContactMessageDTO> markAsRead(@PathVariable Long id) {
        return ApiResponse.success("Message marked as read", contactService.markAsRead(id));
    }

    @DeleteMapping("/messages/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ApiResponse.success("Message deleted successfully", null);
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.success("Unread messages count", contactService.countUnreadMessages());
    }
}
