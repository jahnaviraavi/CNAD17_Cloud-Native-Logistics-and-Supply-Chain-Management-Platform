
package com.logistics.cloudlogistics.user;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<AppUser> getAllUsers() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return repository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {

        if (user.getName() == null || user.getName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Name, email and password are required"));
        }

        if (repository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUSTOMER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        AppUser savedUser = repository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody AppUser details) {

        return repository.findById(id).map(user -> {

            if (details.getName() == null || details.getName().isBlank()
                    || details.getEmail() == null
                    || details.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message",
                                "Name and email are required"));
            }

            if (repository.existsByEmailAndIdNot(
                    details.getEmail(), id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message",
                                "Email already registered"));
            }

            user.setName(details.getName());
            user.setEmail(details.getEmail());

            if (details.getRole() != null
                    && !details.getRole().isBlank()) {
                user.setRole(details.getRole());
            }

            if (details.getPassword() != null
                    && !details.getPassword().isBlank()) {
                user.setPassword(
                        passwordEncoder.encode(details.getPassword()));
            }

            return ResponseEntity.ok(repository.save(user));

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully"));
    }
}
