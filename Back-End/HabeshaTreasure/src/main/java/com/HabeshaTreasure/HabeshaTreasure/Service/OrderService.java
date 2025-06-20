package com.HabeshaTreasure.HabeshaTreasure.Service;

import com.HabeshaTreasure.HabeshaTreasure.DTO.OrderItemDTO;
import com.HabeshaTreasure.HabeshaTreasure.DTO.UserOrderResponseDTO;
import com.HabeshaTreasure.HabeshaTreasure.Entity.CartItem;
import com.HabeshaTreasure.HabeshaTreasure.Entity.Orders.Order;
import com.HabeshaTreasure.HabeshaTreasure.Entity.Orders.OrderItem;
import com.HabeshaTreasure.HabeshaTreasure.Entity.Orders.OrderStatus;
import com.HabeshaTreasure.HabeshaTreasure.Entity.Products;
import com.HabeshaTreasure.HabeshaTreasure.Entity.User;
import com.HabeshaTreasure.HabeshaTreasure.Repository.CartItemRepo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.OrderRepo;
import com.HabeshaTreasure.HabeshaTreasure.Repository.ProductsRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductsRepo productsRepo;
    private final CartItemRepo cartRepo;


    @Transactional
    public void cancelOrder(Long orderId, User user) {
        Order order = getUserOrder(orderId, user);

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Order cannot be canceled at this stage");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Products product = productsRepo.findById(item.getProductId())
                    .orElseThrow(() -> new NoSuchElementException("Product not found"));

            product.setStock(product.getStock() + item.getQuantity());
            productsRepo.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);
    }


    @Transactional
    public Long placeOrder(User user) {
        List<CartItem> cartItems = cartRepo.findByUser(user);
        if (cartItems.isEmpty()) throw new IllegalStateException("Cart is empty");

        double total = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cartItems) {
            Products product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productsRepo.save(product);

            orderItems.add(new OrderItem(
                    null,
                    null,
                    product.getId(),
                    product.getName(),
                    product.getImage(),
                    product.getPrice(),
                    item.getQuantity()
            ));

            total += product.getPrice() * item.getQuantity();
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(total);
        order.setOrderedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setItems(orderItems);
        orderItems.forEach(i -> i.setOrder(order));

        orderRepo.save(order);
        cartRepo.deleteByUser(user);

        return order.getId();
    }

    @Transactional
    public void uploadPaymentProof(Long orderId, User user, MultipartFile file) throws IOException {
        Order order = getUserOrder(orderId, user);
        order.setPaymentProof(file.getBytes());
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        orderRepo.save(order);
    }

    public List<UserOrderResponseDTO> getOrdersForUser(User user) {
        return orderRepo.findByUserOrderByOrderedAtDesc(user)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public UserOrderResponseDTO getOrderByIdForUser(Long orderId, User user) {
        Order order = getUserOrder(orderId, user);
        return toDto(order);
    }

    public byte[] getPaymentProof(Long orderId, User user) {
        Order order = getUserOrder(orderId, user);
        return order.getPaymentProof();
    }

    private Order getUserOrder(Long orderId, User user) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
        if (!order.getUser().getId().equals(user.getId()))
            throw new NoSuchElementException("Unauthorized access");
        return order;
    }

    private UserOrderResponseDTO toDto(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(i -> new OrderItemDTO(
                        i.getProductName(),
                        i.getProductPrice(),
                        i.getProductImage(),
                        i.getQuantity()))
                .toList();

        return new UserOrderResponseDTO(
                order.getId(),
                order.getTotalPrice(),
                order.getOrderedAt(),
                order.getStatus(),
                items
        );
    }
}

