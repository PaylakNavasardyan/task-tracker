import { useRef, useState } from 'react';
import classes from './Registration.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, SetRepPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repPasswordError, SetRepPasswordError] = useState('');

    const [existedEmailError, setExistedEmailError] = useState('');

    const emailRef = useRef();
    const nameInputRef = useRef();
    const passwordInputRef = useRef();
    const repPasswordInputRef = useRef();

    const navigate = useNavigate();

    const handleKeyDown = (e, nextRef) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextRef?.current?.focus()
      }
    };

    const handleClik = () => {
      setRemember(!remember)
    };

    const validEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address'
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
        };

        if (nameChars.length === name.length) {
          return 'The Name cannot contain only the same characters'
        };      
      }

      if (!startsWithLetterRegex.test(name)) {
        return 'Your name must start with Latin letter'
      } else if (!lettersAndNumbersOnlyRegex.test(name)) {
        return 'Your name must contain only Latin letters and numbers'
      } else if (name.length < 3) {
        return 'Your name cannot contain fewer than 4 characters'
      } else if (name.length > 15) {
        return 'Your name cannot contain more than 15 charactes'
      }
      return '';
    }

    const validPassword = (password) => {
      const startsWithLetterRegex = /^[a-zA-Z]/;
      const passCharactersRegex = /^[a-zA-Z0-9_.-]+$/;
      let passFirstChar = password.charAt(0).toLowerCase();
      let passChars = '';

      for (let i = 0; i < password.length; i++) {
        if (password[i].toLowerCase() === passFirstChar) {
          passChars += password[i];
        };

        if (passChars.length === password.length) {
          return 'The Password cannot contain only the same characters'
        };      
      }
      
      if (!startsWithLetterRegex.test(password)) {
        return 'Password must start with Latin letter'
      } else if (!passCharactersRegex.test(password)) {
        return 'Password can contain only Latin letters numbers and (-, _, .)'
      } else if (password.length < 6) {
        return 'Password cannot contain fewer than 6 characters'
      } else if (password.length > 15) {
        return 'Password cannot contain more than 15 characters'
      } 
      return '';
    }

    const validRepPassword = (password,repPassword) => {
      if (repPassword !== password) {
        return 'Repeat Password does not match with Password'
      }
      return '';
    }

    const payload = {
      email,
      name,
      password,
      repPassword,
      remember
    };

    const handleSubmit = async(e) => {
      e.preventDefault();

      const approvedEmailError = validEmail(email);
      setEmailError(approvedEmailError);

      const approvedNameError = validName(name);
      setNameError(approvedNameError);

      const approvedPasswordError = validPassword(password);
      setPasswordError(approvedPasswordError);

      const approvedRepPasswordError = validRepPassword(password, repPassword);
      SetRepPasswordError(approvedRepPasswordError);

      if (approvedEmailError || approvedNameError || approvedPasswordError || approvedRepPasswordError) {
        return
      };

      try {
        const res = await axios.post('http://localhost:5000/Registration', payload);  

        if (res.status === 201) {
          document.cookie = `email=${email}; path=/`;
          document.cookie = `name=${name}; path=/`;
          document.cookie = `remember me=${remember}; path=/`;
  
          setEmail('');
          setName('');
          setPassword('');
          SetRepPassword('');
          setRemember(false);

          navigate('/Tasks');
        }
      } catch(error) {
        if (error.response && (error.response.status === 409 || error.response.status === 503)) {
          setExistedEmailError(error.response.data.message);
        } else {
          setExistedEmailError('Network error or server not responding')
        }

        console.log('error', error);
      }
    }

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
                {emailError && <p className={classes.errorMessage}>{emailError}</p>}
                <input 
                    className={classes.input}
                    type="text"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
                    ref={emailRef}
                    required
                />
              </div>
              <div className={classes.inputDiv}>
                {nameError && <p className={classes.errorMessage}>{nameError}</p>}
                <input 
                    className={classes.input}
                    type="text"
                    placeholder='Username'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                    ref={nameInputRef}
                    required
                />
              </div>
              <div className={classes.inputDiv}>
                {passwordError && <p className={classes.errorMessage}>{passwordError}</p>}
                <input 
                    className={classes.loginBodyFields}
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, repPasswordInputRef)}
                    ref={passwordInputRef}
                    required
                />
              </div>
              <div className={classes.inputDiv}>
                {repPasswordError && <p className={classes.errorMessage}>{repPasswordError}</p>}
                <input 
                    className={classes.loginBodyFields}
                    type='password'
                    placeholder='Repeat Password'
                    value={repPassword}
                    onChange={(e) => SetRepPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, null)}
                    ref={repPasswordInputRef}
                    required
                />
              </div>
              <div className={classes.loginBodyFieldsDown}>
                <div className={classes.loginBodyFieldsDownRemember}>
                  <input
                    className={classes.loginBodyRadio} 
                    type='checkbox'
                    checked={remember}
                    onChange={handleClik}
                  />
                  <span>Remember me</span>  
                </div>
              </div>
              <div className={classes.loginBodyButton}> 
                <button type='submit'>Registration</button>
              </div>
            </form>
        </div>
      </div>
      <div className={classes.loginBackToLogin}>
        <p>Back to</p>
        <Link
          className={classes.loginBackToLoginLink}
          to='/'
        >Login</Link>
      </div>
    </div>
  )
}
