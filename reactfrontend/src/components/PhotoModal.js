import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PhotoModal = ({
    selectedIndex,
    photos,
    openModal,
    handleCloseModal,
    deletePhoto,
    photoComments,
    commentInput,
    setCommentInput,
    postComment,
    deleteComment
}) => {
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        if (selectedIndex !== null) {
            setPhoto(photos[selectedIndex]);
        }
    }, [selectedIndex, photos]);

    const handleCommentInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handlePostComment = () => {
        postComment();
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId);
    };

    return (
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth={true}>
            {photo && (
                <>
                    <DialogTitle disableTypography="true">
                        {photo.email === localStorage.getItem('email') && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => deletePhoto(photo.id)}
                            >
                                Delete
                            </Button>
                        )}
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" align="center">
                                    {photo.name}
                                </Typography>
                                {photo.email && (
                                    <p>Uploaded by: {photo.email}</p>
                                )}
                                <img
                                    src={`data:image/png;base64,${photo.file.imageData}`}
                                    alt={photo.name}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{
                                    display: 'flex', flexDirection: 'column', height: '100%'
                                }}>
                                    {photoComments.length > 0 ? (
                                        photoComments.map(comment => (
                                            <div key={comment.commentId} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="body1">
                                                        {comment.text}
                                                    </Typography>
                                                    <div>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {comment.user}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={() => handleDeleteComment(comment.commentId)}
                                                            aria-label="delete-comment"
                                                            color="error"
                                                            size="small"
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography variant="body1" color="textSecondary">
                                            No comments
                                        </Typography>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <textarea
                                            rows="4"
                                            cols="50"
                                            value={commentInput}
                                            onChange={handleCommentInputChange}
                                        />
                                        <Button variant="contained" onClick={handlePostComment}>Post Comment</Button>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
};

export default PhotoModal;
