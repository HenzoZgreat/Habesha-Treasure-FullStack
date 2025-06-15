package com.HabeshaTreasure.HabeshaTreasure.Controller;

import com.HabeshaTreasure.HabeshaTreasure.Entity.Products;
import com.HabeshaTreasure.HabeshaTreasure.Service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/user/products")
public class ProductsUserController {

    @Autowired
    private ProductsService productsService;

    @GetMapping
    public ResponseEntity<List<Products>> getAllProducts() {
        return ResponseEntity.ok(productsService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(productsService.getProductById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/rate")
    public ResponseEntity<?> rateProduct(@PathVariable Integer id, @RequestParam int rating) {
        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }
        productsService.rateProduct(id, rating);
        return ResponseEntity.ok("Rating submitted");
    }

    @PatchMapping("/{id}/favorites/increment")
    public ResponseEntity<?> incrementFavorites(@PathVariable Integer id) {
        productsService.incrementFavorites(id);
        return ResponseEntity.ok("Favorites incremented");
    }

    @PatchMapping("/{id}/favorites/decrement")
    public ResponseEntity<?> decrementFavorites(@PathVariable Integer id) {
        productsService.decrementFavorites(id);
        return ResponseEntity.ok("Favorites decremented");
    }

}
