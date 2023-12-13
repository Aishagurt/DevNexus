package com.devnexus.controller;

import com.devnexus.dto.CommentDto;
import com.devnexus.model.db.Comment;
import com.devnexus.model.db.Photo;
import com.devnexus.service.CommentService;
import com.devnexus.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final PhotoService photoService;

    public CommentController(CommentService commentService, PhotoService photoService) {
        this.commentService = commentService;
        this.photoService = photoService;
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long commentId) {
        Optional<Comment> comment = commentService.getCommentById(commentId);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/photo/{photoId}")
    public ResponseEntity<Comment> addCommentToPhoto(@PathVariable Long photoId, @RequestBody Comment comment) {
        Optional<Photo> optionalPhoto = photoService.findById(photoId);

        if (optionalPhoto.isPresent()) {
            Photo photo = optionalPhoto.get();
            Comment savedComment = commentService.addCommentToPhoto(photo, comment);

            return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.removeCommentFromPhoto(commentId);
            return new ResponseEntity<>("Comment deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete comment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/photo/{photoId}")
    public ResponseEntity<List<CommentDto>> getCommentsFromPhotoId(@PathVariable Long photoId) {
        List<CommentDto> comments = commentService.getCommentsByPhotoId(photoId);
        return ResponseEntity.ok(comments);
    }

}

