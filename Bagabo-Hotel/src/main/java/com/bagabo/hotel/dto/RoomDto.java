package com.bagabo.hotel.dto;

import lombok.Data;

@Data
public class RoomDto {
    private Long id;
    private Long hotelId;
    private String roomType;
    private double price;
    private boolean isAvailable;
}
