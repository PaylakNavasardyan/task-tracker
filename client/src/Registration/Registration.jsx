import { useState } from 'react';
import classes from './Registration.module.css';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, SetRepPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleClik = () => {
      setRemember(!remember)
    };
    console.log(setEmail)

  return (
    <div className={classes.login}>
      <div className={classes.loginBody}>
        <div className={classes.loginBodyTitle}>
            <h1>Task Tracker</h1>
        </div>
        <div className={classes.loginBodyFields}>
            <h2>Registration</h2>
            <input 
                className={classes.input}
                type="text"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input 
                className={classes.input}
                type="text"
                placeholder='Username'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input 
                className={classes.loginBodyFields}
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
             <input 
                className={classes.loginBodyFields}
                type='password'
                placeholder='Repeat Password'
                value={repPassword}
                onChange={(e) => SetRepPassword(e.target.value)}
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
            </div>
            <div className={classes.loginBodyButton}> 
              <button>Login</button>
            </div>
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
