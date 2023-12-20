import React, { useState } from 'react';
import { Button, Grid, TextField, Snackbar, Alert } from '@mui/material';

const UploadCollectionForm = () => {
    const [collectionName, setCollectionName] = useState('');
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [photos, setPhotos] = useState([]);

    const handleNameChange = (event) => {
        setCollectionName(event.target.value);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const fileNames = files.map((file) => file.name);
        setSelectedFileNames(fileNames);
        setPhotos(files);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setOpenErrorAlert(false);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('collectionName', collectionName);

        const email = localStorage.getItem('email');

        const photoNames = photos.map((photo) => photo.name);
        formData.append('email', email);
        formData.append('photoNames', JSON.stringify(photoNames));

        photos.forEach((photo) => {
            formData.append('photoFiles', photo);
        });

        try {
            const response = await fetch('http://localhost:8080/api/collections', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setOpenSnackbar(true);
                setCollectionName('');
                setPhotos([]);
            } else {
                setOpenErrorAlert(true);
            }
        } catch (error) {
            setOpenErrorAlert(true);
        }
    };

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <TextField
                    label="Collection Name"
                    value={collectionName}
                    onChange={handleNameChange}
                    variant="outlined"
                    fullWidth
                />
            </Grid>
            <Grid item>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                <p>{selectedFileNames.join(', ')}</p>
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Create Collection
                </Button>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {openSnackbar ? 'Collection created successfully!' : ''}
                </Alert>
            </Snackbar>

            <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {openErrorAlert ? 'Failed to create collection' : ''}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default UploadCollectionForm;
