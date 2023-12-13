package com.devnexus.repository;

import com.devnexus.model.db.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileRepository extends JpaRepository<File,Integer> {
    Optional<File> findByName(String fileName);
}
