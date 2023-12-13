package com.devnexus.mapper;

import com.devnexus.dto.CommentDto;
import com.devnexus.model.db.Comment;
import lombok.experimental.UtilityClass;

import java.util.ArrayList;
import java.util.List;

@UtilityClass
public class CommentMapper {

    public List<CommentDto> mapToDtoList(List<Comment> comments) {
        List<CommentDto> commentDTOs = new ArrayList<>();

        for (Comment comment : comments) {
            CommentDto commentDTO = mapToDto(comment);
            commentDTOs.add(commentDTO);
        }

        return commentDTOs;
    }

    public CommentDto mapToDto(Comment comment) {

        if (comment == null) {
            return null;
        }

        CommentDto commentDTO = new CommentDto();
        commentDTO.setCommentId(comment.getId());
        commentDTO.setPhotoId(comment.getPhoto().getId());
        commentDTO.setText(comment.getText());

        return commentDTO;
    }
}
