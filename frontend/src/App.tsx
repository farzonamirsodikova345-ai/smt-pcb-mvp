import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Tasks from './Tasks';
import CreateTask from './CreateTask';
import Home from './Home';
import Checklists from './CheckLists';
import CheckListEditor from './CheckListEditor';
import Inspection from './Inspection';
import InspectionHistory from './InspectionHistory';
import Equipment from './Equipment';
import EmployeesList from './EmployeesList';
import CreateEmployee from './CreateEmployee';
import Layout from './Layout';
import './App.css';
import Reports from './Reports';
import EquipmentDetail from './EquipmentDetail';
import Materials from './Materials';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    checkAuth();
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" />
          ) : (
            <Login onSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
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
            <Layout onLogout={handleLogout}>
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
            <Layout onLogout={handleLogout}>
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
            <Layout onLogout={handleLogout}>
              <EmployeesList />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/create-employee"
        element={
          isLoggedIn && isAdmin ? (
            <Layout onLogout={handleLogout}>
              <CreateEmployee />
            </Layout>
          ) : (
            <Navigate to="/employees" />
          )
        }
      />
      <Route
        path="/reports"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
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
            <Layout onLogout={handleLogout}>
              <Checklists />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/checklists/:id"
        element={
          isLoggedIn && isAdmin ? (
            <Layout onLogout={handleLogout}>
              <CheckListEditor />
            </Layout>
          ) : (
            <Navigate to="/checklists" />
          )
        }
      />
      <Route
        path="/checklists/:id/history"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <InspectionHistory />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/inspections/:id"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <Inspection />
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
            <Layout onLogout={handleLogout}>
              <Equipment />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/materials"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <Materials />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/equipment/:id"
        element={
          isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <EquipmentDetail />
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