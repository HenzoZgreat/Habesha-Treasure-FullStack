package com.HabeshaTreasure.HabeshaTreasure.Service;

import com.HabeshaTreasure.HabeshaTreasure.DTO.ProductRequestDTO;
import com.HabeshaTreasure.HabeshaTreasure.Entity.Products;
import com.HabeshaTreasure.HabeshaTreasure.Repository.FavoriteProductRepo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.ProductsRepo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.ReviewRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductsService {

    @Autowired
    private ProductsRepo productsRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private FavoriteProductRepo favoriteRepo;
    @Autowired
    private ReviewRepo reviewRepo;


    public List<Products> getAllProducts() {
        return productsRepo.findAll();
    }

    public Products getProductById(Integer id) {
        return productsRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
    }

    
    public void createProduct(ProductRequestDTO dto) {
        Products product = mapToProduct(dto);
        product.setDateAdded(LocalDate.now());
        product.setFavorites(0);
        productsRepo.save(product);
    }

    
    public void updateProduct(Integer id, ProductRequestDTO dto) {
        Products product = getProductById(id);
        product.setName(dto.getName());
        product.setImage(dto.getImage());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setStatus(dto.getStatus());
        product.setDescriptionEn(dto.getDescriptionEn());
        product.setDescriptionAm(dto.getDescriptionAm());
        product.setIsFeatured(dto.getIsFeatured());
        productsRepo.save(product);
    }


    @Transactional
    public void deleteProduct(Integer id) {
        Products product = getProductById(id);

        cartService.deleteItemsByProduct(product);
        favoriteRepo.deleteByProduct(product);
        reviewRepo.deleteByProduct(product);

        productsRepo.delete(product);
    }

    @Transactional
    public void deleteMultipleProducts(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Invalid product IDs");
        }

        List<Products> productsToDelete = productsRepo.findAllById(ids);
        for (Products product : productsToDelete) {
            cartService.deleteItemsByProduct(product);
            favoriteRepo.deleteByProduct(product);
            reviewRepo.deleteByProduct(product);
        }

        productsRepo.deleteAll(productsToDelete);
    }

    
    public int getFavoritesCount(Integer id) {
        return getProductById(id).getFavorites();
    }

    
    public void incrementFavorites(Integer id) {
        Products product = getProductById(id);
        product.setFavorites(product.getFavorites() + 1);
        productsRepo.save(product);
    }

    
    public void decrementFavorites(Integer id) {
        Products product = getProductById(id);
        if (product.getFavorites() > 0) {
            product.setFavorites(product.getFavorites() - 1);
            productsRepo.save(product);
        }
    }

    public void rateProduct(Integer productId, int newRating) {
        Products product = getProductById(productId);

        int count = product.getCount();
        double currentAvg = product.getRate();

        double newAvg = ((currentAvg * count) + newRating) / (count + 1);

        product.setCount(count + 1);
        product.setRate(newAvg);

        productsRepo.save(product);
    }


    public List<Products> getFeaturedProducts() {
        return productsRepo.findByIsFeaturedTrue();
    }

    
    public List<Products> getProductsByStatus(String status) {
        return productsRepo.findByStatusIgnoreCase(status);
    }

    private Products mapToProduct(ProductRequestDTO dto) {
        Products p = new Products();
        p.setName(dto.getName());
        p.setImage(dto.getImage());
        p.setCategory(dto.getCategory());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setStatus(dto.getStatus());
        p.setDescriptionEn(dto.getDescriptionEn());
        p.setDescriptionAm(dto.getDescriptionAm());
        p.setIsFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        return p;
    }

}


