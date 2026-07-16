import { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from './api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: { name: string; email: string; position?: string };
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#43a047" />
        <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'in_progress') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1e88e5" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#fb8c00" strokeWidth="2.5" strokeDasharray="4 3" />
    </svg>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || 'employee';
  const isAdmin = role === 'admin';

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

  return (
    <div>
      <h2>Список задач</h2>

      <ul className="task-row-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-row">
            <span className="task-row-icon"><StatusIcon status={task.status} /></span>

            <div className="task-row-main">
              <div className="task-row-title">{task.title}</div>
              {task.description && <div className="task-row-desc">{task.description}</div>}
            </div>

            {isAdmin && task.assignedTo && (
              <div className="task-row-assignee">
                <div className="task-row-assignee-name">{task.assignedTo.name}</div>
                {task.assignedTo.position && (
                  <div className="task-row-assignee-position">{task.assignedTo.position}</div>
                )}
              </div>
            )}

            <div className="task-row-end">
              {isAdmin ? (
                <button className="task-delete-btn" onClick={() => handleDelete(task._id)}>Удалить</button>
              ) : (
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="todo">К выполнению</option>
                  <option value="in_progress">В процессе</option>
                  <option value="done">Готово</option>
                </select>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;