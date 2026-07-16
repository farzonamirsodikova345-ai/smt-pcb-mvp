import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getEmployees } from './api';

interface Employee {
  _id: string;
  name: string;
  email: string;
}

function CreateTask() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees(token).then(setEmployees);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(token, title, description, assignedTo, dueDate);
      setMessage('Задача успешно создана');
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      setTimeout(() => navigate('/tasks'), 800);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Ошибка создания задачи');
    }
  };

  return (
    <div>
      <h2>Составление задачи</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
          <option value="">Выберите сотрудника</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
        <label className="due-date-label">
          Срок выполнения
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <button type="submit">Добавить задачу</button>
      </form>
    </div>
  );
}

export default CreateTask;