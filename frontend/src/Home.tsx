import { useState, useEffect } from 'react';
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

  const todayLabel = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  const pct = (n: number) => total ? Math.round((n / total) * 100) : 0;

  const statusLabel: Record<string, string> = { todo: 'К выполнению', in_progress: 'В процессе', done: 'Готово' };

  return (
    <div>
      <div className="dashboard-greeting">
        <h2 className="dashboard-hello">Добро пожаловать, {name} 👋</h2>
        <div className="dashboard-date">{todayLabel}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📌</div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Всего задач</div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">В работе</div>
        </div>
        <div className="stat-card stat-done">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{done}</div>
          <div className="stat-label">Выполнено</div>
        </div>
        <div className="stat-card stat-overdue">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{overdue}</div>
          <div className="stat-label">Просрочено</div>
        </div>
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
    </div>
  );
}

export default Home;