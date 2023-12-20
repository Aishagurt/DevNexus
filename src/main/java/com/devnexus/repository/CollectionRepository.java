package com.devnexus.repository;

import com.devnexus.model.db.Collection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findAllByOrderByIdAsc(Pageable pageable);
}
