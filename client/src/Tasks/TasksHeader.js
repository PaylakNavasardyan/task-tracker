import classes from './TasksHeader.module.css'
import { IoMdSettings } from "react-icons/io"

export default function TasksHeader() {
  return (
    <div className={classes.header}>  
        <h2>Task Tracker</h2>

        <div className={classes.headerBodySettingIcon}>
            <IoMdSettings className={classes.settingIcon} size={'25px'}/>
        </div>
    </div>
  )
}
