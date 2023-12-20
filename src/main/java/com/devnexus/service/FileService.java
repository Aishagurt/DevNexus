package com.devnexus.service;

import com.devnexus.model.db.File;
import com.devnexus.model.db.Photo;
import com.devnexus.repository.FileRepository;
import com.devnexus.utils.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private PhotoService photoService;

    public Photo uploadImage(MultipartFile file, String name, String email) {
        File savedFile = null;
        try {
            savedFile = fileRepository.save(File.builder()
                    .name(file.getOriginalFilename())
                    .type(file.getContentType())
                    .imageData(ImageUtils.compressImage(file.getBytes())).build());
        } catch (IOException e) {
            throw new RuntimeException("Error uploading image" + e);
        }

        Photo photo = new Photo();
        photo.setName(name);
        photo.setEmail(email);
        photo.setFile(savedFile);

        return photoService.save(photo);
    }

    public byte[] downloadImage(String fileName) {
        Optional<File> dbImageData = fileRepository.findByName(fileName);
        return ImageUtils.decompressImage(dbImageData.get().getImageData());
    }

}
