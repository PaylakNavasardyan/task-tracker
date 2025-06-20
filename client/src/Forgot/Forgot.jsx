import { useReducer, useRef } from 'react';
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
    }

    const emailInputRef = useRef();
    const newPasswordInputRef = useRef();
    const repNewPasswordInputRef = useRef();

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus()
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/Forgot', state);
            
            
        } catch(error) {
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
            <form>
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
                <input
                    className={classes.input}
                    type='password'
                    placeholder='New Password'
                    name='password'
                    value={state.newPassword}
                    onChange={handleChange}
                    ref={newPasswordInputRef}
                    onKeyDown={(e) => handleKeyDown(e, repNewPasswordInputRef)}
                    required
                />
                <input
                    className={classes.input}
                    type='password'
                    placeholder='Repeat New Password'
                    name='reNewPassword'
                    value={state.repNewPassword}
                    onChange={handleChange}
                    ref={repNewPasswordInputRef}
                    onKeyDown={(e) => handleKeyDown(e, undefined)}
                    required
                />

                <div className={classes.forgotFieldsButton}>
                    <button>Continue</button>
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
