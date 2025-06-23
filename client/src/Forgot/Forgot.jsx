import { useReducer, useRef, useState } from 'react';
import classes from './Forgot.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Forgot() {
    const initialState = {
        email: '',
        newPassword: '',
        repNewPassword: ''
    };

    function reducer(state, action) {
        return {
            ...state,
            [action.name]: action.value
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e) => {
        dispatch({ name: e.target.name, value: e.target.value })
    };

    const [error, setError] = useState({
        emailError: '',
        newPasswordError: '',
        repNewPasswordError: ''
    });

    const updateError = (field, message) => {
        setError(prev => ({
            ...prev,
            [field]: message
        }))
    };

    const [forgotError, setForgotError] = useState('');

    const emailInputRef = useRef();
    const newPasswordInputRef = useRef();
    const repNewPasswordInputRef = useRef();

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus()
        }
    };

    const validEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validNewPassword = (password) => {
        const startsWithLetterRegex = /^[a-zA-Z]/;
        const passCharactersRegex = /^[a-zA-Z0-9_.-]+$/;
        let passFirstChar = password.charAt(0).toLowerCase();
        let passChars = '';

        for (let i = 0; i < password.length; i++) {
            if (password[i].toLowerCase() === passFirstChar) {
                passChars += password[i];
            };

            if (passChars.length === password.length) {
                return 'The Password cannot contain only the same characters';
            }
        };

        if (!startsWithLetterRegex.test(password)) {
        return 'Password must start with Latin letter';
        } else if (!passCharactersRegex.test(password)) {
        return 'Password can contain only Latin letters numbers and (-, _, .)';
        } else if (password.length < 6) {
        return 'Password cannot contain fewer than 6 characters';
        } else if (password.length > 15) {
        return 'Password cannot contain more than 15 characters';
        }
        return '';
    };

    const validRepNewPassword = (password, repPassword) => {
        if (repPassword !== password) {
        return 'Repeat Password does not match with Password';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const aprrovedEmailError = validEmail(state.email);
        const approvedNewPasswordError = validNewPassword(state.newPassword);
        const approvedRepNewPasswordError = validRepNewPassword(state.newPassword, state.repNewPassword);

        updateError('emailError', aprrovedEmailError);
        updateError('newPasswordError', approvedNewPasswordError);
        updateError('repNewPasswordError', approvedRepNewPasswordError);

        if (aprrovedEmailError || approvedNewPasswordError || approvedRepNewPasswordError) {
            return;
        }

        try {
            console.log('before axios')
            const res = await axios.post('http://localhost:5000/Forgot', state);

            console.log(res)
            if (res.status === 201) {
                document.cookie = `email=${state.email}; path=/`;
        
                dispatch({ name: 'email', value: '' });
                dispatch({ name: 'newPassword', value: '' });
                dispatch({ name: 'repNewPassword', value: '' });

                console.log(res.data)
            } 
        } catch(error) {
            if (error.response && [401, 404].includes(error.response.status)) {
                setForgotError(error.response.data.message)
                console.log('Something went wrong!')
            } else {
                setForgotError('Network error or server not responding');
            }
            console.error('error', error);
        }
    };

  return (
    <div className={classes.forgot}>
        <div className={classes.forgotTitle}>
            <h1>Task Tracker</h1>
            <div className={classes.forgotTitleLine}></div>
        </div>

        <div className={classes.forgotFields}>
            <h2>Forgot Password</h2>
            {forgotError && <p className={classes.forgotError}>{forgotError}</p>}
            <form onSubmit={handleSubmit}>
                <div className={classes.inputDiv}>
                    {error.emailError && <p className={classes.errorMessage}>{error.emailError}</p>}
                    <input 
                        className={classes.input}
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={state.email}
                        onChange={handleChange}
                        ref={emailInputRef}
                        onKeyDown={(e) => handleKeyDown(e, newPasswordInputRef)}
                        required
                    />
                </div>
                <div className={classes.inputDiv}>
                    {error.newPasswordError && <p className={classes.errorMessage}>{error.newPasswordError}</p>}
                    <input
                        className={classes.input}
                        type='password'
                        placeholder='New Password'
                        name='newPassword'
                        value={state.newPassword}
                        onChange={handleChange}
                        ref={newPasswordInputRef}
                        onKeyDown={(e) => handleKeyDown(e, repNewPasswordInputRef)}
                        required
                    />
                </div>
                <div className={classes.inputDiv}>
                    {error.repNewPasswordError && <p className={classes.errorMessage}>{error.repNewPasswordError}</p>}
                    <input
                        className={classes.input}
                        type='password'
                        placeholder='Repeat New Password'
                        name='repNewPassword'
                        value={state.repNewPassword}
                        onChange={handleChange}
                        ref={repNewPasswordInputRef}
                        onKeyDown={(e) => handleKeyDown(e, undefined)}
                        required
                    />
                </div>
                <div className={classes.forgotFieldsButton}>
                    <button type='submit'>Continue</button>
                </div>
            </form>
        </div>

        <div className={classes.forgotBackToLogin}>
            <p>Back to</p>
            <Link
                className={classes.forgotBackToLoginLink}
                to='/'
            >Login</Link>
        </div>
    </div>
  )
}
