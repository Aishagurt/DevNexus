import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton, Container, ImageListItem, ImageListItemBar } from '@mui/material';

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCollections = async (page, size) => {
        try {
            setLoadingMore(true);
            const response = await fetch(`http://localhost:8080/api/collections/get/${page}/${size}`);
            if (response.ok) {
                const data = await response.json();
                setCollections(prevCollections => [...prevCollections, ...data]);
                setCurrentPage(page);
            } else {
                console.error('Failed to fetch collections');
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadMoreCollections = async () => {
        const nextPage = currentPage + 1;
        const pageSize = 6; // Number of collections to fetch per page

        await fetchCollections(nextPage, pageSize);
    };

    useEffect(() => {
        fetchCollections(0, 6); // Fetch initial collections
    }, []);

    return (
        <Container maxWidth="lg">
            {collections.map((collection, index) => (
                <div key={index}>
                    <Typography variant="h5" gutterBottom>
                        {collection.name}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <ImageListItem>
                                <img
                                    src={`data:image/png;base64,${collection.photos[0].file.imageData}`}
                                    alt={collection.photos[0].name}
                                    loading="lazy"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <ImageListItemBar
                                    title={collection.photos[0].name}
                                    subtitle={collection.photos[0].email}
                                    actionIcon={<IconButton>{/* Add action icon */}</IconButton>}
                                />
                            </ImageListItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ImageListItem>
                                <img
                                    src={`data:image/png;base64,${collection.photos[1].file.imageData}`}
                                    alt={collection.photos[1].name}
                                    loading="lazy"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <ImageListItemBar
                                    title={collection.photos[1].name}
                                    subtitle={collection.photos[1].email}
                                    actionIcon={<IconButton>{/* Add action icon */}</IconButton>}
                                />
                            </ImageListItem>
                        </Grid>
                        <Grid item xs={4}>
                            <ImageListItem>
                                <img
                                    src={`data:image/png;base64,${collection.photos[2].file.imageData}`}
                                    alt={collection.photos[2].name}
                                    loading="lazy"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                                <ImageListItemBar
                                    title={collection.photos[2].name}
                                    subtitle={collection.photos[2].email}
                                    actionIcon={<IconButton>{/* Add action icon */}</IconButton>}
                                />
                            </ImageListItem>
                        </Grid>
                    </Grid>
                </div>
            ))}
            {loadingMore ? (
                <Typography>Loading...</Typography>
            ) : (
                <Button variant="contained" color="primary" onClick={loadMoreCollections}>
                    Load More
                </Button>
            )}
        </Container>
    );
};

export default CollectionList;
