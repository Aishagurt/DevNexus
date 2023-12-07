package com.devnexus.service;

import com.devnexus.dto.CommentDto;
import com.devnexus.model.Comment;
import com.devnexus.model.Photo;
import com.devnexus.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PhotoService photoService;

    public CommentService(CommentRepository commentRepository, PhotoService photoService) {
        this.commentRepository = commentRepository;
        this.photoService = photoService;
    }

    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Optional<Comment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    public Comment addCommentToPhoto(Photo photo, Comment comment) {
        comment.setPhoto(photo);

        photo.addComment(comment);
        photoService.save(photo);

        return commentRepository.save(comment);
    }

    public void removeCommentWithPhoto(Long commentId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            comment.removeFromPhoto();

            commentRepository.delete(comment);

            Photo photo = comment.getPhoto();
            if (photo != null) {
                photo.removeComment(comment);
                photoService.save(photo);
            }
        }
    }

    public List<CommentDto> getCommentsByPhotoId(Long photoId) {
        List<Comment> comments = commentRepository.findByPhotoId(photoId);
        List<CommentDto> commentDTOs = new ArrayList<>();

        for (Comment comment : comments) {
            CommentDto commentDTO = new CommentDto();
            commentDTO.setCommentId(comment.getId());
            commentDTO.setPhotoId(comment.getPhoto().getId());
            commentDTO.setText(comment.getText());
            commentDTOs.add(commentDTO);
        }

        return commentDTOs;
    }
}
