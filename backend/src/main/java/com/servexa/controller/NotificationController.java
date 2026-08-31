package com.servexa.controller;

import com.servexa.dto.MessageResponse;
import com.servexa.model.Notification;
import com.servexa.model.User;
import com.servexa.repository.NotificationRepository;
import com.servexa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/my/unread")
    public ResponseEntity<List<Notification>> getMyUnreadNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
        
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication authentication) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
                
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to modify this notification"));
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        
        return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id, Authentication authentication) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
                
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Error: Unauthorized to delete this notification"));
        }

        notificationRepository.delete(notification);
        
        return ResponseEntity.ok(new MessageResponse("Notification deleted successfully"));
    }
}
