import { useReducer, useRef, useState } from 'react';
import classes from './Registration.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Registration() {
  const initialState = {
    email: '',
    name: '',
    password: '',
    repPassword: '',
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

  const [error, setError] = useState({
    emailError: '',
    nameError: '',
    passwordError: '',
    repPasswordError: ''
  });

  const updateError = (field, message) => {
    setError(prev => ({
      ...prev,
      [field]: message
    }))
  };

  const [existedEmailError, setExistedEmailError] = useState('');

  const emailRef = useRef();
  const nameInputRef = useRef();
  const passwordInputRef = useRef();
  const repPasswordInputRef = useRef();

  const navigate = useNavigate();

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validName = (name) => {
    const startsWithLetterRegex = /^[a-zA-Z]/;
    const lettersAndNumbersOnlyRegex = /^[a-zA-Z0-9]+$/;
    let nameFirstChar = name.charAt(0).toLowerCase();
    let nameChars = '';

    for (let i = 0; i < name.length; i++) {
      if (name[i].toLowerCase() === nameFirstChar) {
        nameChars += name[i];
      }

      if (nameChars.length === name.length) {
        return 'The Name cannot contain only the same characters';
      }
    }

    if (!startsWithLetterRegex.test(name)) {
      return 'Your name must start with Latin letter';
    } else if (!lettersAndNumbersOnlyRegex.test(name)) {
      return 'Your name must contain only Latin letters and numbers';
    } else if (name.length < 4) {
      return 'Your name cannot contain fewer than 4 characters';
    } else if (name.length > 15) {
      return 'Your name cannot contain more than 15 charactes';
    }
    return '';
  };

  const validPassword = (password) => {
    const startsWithLetterRegex = /^[a-zA-Z]/;
    const passCharactersRegex = /^[a-zA-Z0-9_.-]+$/;
    let passFirstChar = password.charAt(0).toLowerCase();
    let passChars = '';

    for (let i = 0; i < password.length; i++) {
      if (password[i].toLowerCase() === passFirstChar) {
        passChars += password[i];
      }

      if (passChars.length === password.length) {
        return 'The Password cannot contain only the same characters';
      }
    }

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

  const validRepPassword = (password, repPassword) => {
    if (repPassword !== password) {
      return 'Repeat Password does not match with Password';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const approvedEmailError = validEmail(state.email);
    const approvedNameError = validName(state.name);
    const approvedPasswordError = validPassword(state.password);
    const approvedRepPasswordError = validRepPassword(state.password, state.repPassword);

    updateError('emailError', approvedEmailError);
    updateError('nameError', approvedNameError);
    updateError('passwordError', approvedPasswordError);
    updateError('repPasswordError', approvedRepPasswordError);

    if (approvedEmailError || approvedNameError || approvedPasswordError || approvedRepPasswordError) {
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/Registration', state);

      if (res.status === 201) {
        document.cookie = `email=${state.email}; path=/`;
        document.cookie = `name=${state.name}; path=/`;

        dispatch({ name: 'email', value: '' });
        dispatch({ name: 'name', value: '' });
        dispatch({ name: 'password', value: '' });
        dispatch({ name: 'repPassword', value: '' });

        localStorage.setItem('remember', 'true');
        navigate('/Tasks', { replace: true });
      }
    } catch (error) {
      if (error.response && (error.response.status === 409 || error.response.status === 503)) {
        setExistedEmailError(error.response.data.message);
      } else {
        setExistedEmailError('Network error or server not responding');
      }

      console.log('error', error);
    }
  };

  return (
    <div className={classes.login}>
      {existedEmailError && <p className={classes.loginError}>{existedEmailError}</p>}
      <div className={classes.loginBody}>
        <div className={classes.loginBodyTitle}>
          <h1>Task Tracker</h1>
        </div>
        <div className={classes.loginBodyFields}>
          <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className={classes.inputDiv}>
              {error.emailError && <p className={classes.errorMessage}>{error.emailError}</p>}
              <input
                className={classes.input}
                type="text"
                placeholder="Email"
                name="email"
                value={state.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
                ref={emailRef}
                required
              />
            </div>
            <div className={classes.inputDiv}>
              {error.nameError && <p className={classes.errorMessage}>{error.nameError}</p>}
              <input
                className={classes.input}
                type="text"
                placeholder="Username"
                name="name"
                value={state.name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                ref={nameInputRef}
                required
              />
            </div>
            <div className={classes.inputDiv}>
              {error.passwordError && <p className={classes.errorMessage}>{error.passwordError}</p>}
              <input
                className={classes.loginBodyFields}
                type="password"
                placeholder="Password"
                name="password"
                value={state.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, repPasswordInputRef)}
                ref={passwordInputRef}
                required
              />
            </div>
            <div className={classes.inputDiv}>
              {error.repPasswordError && <p className={classes.errorMessage}>{error.repPasswordError}</p>}
              <input
                className={classes.loginBodyFields}
                type="password"
                placeholder="Repeat Password"
                name="repPassword"
                value={state.repPassword}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, null)}
                ref={repPasswordInputRef}
                required
              />
            </div>
            <div className={classes.loginBodyButton}>
              <button type="submit">Registration</button>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.loginBackToLogin}>
        <p>Back to</p>
        <Link className={classes.loginBackToLoginLink} to="/Login">
          Login
        </Link>
      </div>
    </div>
  );
}
