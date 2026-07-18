import { useState, useEffect } from 'react';
import { getTasks } from './api';

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

function Reports() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    getTasks(token).then(setTasks);
  }, []);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <h2>Отчёты</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Выполнено {done} из {total} ({pct}%)
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px 12px' }}>Название</th>
            <th style={{ padding: '10px 12px' }}>Описание</th>
            <th style={{ padding: '10px 12px' }}>Сотрудник</th>
            <th style={{ padding: '10px 12px' }}>Дедлайн</th>
            <th style={{ padding: '10px 12px' }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const color = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
            return (
              <tr key={task._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{task.title}</td>
                <td style={{ padding: '10px 12px', color: '#555' }}>{task.description || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{task.assignedTo?.name || '—'}</td>
                <td style={{ padding: '10px 12px' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: color.bg,
                    color: color.color,
                    fontWeight: 600,
                    fontSize: 13,
                  }}>
                    {STATUS_LABELS[task.status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {tasks.length === 0 && <p style={{ color: '#999', marginTop: 16 }}>Задач пока нет</p>}
    </div>
  );
}

export default Reports;