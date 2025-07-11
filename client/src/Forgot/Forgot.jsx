import { useEffect, useReducer, useRef, useState } from 'react';
import classes from './Forgot.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Forgot() {

    // Input fields with useReducer hook

    const initialState = {
        email: '',
        newPassword: '',
        repNewPassword: '',
        validationCode: ['', '', '', '']
    };

    function reducer(state, action) {
        return {
            ...state,
            [action.name]: action.value
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e) => {
        dispatch({ name: e.target.name, value: e.target.value });
    };

    
    // Error states with useState + object 
    
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
    
    // Error due to server side
    
    const [forgotError, setForgotError] = useState('');
    
    // Checking if the state is in initial segment
    
    const [confirm, setConfirm] = useState(false);
    
    const toggleConfim = () => {
        setConfirm((confirm) => !confirm)
    };
    
    // Focus on an input field after the "Enter" key is pressed
    
    const emailInputRef = useRef();
    const newPasswordInputRef = useRef();
    const repNewPasswordInputRef = useRef();
    
    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus()
        }
    };

    // Focus on an numeral input field
    
    const inputRefs = useRef([]);
    
    useEffect(() => {
        inputRefs.current.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (!/^\d$/.test(e.target.value) && e.target.value !== '') {
                    e.target.value = '';
                    return;
                };
                
                if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
                    inputRefs.current[index + 1].focus();
                }
                
                checkInputsFilled()
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    inputRefs.current[index - 1].focus();
                }
            })
        })
        
        function checkInputsFilled() {
            const allDigits = inputRefs.current.map(input => input.value).join('');
            
            if (allDigits.length === 4) {
                console.log('Code entered', allDigits)
            }
        }
    }, []);
    
    // Handle change for numeral input fields

    const handleCodeChange = (e, index) => {
        const value = e.target.value;

        const updateCode = [...state.validationCode];
        updateCode[index] = value;

        dispatch({ name: 'validationCode', value: updateCode })
    };
    
    // Waiting part, when verification code sending into email

    const [isLoading, setIsLoading] = useState(false);

    // Navigation to tasks

    const navigation = useNavigate();

    // Validation checking

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
    setForgotError('');

    const approvedEmailError = validEmail(state.email);
    const approvedNewPasswordError = validNewPassword(state.newPassword);
    const approvedRepNewPasswordError = validRepNewPassword(state.newPassword, state.repNewPassword);

    updateError('emailError', approvedEmailError);
    updateError('newPasswordError', approvedNewPasswordError);
    updateError('repNewPasswordError', approvedRepNewPasswordError);

    if (approvedEmailError || approvedNewPasswordError || approvedRepNewPasswordError) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);

    try {
        let requestData = {
            email: state.email,
            newPassword: state.newPassword,
            repNewPassword: state.repNewPassword
        };

        if (confirm) {
            requestData.validationCode = state.validationCode.join('');
        }

        const res = await axios.post('http://localhost:5000/Forgot', requestData);

        console.log(res);

        if (res.status === 200) {
            toggleConfim();
        } else if (res.status === 201) {
            document.cookie = `email=${state.email}; path=/`;
            navigation('/Tasks');
        } 
    } catch (error) {
            if (error.response && [400, 401, 404, 500].includes(error.response.status)) {
                setForgotError(error.response.data.message || 'Something went wrong');
            } else {
                setForgotError('Network error or server not responding');
            }
            console.error('error', error);
        } finally {
            setIsLoading(false);
        }

    };

    const handleVerifySubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post('http://localhost:5000/Forgot', {
            ...state,
            validationCode: state.validationCode.join('')
        });

        if (res.status === 201) {
            document.cookie = `email=${state.email}; path=/`;
            navigation('/Tasks');
        }
    } catch (error) {
        setForgotError('Verification failed');
        console.error(error);
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
            {!forgotError && isLoading &&
                <p className={`${confirm ? classes.hiddenLoading : classes.loading}`}>
                    Sending code to your email…
                </p>
            }
            <form 
                className={`${confirm ? classes.passiveInitialForm : classes.initialForm}` }
                onSubmit={handleSubmit}
            >
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
                    <button>Continue</button>
                </div>
            </form>

            <form 
                className={`${classes.secondForm} ${confirm ? classes.activeSecondForm : ''}`}
                onSubmit={handleVerifySubmit}    
            >
                <div class={classes.verificationDiv}>
                    {[0, 1, 2, 3].map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength="1"
                            onChange={(e) => handleCodeChange (e, i)}
                            ref={el => inputRefs.current[i] = el}
                            autoComplete='off'
                            value={state.validationCode[i] || ''}
                        />
                    ))}
                </div>

                <div className={classes.verificationButton}>
                    <button>Confirm</button>
                </div>
            </form>
        </div>
        
        <div className={classes.forgotBackToLogin}>
            <p>Back to</p>
            <Link
                className={classes.forgotBackToLoginLink}
                to='/Login'
            >Login</Link>
        </div>
    </div>
  )
}
