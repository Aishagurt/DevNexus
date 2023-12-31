package com.devnexus.mapper;

import com.devnexus.dto.PhotoDto;
import com.devnexus.model.db.Collection;
import com.devnexus.model.db.Photo;
import lombok.experimental.UtilityClass;

import java.util.ArrayList;
import java.util.List;

@UtilityClass
public class PhotoMapper {

    public List<PhotoDto> mapPhotosToDtos(List<Photo> photos) {
        List<PhotoDto> photoDtos = new ArrayList<>();

        for (Photo photo : photos) {
            PhotoDto photoDto = mapPhotoToDto(photo);
            photoDtos.add(photoDto);
        }
        return photoDtos;
    }

    public PhotoDto mapPhotoToDto(Photo photo) {
        PhotoDto photoDto = new PhotoDto();
        photoDto.setId(photo.getId());
        photoDto.setFile(photo.getFile());
        photoDto.setName(photo.getName());
        photoDto.setEmail(photo.getEmail());
        photoDto.setCollections(getCollectionIds(photo.getCollections()));
        return photoDto;
    }

    private List<Long> getCollectionIds(List<Collection> collections) {
        List<Long> collectionIds = new ArrayList<>();

        for (Collection collection : collections) {
            collectionIds.add(collection.getId());
        }
        return collectionIds;
    }
}
