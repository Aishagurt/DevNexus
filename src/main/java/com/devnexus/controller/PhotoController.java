package com.devnexus.controller;

import com.devnexus.dto.PhotoDto;
import com.devnexus.mapper.PhotoMapper;
import com.devnexus.model.db.Photo;
import com.devnexus.service.FileService;
import com.devnexus.service.PhotoService;
import com.devnexus.utils.ImageUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
    public ResponseEntity<Photo> uploadPhoto(@RequestParam("image") MultipartFile uploadedFile, @RequestParam("name") String name, @RequestParam("email") String email) {
        Photo savedFile = fileService.uploadImage(uploadedFile, name, email);

        return ResponseEntity.ok(savedFile);
    }


    @GetMapping("/get/{photoId}")
    public ResponseEntity<byte[]> downloadPhoto(@PathVariable Long photoId) {
        Optional<Photo> photo = photoService.findById(photoId);

        if (photo.isPresent()) {
            byte[] imageData = ImageUtils.decompressImage(photo.get().getFile().getImageData());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("image/png"));
            headers.setContentDispositionFormData("attachment", "photo.png");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(imageData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{photoId}")
    public ResponseEntity<PhotoDto> getPhotoById(@PathVariable Long photoId) {
        Optional<Photo> optPhoto = photoService.findById(photoId);

        if (optPhoto.isPresent()) {
            Photo photo = optPhoto.get();
            PhotoDto photoDto = PhotoMapper.mapPhotoToDto(photo);
            return ResponseEntity.ok(photoDto);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/get/{page}/{size}")
    public ResponseEntity<List<PhotoDto>> getPhotos(@PathVariable(name = "page") int page,
                                                    @PathVariable(name = "size") int size) {
        List<Photo> photos = photoService.getPhotosBySize(page, size);
        List<PhotoDto> photoDtos = PhotoMapper.mapPhotosToDtos(photos);
        return ResponseEntity.ok(photoDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Photo>> searchPhotosByName(@RequestParam("name") String name) {
        List<Photo> photos = photoService.getPhotosByName(name);

        if (photos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(photos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(photoService.deletePhoto(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

