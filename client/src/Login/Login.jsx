import { useState, useRef } from 'react';
import classes from './Login.module.css';
import { Link } from 'react-router-dom';

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

  return (
    <div className={classes.login}>
      <div className={classes.loginBody}>
        <div className={classes.loginBodyTitle}>
            <h1>Task Tracker</h1>
        </div>
        <div className={classes.loginBodyFields}>
            <h2>Login</h2>
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
            <input 
                className={classes.loginBodyFields}
                type='password'
                placeholder='Password'
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
