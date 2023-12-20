import React, { useEffect }  from 'react';
import {
    Toolbar,
    IconButton,
    InputBase,
    Button
} from '@mui/material';
import MenuIcon from '../assets/home.png';
import SearchIcon from '@mui/icons-material/Search';
import "../styles/Navbar.css"
import { useNavigate } from 'react-router-dom';

const linkStyle = {
    margin: '8px',
    textDecoration: 'none',
    color: 'grey',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
};

const Navbar = ({
    searchQuery,
    setSearchQuery,
    handleSearch
}) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('email');

        if (userEmail) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const Logout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
    };

    return (
        <Toolbar>
            <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src={MenuIcon} alt="Home Icon" className='iconStyle' />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <IconButton
                    sx={{ p: '8px', pointerEvents: 'auto', cursor: 'pointer' }}
                    aria-label="search"
                    onClick={handleSearch}
                >
                    <SearchIcon />
                </IconButton>
                <InputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    sx={{
                        flexGrow: 1,
                        mr: 2,
                        border: '1px solid #ccc',
                        borderRadius: '20px',
                        paddingLeft: '8px'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoggedIn ? (
                <>
                    <Button onClick={() => navigate('/profile')} style={linkStyle}>
                        Profile
                    </Button>
                    <Button onClick={Logout} style={linkStyle}>
                        Log out
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={() => navigate('/login')} style={linkStyle}>
                        Login
                    </Button>
                    <Button onClick={() => navigate('/signUp')} style={linkStyle}>
                        Sign Up
                    </Button>
                </>
            )}
        </Toolbar>
    );
};

export default Navbar;
