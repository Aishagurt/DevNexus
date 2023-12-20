import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, ImageList, ImageListItem, Container } from '@mui/material';
import PhotoModal from './PhotoModal';
import PhotoSkeleton from './PhotoSkeleton';

export default function PhotoList() {
    const [photos, setPhotos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [photoComments, setPhotoComments] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const effectRan = useRef(false);

    const handlePhotoClick = async (index, photoId) => {
        setSelectedIndex(index);
        setOpenModal(true);

        try {
            const response = await fetch(`http://localhost:8080/api/comments/photo/${photoId}`);
            if (response.ok) {
                const commentsData = await response.json();
                setPhotoComments(commentsData);
            } else {
                console.error('Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedIndex(null);
    };

    const fetchPhotos = async (page, size) => {
        try {
            const response = await fetch(`http://localhost:8080/api/photos/get/${page}/${size}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            setPhotos(prevPhotos => [...prevPhotos, ...data]);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const loadMorePhotos = async () => {
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        const pageSize = 8;

        try {
            await fetchPhotos(nextPage, pageSize);
        } catch (error) {
            console.error('Error fetching more photos:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (effectRan.current === false) {
            fetchPhotos(0, 8);
        }
        return () => {
            effectRan.current = true
        }
    }, []);

    const deletePhoto = async (photoId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/photos/${photoId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPhotos(prevPhotos => {
                    if (!prevPhotos || prevPhotos.length === 0) {
                        console.error('No previous photos available');
                        return prevPhotos;
                    }

                    return prevPhotos.filter(photo => photo.id !== photoId);
                });
                handleCloseModal();
            } else {
                console.error('Failed to delete photo');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const postComment = async () => {
        try {
            const username = localStorage.getItem('email') || 'Anonymous';

            const response = await fetch(`http://localhost:8080/api/comments/photo/${photos[selectedIndex].id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: `${username}: ${commentInput}` }),
            });

            if (response.ok) {
                const commentsResponse = await fetch(`http://localhost:8080/api/comments/photo/${photos[selectedIndex].id}`);
                if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();

                    setPhotos(prevPhotos => {
                        const updatedPhotos = [...prevPhotos];
                        const updatedPhoto = { ...updatedPhotos[selectedIndex] };
                        updatedPhoto.comments = commentsData;
                        updatedPhotos[selectedIndex] = updatedPhoto;
                        return updatedPhotos;
                    });
                    setPhotoComments(commentsData);
                    setCommentInput('');
                } else {
                    console.error('Failed to fetch updated comments for photo');
                }
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedPhotoComments = photoComments.filter(comment => comment.commentId !== commentId);
                setPhotoComments(updatedPhotoComments);
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} justifyContent="center">
                {photos.length > 0 ? (
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {photos.map((photo, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`data:image/png;base64,${photo.file.imageData}`}
                                    alt={photo.name}
                                    loading="lazy"
                                    onClick={() => handlePhotoClick(index, photo.id)}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                ) : (
                    <Grid item xs={12}>
                        <ImageList variant="masonry" cols={3} gap={12}>
                            {[...Array(6)].map((_, index) => (
                                <ImageListItem key={index}>
                                    <PhotoSkeleton />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>
                )}
                <Grid item xs={12}>
                    {loadingMore ? (
                        <ImageList variant="masonry" cols={3} gap={8}>
                            {Array.from({ length: 3 }, (_, index) => (
                                <ImageListItem key={index}>
                                    <PhotoSkeleton />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    ) : (
                        <Button variant="contained" color="primary" onClick={loadMorePhotos}>
                            Load More
                        </Button>
                    )}
                </Grid>
                <PhotoModal
                    selectedIndex={selectedIndex}
                    photos={photos}
                    openModal={openModal}
                    handleCloseModal={handleCloseModal}
                    deletePhoto={deletePhoto}
                    photoComments={photoComments}
                    commentInput={commentInput}
                    setCommentInput={setCommentInput}
                    postComment={postComment}
                    deleteComment={deleteComment}
                />
            </Grid>
        </Container>
    );
}
