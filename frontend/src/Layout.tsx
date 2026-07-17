import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 11l9-8 9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TasksIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EmployeesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChecklistIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { label: 'Главная', path: '/', icon: <HomeIcon /> },
    { label: 'Задачи', path: '/tasks', icon: <TasksIcon /> },
    { label: 'Сотрудники', path: '/employees', icon: <EmployeesIcon /> },
    { label: 'Чек-листы', path: '/checklists', icon: <ChecklistIcon /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', margin: 0, overflowX: 'hidden' }}>
      <main
        style={{
          flex: 1,
          padding: isMobile ? 10 : 24,
          background: '#f5f5f7',
          order: 1,
          minWidth: 0,
          overflowX: 'visible',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      <aside
        style={{
          width: collapsed ? 64 : 220,
          flexShrink: 0,
          transition: 'width 0.2s',
          background: '#1B3A2A',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 8px',
          order: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '0 8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              borderRadius: 8,
              padding: '10px',
              flex: collapsed ? 'none' : 1,
              minWidth: 0,
              minHeight: 52,
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#c0392b', flexShrink: 0 }} />
            {!collapsed && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 16, color: '#000' }}>Artel</span>
                <span style={{ fontWeight: 400, fontSize: 10, color: '#000' }}>PCB Manufacturing</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {collapsed ? '«' : '»'}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: active ? '#2E6B4F' : isHovered ? '#245640' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default Layout;