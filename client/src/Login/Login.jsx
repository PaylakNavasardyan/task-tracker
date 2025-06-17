import { useState, useRef } from 'react';
import classes from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const nameInputRef = useRef();
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
      name,
      password,
      remember
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        document.cookie = `name=${name}; path=/`;
        document.cookie = `remember me=${remember}; path=/`;

        await axios.post('http://localhost:5000/Login', payload)
      } catch(error) {
        console.error('error', error)
      }
    }
    
  return (
    <div className={classes.login}>
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
                  placeholder='Username'
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                  ref={nameInputRef}
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
