package com.devnexus.service;

import com.devnexus.model.db.Collection;
import com.devnexus.model.db.Photo;
import com.devnexus.repository.CollectionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CollectionService {
    private final CollectionRepository collectionRepository;
    private final PhotoService photoService;
    private final FileService fileService;

    public CollectionService(CollectionRepository collectionRepository, PhotoService photoService, FileService fileService) {
        this.collectionRepository = collectionRepository;
        this.photoService = photoService;
        this.fileService = fileService;
    }

    public Collection createCollection(String collectionName, List<String> photoNames, String email, List<MultipartFile> photoFiles) {
        Collection collection = new Collection();
        collection.setName(collectionName);

        List<Photo> photos = new ArrayList<>();

        for (int i = 0; i < photoNames.size(); i++) {
            Photo savedPhoto = fileService.uploadImage(photoFiles.get(i), photoNames.get(i), email);
            photos.add(savedPhoto);
        }
        collection.setPhotos(photos);

        return collectionRepository.save(collection);
    }

    public void deleteCollectionById(Long collectionId) {
        Optional<Collection> collectionOptional = collectionRepository.findById(collectionId);
        collectionOptional.ifPresentOrElse(
                collectionRepository::delete,
                () -> { throw new NoSuchElementException("Collection not found with ID " + collectionId); }
        );
    }

    public Collection addPhotoToCollection(Long collectionId, Long photoId) {
        Optional<Collection> collectionOptional = collectionRepository.findById(collectionId);
        Optional<Photo> photoOptional = photoService.findById(photoId);

        if (collectionOptional.isPresent() && photoOptional.isPresent()) {
            Collection collection = collectionOptional.get();
            Photo photo = photoOptional.get();

            if (!collection.getPhotos().contains(photo)) {
                collection.getPhotos().add(photo);
                photo.getCollections().add(collection);

                collectionRepository.save(collection);
                photoService.save(photo);
            }
            return collection;
        } else {
            throw new NoSuchElementException("Collection or Photo not found.");
        }
    }

    public Collection removePhotoFromCollection(Long collectionId, Long photoId) {
        Optional<Collection> collectionOptional = collectionRepository.findById(collectionId);
        Optional<Photo> photoOptional = photoService.findById(photoId);

        if (collectionOptional.isPresent() && photoOptional.isPresent()) {
            Collection collection = collectionOptional.get();
            Photo photo = photoOptional.get();

            collection.getPhotos().remove(photo);
            photo.getCollections().remove(collection);

            collectionRepository.save(collection);
            photoService.save(photo);

            return collection;
        } else {
            throw new NoSuchElementException("Collection or Photo not found.");
        }
    }

    public List<Collection> getCollectionBySize(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return collectionRepository.findAllByOrderByIdAsc(pageable);
    }
}
