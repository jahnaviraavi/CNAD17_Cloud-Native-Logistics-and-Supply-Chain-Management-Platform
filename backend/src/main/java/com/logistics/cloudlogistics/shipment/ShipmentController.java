
package com.logistics.cloudlogistics.shipment;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentRepository repository;

    public ShipmentController(ShipmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Shipment> getAllShipments() {
        return repository.findAll();
    }

    @PostMapping
    public Shipment addShipment(@RequestBody Shipment shipment) {
        if (shipment.getStatus() == null ||
                shipment.getStatus().isBlank()) {
            shipment.setStatus("PROCESSING");
        }
        return repository.save(shipment);
    }

    @GetMapping("/{id}")
    public Shipment getShipment(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}/status")
    public Shipment updateStatus(
            @PathVariable Long id,
            @RequestBody Shipment details) {

        return repository.findById(id).map(shipment -> {
            shipment.setStatus(details.getStatus());
            return repository.save(shipment);
        }).orElse(null);
    }
}
