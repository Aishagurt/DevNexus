package com.devnexus.dto;

import com.devnexus.model.db.File;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhotoDto {
    private Long id;
    private File file;
    private String name;
    private String email;
    private List<Long> tags;
    private List<Long> collections;
}