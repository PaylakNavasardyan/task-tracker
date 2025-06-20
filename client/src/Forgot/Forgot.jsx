import { useReducer, useRef } from 'react'
import classes from './Forgot.module.css'

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
        <div className={classes.forgotBody}>  
            <div className={classes.forgotBodyTitle}>
                <h1>Task Tracker</h1>
            </div>
            <div className={classes.forgotBodyLine}></div>

            <div className={classes.forgotBodyFields}>
                <h2>Forgot Password</h2>
                <form>
                    <input 
                        className={classes.input}
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                        ref={emailInputRef}
                        onKeyDown={handleKeyDown(e, newPasswordInputRef)}
                        required
                    />
                    <input
                        className={classes.input}
                        type='password'
                        placeholder='New Password'
                        name='password'
                        value={newPassword}
                        onChange={handleChange}
                        ref={newPasswordInputRef}
                        onKeyDown={handleKeyDown(e, repNewPasswordInputRef)}
                        required
                    />
                    <input
                        className={classes.input}
                        type='password'
                        placeholder='Repeat New Password'
                        name='reNewPassword'
                        value={repNewPassword}
                        onChange={handleChange}
                        ref={repNewPasswordInputRef}
                        onKeyDown={handleKeyDown(e, undefined)}
                        required
                    />
                </form>
            </div>
        </div>
    </div>
  )
}
