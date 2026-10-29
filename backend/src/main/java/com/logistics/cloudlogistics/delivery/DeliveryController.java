
package com.logistics.cloudlogistics.delivery;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryRepository repository;

    public DeliveryController(DeliveryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return repository.findAll();
    }

    @PostMapping
    public Delivery addDelivery(@RequestBody Delivery delivery) {
        if (delivery.getStatus() == null ||
                delivery.getStatus().isBlank()) {
            delivery.setStatus("PENDING");
        }
        return repository.save(delivery);
    }

    @GetMapping("/{id}")
    public Delivery getDelivery(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}/status")
    public Delivery updateStatus(
            @PathVariable Long id,
            @RequestBody Delivery details) {

        return repository.findById(id).map(delivery -> {
            delivery.setStatus(details.getStatus());
            return repository.save(delivery);
        }).orElse(null);
    }
}
