import { useState } from 'react'
import classes from './TasksHeader.module.css'
import { IoMdSettings, IoIosLogOut } from "react-icons/io"
import { BiLogoGmail } from "react-icons/bi";
import { MdDriveFileRenameOutline, MdDelete  } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function TasksHeader() {
    const [show, setShow] = useState(false);

    const navigate = useNavigate();
    
    const handleClick = () => {
        setShow((show) => !show)
    };
    
    function getCookie(name) {
        const cookieName = name + '=';
        const cookiesArray = document.cookie.split(';');

        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i];

            cookie = cookie.trim();

            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length);
            }
        }
         return null; 
    }

    const userEmail = getCookie('email');
    console.log('User Email from Cookie:', userEmail);

    const onLogOutClikc = () => {
        navigate('/Login')
    };

  return (
    <div className={classes.header}>  
        <h2>Task Tracker</h2>

        <div className={classes.headerBodySettingIcon}>
            <div className={classes.setting}>
                <IoMdSettings 
                    size={'25px'}
                    cursor={'pointer'}
                    onClick={handleClick}    
                />    
            </div>    
            <div className={show ? classes.settingMenu : classes.hiddenSettingMenu}>
                <div className={classes.settingMenuGmail}>
                    <BiLogoGmail 
                        size={'20px'}
                    />
                    {userEmail}
                </div>
                <div className={classes.settingSmallIcon}>
                    <MdDriveFileRenameOutline 
                        size={'20px'}
                    />
                    <p>Rename</p>
                </div>
                <div className={classes.settingSmallIcon}>
                    <IoIosLogOut 
                        size={'20px'}
                    />
                    <p  onClick={onLogOutClikc}>Log Out</p>
                </div>
                <div className={classes.settingSmallIcon}>
                    <MdDelete 
                        size={'20px'}
                    />
                    <p>Delete Account</p>
                </div>
            </div>
        </div>
    </div>
  )
}
