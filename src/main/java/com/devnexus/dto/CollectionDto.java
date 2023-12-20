package com.devnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionDto {
    private Long id;
    private String name;
    private List<PhotoDto> photos;
}
