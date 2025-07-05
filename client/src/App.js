import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Forgot from './Forgot/Forgot';
import Tasks from './Tasks/Tasks';

function App() {
  const remember = localStorage.getItem('remember');
  const isLoggedIn = remember === 'true';

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/Tasks" : "/Login"} replace />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/Forgot" element={<Forgot />} />
          <Route path="/Tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/Login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
