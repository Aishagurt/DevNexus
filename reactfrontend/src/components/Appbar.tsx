import * as React from 'react';
import { AppBar, Box } from '@mui/material';
import PhotoList from './PhotoList.js';
import Container from '@mui/material/Container';
import UploadPhotoForm from './UploadPhotoForm.js';
import SearchResults from './SearchResult.js';
import UploadCollectionForm from './UploadCollectionForm.js';
import TabsComponent from './Tabs.js';
import CustomTabPanel from './TabPanel.tsx';
import CollectionList from './CollectionList.js';
import Navbar from './Navbar.js';

export default function Appbar() {
    const [value, setValue] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/photos/search?name=${searchQuery}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching photos:', error);
        }
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="inherit">
                <Navbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                />
                <TabsComponent value={value} handleChange={handleChange} />
            </AppBar>

            <CustomTabPanel value={value} index={0}>
                <Container maxWidth="xl" style={{ marginTop: '15px' }}>
                    {searchResults.length > 0 ? (
                        <SearchResults photos={searchResults} />
                    ) : (
                        <PhotoList />
                    )}
                </Container>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                <CollectionList />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                <Container maxWidth="xs" style={{ marginTop: '15px' }}>
                    <UploadPhotoForm />
                </Container>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
                <Container maxWidth="xs" style={{ marginTop: '15px' }}>
                    <UploadCollectionForm />
                </Container>
            </CustomTabPanel>

        </Box>
    );
}
