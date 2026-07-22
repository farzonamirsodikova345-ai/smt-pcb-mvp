import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask, getEmployees } from './api';
interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: { name: string; email: string; position?: string };
  createdBy?: { name: string; email: string; position?: string };
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

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7faf7', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px', fontSize: 12, color: '#1b5e20', textTransform: 'uppercase' }}>Название</th>
              <th style={{ padding: '10px 14px', fontSize: 12, color: '#1b5e20', textTransform: 'uppercase' }}>Описание</th>
              <th style={{ padding: '10px 14px', fontSize: 12, color: '#1b5e20', textTransform: 'uppercase' }}>Исполнитель</th>
              <th style={{ padding: '10px 14px', fontSize: 12, color: '#1b5e20', textTransform: 'uppercase' }}>Кем поручено</th>
              <th style={{ padding: '10px 14px', fontSize: 12, color: '#1b5e20', textTransform: 'uppercase' }}>Статус</th>
              {isAdmin && <th style={{ padding: '10px 14px' }} />}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const currentStatus = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
              return (
                <tr key={task._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1b5e20', fontSize: 14 }}>
                    {task.title}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#555', fontSize: 13, maxWidth: 260 }}>
                    {task.description || '—'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#388e3c', fontSize: 13, fontWeight: 600 }}>
                    {task.assignedTo ? (
                      <>
                        👤 {task.assignedTo.name}
                        {task.assignedTo.position && (
                          <span style={{ color: '#999', fontWeight: 400 }}> · {task.assignedTo.position}</span>
                        )}
                      </>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#555', fontSize: 13 }}>
                    {task.createdBy ? (
                      <>
                        {task.createdBy.name}
                        {task.createdBy.position && (
                          <span style={{ color: '#999' }}> · {task.createdBy.position}</span>
                        )}
                      </>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 20,
                        border: 'none',
                        background: currentStatus.bg,
                        color: currentStatus.color,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 20,
                          border: 'none',
                          background: '#e53935',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: 12,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && <p style={{ color: '#999', marginTop: 12 }}>Задач пока нет</p>}
    </div>
  );
}

export default Tasks;