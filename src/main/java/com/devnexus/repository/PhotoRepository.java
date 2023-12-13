package com.devnexus.repository;

import com.devnexus.model.db.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import org.springframework.data.domain.Pageable;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Photo p")
    List<Photo> findAllPhotos();

    default List<Photo> findPhotosInRange(int start, int end) {
        List<Photo> allPhotos = findAllPhotos();

        start -= 1;
        int adjustedEnd = Math.min(end, allPhotos.size());

        if (start >= 0 && start < allPhotos.size() && start <= adjustedEnd) {
            return allPhotos.subList(start, adjustedEnd);
        } else {
            return Collections.emptyList();
        }
    }

    List<Photo> findAllByOrderByIdAsc(Pageable pageable);
}
