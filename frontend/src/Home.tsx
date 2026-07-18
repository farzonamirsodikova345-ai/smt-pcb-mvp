import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getEmployees } from './api';

interface Task {
  _id: string;
  title: string;
  status: string;
  dueDate?: string;
  createdAt: string;
  assignedTo?: { name: string; email: string };
}

interface Employee {
  _id: string;
  name: string;
  position?: string;
  createdAt: string;
}

function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  const name = localStorage.getItem('name') || '';
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    getTasks(token).then(setTasks);
    if (isAdmin) {
      getEmployees(token).then(setEmployees);
    }
  }, []);

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const overdue = tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()).length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const now = new Date();
  const todayLabel = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const pct = (n: number) => total ? Math.round((n / total) * 100) : 0;

  const statusLabel: Record<string, string> = { todo: 'К выполнению', in_progress: 'В процессе', done: 'Готово' };

  const featureCards = [
  { icon: '📋', title: 'Производственные чек-листы', sub: 'Проверки и контроль', path: '/checklists' },
  { icon: '📊', title: 'Отчёты', sub: `Выполнено ${done} из ${total}`, path: '/reports' },
  { icon: '⚙️', title: 'Оборудование', sub: 'Статус линий (SMT)', path: '/equipment' },
  { icon: '📦', title: 'Материалы и компоненты', sub: 'Склад и поставки', path: '/tasks' },
  ...(isAdmin
    ? [{ icon: '👥', title: 'Пользователи', sub: 'Управление доступом', path: '/employees' }]
    : []),
];

  return (
    <div>
      <section className="hero-section">
        <div className="hero-tag">— Рады видеть вас снова!</div>
        <h1 className="hero-title">
  Добро пожаловать, <span className="hero-name">{name} 👋</span>
</h1>
        <p className="hero-subtitle">Система управления производством печатных плат (SMT-PCB)</p>
        <div className="hero-meta">
          <span className="hero-meta-item">📅 {todayLabel}</span>
          <span className="hero-meta-item">🕒 {timeLabel}</span>
          <span className="hero-meta-item hero-status">
            <i className="status-dot" /> Система активна
          </span>
        </div>
      </section>

      <div className="feature-grid">
        {featureCards.map((c) => (
          <div key={c.title} className="feature-card" onClick={() => navigate(c.path)}>
            <div className="feature-icon">{c.icon}</div>
            <div className="feature-title">{c.title}</div>
            <div className="feature-sub">{c.sub}</div>
            <div className="feature-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">📈 График выполнения задач</h3>
        <div className="chart-bar-wrap">
          <div className="chart-bar">
            <div className="chart-segment chart-todo" style={{ width: `${pct(todo)}%` }} />
            <div className="chart-segment chart-progress" style={{ width: `${pct(inProgress)}%` }} />
            <div className="chart-segment chart-done" style={{ width: `${pct(done)}%` }} />
          </div>
          <div className="chart-legend">
            <span><i className="dot dot-todo" /> К выполнению — {todo}</span>
            <span><i className="dot dot-progress" /> В процессе — {inProgress}</span>
            <span><i className="dot dot-done" /> Готово — {done}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">📋 Последние задачи</h3>
        {recentTasks.length === 0 && <p className="empty-hint">Задач пока нет</p>}
        <ul className="mini-list">
          {recentTasks.map(t => (
            <li key={t._id} className="mini-list-item">
              <span className="mini-list-title">{t.title}</span>
              <span className={`status-pill status-pill-${t.status}`}>{statusLabel[t.status]}</span>
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="dashboard-section">
          <h3 className="section-title">👷 Последние сотрудники</h3>
          {recentEmployees.length === 0 && <p className="empty-hint">Сотрудников пока нет</p>}
          <ul className="mini-list">
            {recentEmployees.map(e => (
              <li key={e._id} className="mini-list-item">
                <span className="mini-list-title">{e.name}</span>
                {e.position && <span className="mini-list-sub">{e.position}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="dashboard-section">
        <h3 className="section-title">🔔 Уведомления</h3>
        {overdue > 0 ? (
          <p className="notif-warning">У вас {overdue} просроченных задач</p>
        ) : (
          <p className="empty-hint">Новых уведомлений нет</p>
        )}
      </div>

      <div className="quote-strip">
        <span className="quote-text">Качество — наша ответственность, эффективность — наш результат.</span>
        <span className="quote-tags">PCB · SMT · Quality · Reliability</span>
      </div>
    </div>
  );
}

export default Home;