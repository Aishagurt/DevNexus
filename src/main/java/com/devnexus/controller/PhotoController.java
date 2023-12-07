package com.devnexus.controller;

import com.devnexus.model.File;
import com.devnexus.model.Photo;
import com.devnexus.service.FileService;
import com.devnexus.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/photos")
public class PhotoController {
    private final PhotoService photoService;
    private final FileService fileService;

    public PhotoController(PhotoService photoService, FileService fileService) {
        this.photoService = photoService;
        this.fileService = fileService;
    }


    @PostMapping
    public ResponseEntity<String> uploadPhoto(@RequestParam("image") MultipartFile uploadedFile, @RequestParam("name") String name, @RequestParam("email") String email) {
        Photo photo = new Photo();
        photo.setName(name);
        photo.setEmail(email);

        try {
            File savedFile = fileService.uploadImage(uploadedFile);

            savedFile.setName(name);
            savedFile.setType(uploadedFile.getContentType());

            photo.setFile(savedFile);

            photoService.save(photo);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }


    @GetMapping("/get/{fileName}")
    public ResponseEntity<byte[]> downloadPhoto(@PathVariable String fileName){
        byte[] imageData=fileService.downloadImage(fileName);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);

    }

    @GetMapping("/get/{page}/{size}")
    public ResponseEntity<List<Photo>> getPhotos(@PathVariable(name = "page") int page, @PathVariable(name = "size") int size) {
        List<Photo> photos = photoService.getPhotosBySize(page, size);
        return ResponseEntity.ok(photos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Photo>> searchPhotosByName(@RequestParam("name") String name) {
        List<Photo> photos = photoService.getPhotosByName(name);

        if (photos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(photos);
    }


    @GetMapping("/{photoId}")
    public ResponseEntity<Photo> getPhotoById(@PathVariable Long photoId) {
        Optional<Photo> photo = photoService.findById(photoId);
        return photo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        try {
            String result = photoService.deletePhoto(id);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

