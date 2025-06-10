package com.bagabo.hotel.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BillingDto {
    private Long id;
    private Long bookingId;
    private double amount;
    private LocalDateTime generatedAt;
}
