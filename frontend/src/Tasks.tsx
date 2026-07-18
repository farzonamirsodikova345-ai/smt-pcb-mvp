import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask, getEmployees } from './api';
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
  done: 'Готово',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  todo: { bg: '#fff3e0', color: '#fb8c00' },
  in_progress: { bg: '#e3f2fd', color: '#1e88e5' },
  done: { bg: '#e8f5e9', color: '#43a047' },
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
  const [employees, setEmployees] = useState<{ _id: string; name: string; position?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || 'employee';
  const isAdmin = role === 'admin';

  const loadTasks = async () => {
    const data = await getTasks(token);
    setTasks(data);
  };

 useEffect(() => {
    loadTasks();
    getEmployees(token).then(setEmployees).catch(() => {});
  }, []);

  const handleStatusChange = async (taskId: string, status: string) => {
    await updateTaskStatus(token, taskId, status);
    loadTasks();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(token, taskId);
    loadTasks();
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError('');
     try {
      await createTask(token, title, description, assignedTo, dueDate);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      setShowForm(false);
      loadTasks();
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить задачу');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Список задач</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: '#2e7d32',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', width: 200 }}
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="">Без исполнителя</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}{emp.position ? ` · ${emp.position}` : ''}
              </option>
            ))}
          </select>
          {error && <div style={{ color: '#e53935', fontSize: 13 }}>{error}</div>}
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: '#2e7d32',
              color: '#fff',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {saving ? 'Сохранение...' : 'Создать'}
          </button>
        </div>
      )}

      <ul className="task-row-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((task) => {
          const currentStatus = STATUS_COLORS[task.status] || STATUS_COLORS.todo;

          return (
            <li
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 8,
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 220, background: 'transparent', padding: 0, boxShadow: 'none' }}>
                <StatusIcon status={task.status} />
                <div style={{ minWidth: 0, flex: 1, background: 'transparent', padding: 0, boxShadow: 'none' }}>
                  <div style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
                    <span style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Название</span>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1b5e20', wordBreak: 'break-word' }}>
                      {task.title}
                    </div>
                  </div>

                  {task.description && (
                    <div style={{ marginTop: 6, background: 'transparent', padding: 0, boxShadow: 'none' }}>
                      <span style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Описание</span>
                      <div style={{ color: '#555', fontSize: 13, wordBreak: 'break-word' }}>
                        {task.description}
                      </div>
                    </div>
                  )}

                  {task.assignedTo && (
                    <div style={{ marginTop: 6, background: 'transparent', padding: 0, boxShadow: 'none' }}>
                      <span style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Исполнитель</span>
                      <div style={{ color: '#388e3c', fontSize: 13, fontWeight: 600 }}>
                        👤 {task.assignedTo.name}
                        {task.assignedTo.position && (
                          <span style={{ color: '#999', fontWeight: 400 }}> · {task.assignedTo.position}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, background: 'transparent', padding: 0, boxShadow: 'none' }}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 20,
                    border: 'none',
                    background: currentStatus.bg,
                    color: currentStatus.color,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: 'none',
                      background: '#e53935',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Удалить
                  </button>
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