import * as React from 'react';
import { Container, Paper, Box, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import loginLogo from '../assets/login_logo.png';

export default function SignUpForm() {
    const paperStyle = { padding: '50px  20px', width: 600, margin: "20px auto" };

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/user/checkEmail?email=${email}`, {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.exists) {
                setEmailError('Email already exists');
            } else {
                const user = { name, surname, email, birthDate, password };
                const registrationResponse = await fetch("http://localhost:8080/user/registration", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });

                if (!registrationResponse.ok) {
                    throw new Error('Error registering user');
                }
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setError('Unexpected error happened, try again later');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email)
    };

    const handleEmailChange = (email) => {
        setEmail(email.target.value)
        if (!validateEmail(email.target.value)) {
            setEmailError('Please enter valid email');
        } else {
            setEmailError();
        }
    }

    const handleDateChange = (newDate) => {
        setBirthDate(newDate);
    };

    const handlePasswordChange = (password) => {
        setPassword(password.target.value);
    };

    const handlePasswordBlur = () => {
        if (password.length < 6) {
            setPasswordError('Password should be at least 6 characters');
        } else {
            setPasswordError('');
        }
    };

    const handleNameChange = (e) => {
        const input = e.target.value;
        if (/^[a-zA-Z]*$/.test(input) || input === '') {
            setName(input);
            setNameError();
        } else {
            setNameError('Name should contain only letters');
        }
    }

    const handleSurnameChange = (e) => {
        const input = e.target.value;
        if (/^[a-zA-Z]*$/.test(input) || input === '') {
            setSurname(input);
            setSurnameError('');
        } else {
            setSurnameError('Surname should contain only letters');
        }
    }

    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper elevation={3} style={paperStyle}>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { marginBottom: '20px' },
                            '& input': { padding: '10px' },
                            '& button:last-child': { fontSize: '0.6em', color: 'gray' },
                        }}
                        noValidate
                        autoComplete="off"

                    >
                        <img
                            src={loginLogo}
                            alt="chill_game_logo"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover'
                            }}
                        />

                        <TextField id="name" label="Name" variant="standard" fullWidth
                            value={name}
                            onChange={handleNameChange}
                            error={Boolean(nameError)}
                            helperText={nameError}
                        />
                        <TextField id="surname" label="Surname" variant="standard" fullWidth
                            value={surname}
                            onChange={handleSurnameChange}
                            error={Boolean(surnameError)}
                            helperText={surnameError}
                        />
                        <TextField id="email" label="Email" variant="standard" fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            error={Boolean(emailError)}
                            helperText={emailError}
                        />
                        <DateField id="birthDate" label="Birth date" variant="standard" fullWidth
                            value={birthDate}
                            onChange={handleDateChange}
                        />
                        <TextField id="password" label="Password" type="password" variant="standard" fullWidth
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                        />
                        <Button variant="outlined" onClick={handleClick}>Create account</Button>

                        <Button onClick={() => navigate('/login')}>
                            Already have an account?
                        </Button>

                        {error && (
                            <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                        )}
                    </Box>
                </Paper>
            </LocalizationProvider>
        </Container>
    );
}
