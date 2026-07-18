import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Tasks from './Tasks';
import CreateTask from './CreateTask';
import Home from './Home';
import Checklists from './CheckLists';
import Equipment from './Equipment';
import EmployeesList from './EmployeesList';
import Layout from './Layout';
import logo from './assets/images (1).png';
import './App.css';
import Reports from './Reports';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  const AuthBrand = () => (
    <div className="brand-block">
      <img src={logo} alt="ARTEL" className="brand-logo" />
      <span className="brand-text">ARTEL</span>
    </div>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" />
          ) : (
            <div className="page-container">
              <AuthBrand />
              <h1>SMT-PCB</h1>
              <Login onSuccess={() => { setIsLoggedIn(true); navigate('/'); }} />
            </div>
          )
        }
      />
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Layout>
              <Home />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/tasks"
        element={
          isLoggedIn ? (
            <Layout>
              <Tasks />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/create-task"
        element={
          isLoggedIn && isAdmin ? (
            <Layout>
              <CreateTask />
            </Layout>
          ) : (
            <Navigate to="/tasks" />
          )
        }
      />
      <Route
        path="/employees"
        element={
          isLoggedIn && isAdmin ? (
            <Layout>
              <EmployeesList />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
  path="/reports"
  element={
    isLoggedIn ? (
      <Layout>
        <Reports />
      </Layout>
    ) : (
      <Navigate to="/login" />
    )
  }
/>
      <Route
        path="/checklists"
        element={
          isLoggedIn ? (
            <Layout>
              <Checklists />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
  path="/equipment"
  element={
    isLoggedIn ? (
      <Layout>
        <Equipment />
      </Layout>
    ) : (
      <Navigate to="/login" />
    )
  }
/>
      <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} />} />
    </Routes>
  );
}

export default App;