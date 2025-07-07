import { useState, useRef } from 'react';
import classes from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const handleKeyDown = (e, nextRef) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextRef?.current?.focus();
      }
    };
    
    const handleClik = () => {
      setRemember(!remember)
    };

    const payload = {
      email,
      password,
      remember
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const res = await axios.post('http://localhost:5000/Login', payload)

        if (res.status === 201) {
          document.cookie = `email=${email}; path=/`;
          localStorage.setItem('remember', remember.toString());
          localStorage.setItem('loggedIn', 'true');

          setEmail('');
          setPassword('');
          setRemember(false);

          navigate('/Tasks');
         } 
      } catch(error) {
        if (error.response && [400, 401, 404].includes(error.response.status)) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError('Network error or server not responding');
        }

        console.error('error', error)
      }
    }
    
  return (
    <div className={classes.login}>
      {loginError && <p className={classes.loginError}>{loginError}</p>}
      <div className={classes.loginBody}>
        <div className={classes.loginBodyTitle}>
            <h1>Task Tracker</h1>
        </div>
        <div className={classes.loginBodyFields}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <input 
                  className={classes.input}
                  type="text"
                  placeholder='Email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                  ref={emailInputRef}
                  required
              />
              <input 
                  className={classes.loginBodyFields}
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, undefined)}
                  ref={passwordInputRef}
                  required
              />
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
                  <Link
                    className={classes.loginBodyLink}
                    to='/Forgot'
                  >Forgot password</Link>
              </div>
              <div className={classes.loginBodyButton}> 
                <button>Login</button>
              </div>
            </form>
        </div>
      </div>
      <div className={classes.loginBackToRagistration}>
        <p>If you haven't registered yet, click here</p>
        <Link
          className={classes.loginBackToRagistrationLink}
          to='/Registration'
        >Registration</Link>
      </div>
    </div>
  )
}
