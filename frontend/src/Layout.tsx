import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images.png';

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('position');
    window.location.href = '/login';
  };

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="page-container">
      <div className="brand-block">
        <img src={logo} alt="ARTEL" className="brand-logo" />
        <span className="brand-text">ARTEL</span>
      </div>

      <div className="nav-menu">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => go('/')}>Главная</button>
            <button onClick={() => go('/tasks')}>Список задач</button>
            {isAdmin && <button onClick={() => go('/create-task')}>Составить задачу</button>}
            {isAdmin && <button onClick={() => go('/employees')}>Список сотрудников</button>}
            <button onClick={() => go('/checklists')}>Чек-листы</button>
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">Выйти</button>

      <h1>SMT-PCB</h1>
      <div className="user-info">
        <div className="user-name">{localStorage.getItem('name')}</div>
        {localStorage.getItem('position') && (
          <div className="user-position">{localStorage.getItem('position')}</div>
        )}
      </div>

      {children}
    </div>
  );
}

export default Layout;