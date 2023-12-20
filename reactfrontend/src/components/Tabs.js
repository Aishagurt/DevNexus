import React from 'react';
import { Tab, Tabs } from '@mui/material';

function TabsComponent({ value, handleChange }) {
    return (
        <Tabs value={value} onChange={handleChange} aria-label="tabs" textColor="inherit">
            <Tab label="Photos" {...a11yProps(0)} />
            <Tab label="Collections" {...a11yProps(1)} />
            <Tab label="Upload photo" {...a11yProps(2)} />
            <Tab label="Create collection" {...a11yProps(3)} />
        </Tabs>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default TabsComponent;
