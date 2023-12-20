import React, { useState } from 'react';
import { Button, Grid, TextField, Snackbar, Alert } from '@mui/material';


const UploadPhotoForm = () => {
    const [photoFile, setPhotoFile] = useState(null);
    const [photoName, setPhotoName] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('No file selected');
    const [uploadedImage, setUploadedImage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);

    let email = localStorage.getItem('email');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPhotoFile(file);
        setSelectedFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleNameChange = (event) => {
        setPhotoName(event.target.value);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setOpenErrorAlert(false);
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', photoFile);
        formData.append('name', photoName);
        formData.append('email', email)

        try {
            const response = await fetch('http://localhost:8080/api/photos', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setOpenSnackbar(true);
                setPhotoFile(null);
                setPhotoName('');
                setUploadedImage('');
                setSelectedFileName('');
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
                    label="Photo Name"
                    value={photoName}
                    onChange={handleNameChange}
                    variant="outlined"
                    fullWidth
                />
            </Grid>
            <Grid item>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <p>{selectedFileName}</p>
                {uploadedImage && (
                    <img
                        src={uploadedImage}
                        alt="Uploaded"
                        style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '10px' }}
                    />
                )}
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Upload Photo
                </Button>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    {openSnackbar ? "Photo uploaded successfully!" : ""}
                </Alert>
            </Snackbar>

            <Snackbar open={openErrorAlert} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {openErrorAlert ? 'Failed to upload photo' : ''}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default UploadPhotoForm;
