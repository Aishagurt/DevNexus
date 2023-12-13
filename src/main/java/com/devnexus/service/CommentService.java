package com.devnexus.service;

import com.devnexus.dto.CommentDto;
import com.devnexus.mapper.CommentMapper;
import com.devnexus.model.db.Comment;
import com.devnexus.model.db.Photo;
import com.devnexus.repository.CommentRepository;
import org.springframework.stereotype.Service;

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

    public Optional<Comment> getCommentById(Long commentId) {
        return commentRepository.findById(commentId);
    }

    public Comment addCommentToPhoto(Photo photo, Comment comment) {
        comment.setPhoto(photo);

        photo.addComment(comment);
        photoService.save(photo);

        return commentRepository.save(comment);
    }

    public void removeCommentFromPhoto(Long commentId) {
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
        return CommentMapper.mapToDtoList(comments);
    }
}
