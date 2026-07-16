import { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from './api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: { name: string; email: string };
  dueDate?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  todo: 'К выполнению',
  in_progress: 'В процессе',
  done: 'Готово'
};

function StatusIcon({ status }: { status: string }) {
  if (status === 'done') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#43a047" />
        <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'in_progress') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1e88e5" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#fb8c00" strokeWidth="2.5" strokeDasharray="4 3" />
    </svg>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || 'employee';
  const isAdmin = role === 'admin';

  const seenKey = 'seenTaskIds';
  const getSeenIds = (): string[] => JSON.parse(localStorage.getItem(seenKey) || '[]');
  const markAllSeen = (ids: string[]) => {
    const seen = new Set([...getSeenIds(), ...ids]);
    localStorage.setItem(seenKey, JSON.stringify([...seen]));
  };

  const loadTasks = async () => {
    const data = await getTasks(token);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: string) => {
    await updateTaskStatus(token, taskId, status);
    loadTasks();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(token, taskId);
    loadTasks();
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  };

  const isNew = (task: Task) => !isAdmin && !getSeenIds().includes(task._id);

  useEffect(() => {
    if (tasks.length && !isAdmin) {
      const timer = setTimeout(() => markAllSeen(tasks.map(t => t._id)), 2000);
      return () => clearTimeout(timer);
    }
  }, [tasks]);

  const formatDate = (d?: string) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div>
      <h2>Список задач</h2>

      <ul className="task-list">
        {tasks.map((task) => {
          const overdue = isOverdue(task);
          return (
            <li key={task._id} className={`task-card task-${task.status} ${overdue ? 'task-overdue' : ''}`}>
              <div className="task-info">
                <span className="task-icon"><StatusIcon status={task.status} /></span>
                <div className="task-body">
                  <div className="task-title-row">
                    <span className="task-title">{task.title}</span>
                    {isNew(task) && <span className="badge-new">Новая</span>}
                  </div>
                  {isAdmin && task.assignedTo && (
                    <div className="task-assignee">Исполнитель: <strong>{task.assignedTo.name}</strong></div>
                  )}
                  {task.description && <p className="task-desc">{task.description}</p>}
                  {task.dueDate && (
                    <p className={`task-due ${overdue ? 'task-due-overdue' : ''}`}>
                      {overdue ? 'Просрочено: ' : 'Срок: '}{formatDate(task.dueDate)}
                    </p>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <span className={`status-pill status-pill-${task.status}`}>{STATUS_LABELS[task.status]}</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="todo">К выполнению</option>
                  <option value="in_progress">В процессе</option>
                  <option value="done">Готово</option>
                </select>
                {isAdmin && (
                  <button onClick={() => handleDelete(task._id)}>Удалить</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Tasks;