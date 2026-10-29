
package com.logistics.cloudlogistics.order;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository repository;

    public OrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CustomerOrder> getAllOrders() {
        return repository.findAll();
    }

    @PostMapping
    public CustomerOrder addOrder(@RequestBody CustomerOrder order) {
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PLACED");
        }
        return repository.save(order);
    }

    @GetMapping("/{id}")
    public CustomerOrder getOrder(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}/status")
    public CustomerOrder updateStatus(
            @PathVariable Long id,
            @RequestBody CustomerOrder details) {

        return repository.findById(id).map(order -> {
            order.setStatus(details.getStatus());
            return repository.save(order);
        }).orElse(null);
    }
}
