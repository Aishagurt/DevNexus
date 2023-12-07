package com.devnexus.service;

import com.devnexus.model.Photo;
import com.devnexus.repository.PhotoRepository;
import com.devnexus.utils.ImageUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public Photo save(Photo photo) {
        return photoRepository.save(photo);
    }

    public Optional<Photo> findById(Long id) {
        return photoRepository.findById(id);
    }

    public List<Photo> getPhotos(int start, int end) {
        List<Photo> photos = photoRepository.findPhotosInRange(start, end);
        for(int i = 0; i < photos.size(); i++) {
            photos.get(i).getFile().setImageData(ImageUtils.decompressImage(photos.get(i).getFile().getImageData()));
        }
        return photos;
    }

    public List<Photo> getPhotosByName(String name) {
        List<Photo> photos = photoRepository.findByNameContainingIgnoreCase(name);
        for(int i = 0; i < photos.size(); i++) {
            photos.get(i).getFile().setImageData(ImageUtils.decompressImage(photos.get(i).getFile().getImageData()));
        }
        return photos;
    }

    public List<Photo> getPhotosBySize(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        List<Photo> photos = photoRepository.findAllByOrderByIdAsc(pageable);

        for (Photo photo : photos) {
            photo.getFile().setImageData(ImageUtils.decompressImage(photo.getFile().getImageData()));
        }
        return photos;
    }

    public String deletePhoto(Long id) {
        Optional<Photo> photoOptional = photoRepository.findById(id);
        if (photoOptional.isPresent()) {
            photoRepository.deleteById(id);
            return "Photo with ID " + id + " deleted successfully.";
        } else {
            throw new NoSuchElementException("Photo not found with ID " + id);
        }
    }

    public void deleteById(Long id) {
        photoRepository.deleteById(id);
    }
}
