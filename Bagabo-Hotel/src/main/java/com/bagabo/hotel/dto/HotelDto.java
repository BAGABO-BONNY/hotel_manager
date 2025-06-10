package com.bagabo.hotel.dto;

import lombok.Data;

import java.util.List;

@Data
public class HotelDto {
    private Long id;
    private String name;
    private String location;
    private List<RoomDto> rooms;
}
