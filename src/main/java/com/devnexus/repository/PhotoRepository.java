package com.devnexus.repository;

import com.devnexus.model.db.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Pageable;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByNameContainingIgnoreCase(String name);

    List<Photo> findAllByOrderByIdAsc(Pageable pageable);
}
