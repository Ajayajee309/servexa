package com.servexa.controller;

import com.servexa.model.ChatMessage;
import com.servexa.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageRepository.save(chatMessage);
        
        // Broadcast the message to the specific booking channel
        messagingTemplate.convertAndSend("/topic/messages/" + chatMessage.getBookingId(), savedMsg);
    }
    
    @GetMapping("/api/messages/{bookingId}")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long bookingId) {
        return ResponseEntity.ok(chatMessageRepository.findByBookingIdOrderByTimestampAsc(bookingId));
    }
}
