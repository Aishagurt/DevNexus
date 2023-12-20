import React from 'react';
import { Grid } from '@mui/material';

const SearchResults = ({ photos }) => {
    return (
        <Grid container spacing={3} justifyContent="center">
            {photos.map((photo, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <div>
                        <h3>{photo.name}</h3>
                        <img
                            src={`data:image/png;base64,${photo.file.imageData}`}
                            alt={photo.name}
                            style={{ maxWidth: '100%', height: 'auto' }}
                            loading='lazy'
                        />
                    </div>
                </Grid>
            ))}
        </Grid>
    );
};

export default SearchResults;
