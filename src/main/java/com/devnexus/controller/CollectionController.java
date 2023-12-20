package com.devnexus.controller;

import com.devnexus.dto.PhotoDto;
import com.devnexus.mapper.PhotoMapper;
import com.devnexus.model.db.Collection;
import com.devnexus.service.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin
@RequestMapping("/api/collections")
public class CollectionController {
    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping
    public ResponseEntity<Collection> createCollection(
            @RequestParam String collectionName,
            @RequestParam List<String> photoNames,
            @RequestParam String email,
            @RequestParam List<MultipartFile> photoFiles
    ) {
        Collection collection = collectionService.createCollection(collectionName, photoNames, email, photoFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body(collection);
    }

    @GetMapping("/get/{page}/{size}")
    public ResponseEntity<List<Collection>> getCollections(@PathVariable(name = "page") int page,
                                                           @PathVariable(name = "size") int size) {
        List<Collection> collections = collectionService.getCollectionBySize(page, size);
        return ResponseEntity.ok(collections);
    }

    @DeleteMapping("/{collectionId}")
    public ResponseEntity<String> deleteCollection(@PathVariable Long collectionId) {
        try {
            collectionService.deleteCollectionById(collectionId);
            return ResponseEntity.ok("Collection deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{collectionId}/addPhoto/{photoId}")
    public ResponseEntity<String> addPhotoToCollection(
            @PathVariable Long collectionId,
            @PathVariable Long photoId
    ) {
        try {
            Collection updatedCollection = collectionService.addPhotoToCollection(collectionId, photoId);
            return ResponseEntity.ok("Photo added to collection: " + updatedCollection.getId());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{collectionId}/removePhoto/{photoId}")
    public ResponseEntity<String> removePhotoFromCollection(
            @PathVariable Long collectionId,
            @PathVariable Long photoId
    ) {
        try {
            Collection updatedCollection = collectionService.removePhotoFromCollection(collectionId, photoId);
            return ResponseEntity.ok("Photo removed from collection: " + updatedCollection.getId());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

