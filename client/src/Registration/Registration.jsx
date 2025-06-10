import { useRef, useState } from 'react';
import classes from './Registration.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, SetRepPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const emailRef = useRef();
    const nameInputRef = useRef();
    const passwordInputRef = useRef();
    const repPasswordInputRef = useRef();

    const handleKeyDown = (e, nextRef) => {
      if (e.key === 'Enter') 
      {
        e.preventDefault();
        nextRef?.current?.focus()
      }
    };

    const handleClik = () => {
      setRemember(!remember)
    };

    const payload = {
      email,
      name,
      password,
      repPassword,
      remember
    };

    const handleSubmit = async() => {
      try {
        document.cookie = `email=${email}; path=/`;
        document.cookie = `name=${name}; path=/`;
        document.cookie = `remember me=${remember}; path=/`;

        setEmail('');
        setName('');
        setPassword('');
        SetRepPassword('');
        setRemember(false);

        await axios.post('http://localhost:5000/Registration', payload);
      }catch(error) {
        console.log('error', error)
      }
    }

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
                onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
                ref={emailRef}
                required
            />
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
                onKeyDown={(e) => handleKeyDown(e, repPasswordInputRef)}
                ref={passwordInputRef}
                required
            />
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
            <form onSubmit={handleSubmit}>
              <div className={classes.loginBodyButton}> 
                <button type='submit'>Login</button>
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
