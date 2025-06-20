import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Forgot from './Forgot/Forgot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element = {
            <Login />
          }/>
          
          <Route path={'/Registration'} element = {
            <Registration />
          }/>

          <Route path={'/Forgot'} element = {
            <Forgot />
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
