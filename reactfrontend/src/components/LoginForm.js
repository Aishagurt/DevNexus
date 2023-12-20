import React, { useState } from 'react';
import { Container, Paper, Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loginLogo from '../assets/login_logo.png';

export default function LoginForm() {
    const paperStyle = { padding: '50px  20px', width: 600, margin: '20px auto' };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/user/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('email', email);
                navigate('/');

            } else if (response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An error occurred during login');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { marginBottom: '20px' },
                        '& input': { padding: '10px' },
                        '& button:last-child': { fontSize: '0.6em', color: 'gray' },
                    }}
                    onSubmit={handleLogin}
                >
                    <img
                        src={loginLogo}
                        alt="chill_game_logo"
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                        }}
                    />

                    <TextField
                        id="email"
                        label="Email"
                        variant="standard"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="section-blue shipping street-address"
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="section-blue shipping street-address"
                    />
                    <Button variant="outlined" type="submit">Login</Button>

                    <Button onClick={() => navigate('/signUp')}>
                        Don't have an account?
                    </Button>

                    {error && (
                        <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}
