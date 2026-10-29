
package com.logistics.cloudlogistics.product;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Add a product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repository.save(product);
    }

    // Update a product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product details) {
        return repository.findById(id).map(product -> {
            product.setName(details.getName());
            product.setQuantity(details.getQuantity());
            product.setPrice(details.getPrice());
            return repository.save(product);
        }).orElse(null);
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return "Product not found";
        }
        repository.deleteById(id);
        return "Product deleted successfully";
    }
}
