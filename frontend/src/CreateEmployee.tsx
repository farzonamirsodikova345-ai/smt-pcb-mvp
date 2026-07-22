import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createEmployee } from './api';
import './CreateEmployee.css';

export default function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('operator');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Заполните имя, email и пароль');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      await createEmployee(token, name, email, password, position, role);
      navigate('/employees');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не удалось создать сотрудника');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-employee-page">
      <button className="btn-back" onClick={() => navigate('/employees')}>
        <ArrowLeft size={18} />
        <span>Назад к списку</span>
      </button>

      <h1 className="create-employee-title">Добавить сотрудника</h1>

      <form className="create-employee-form" onSubmit={handleSubmit}>
        {error && <div className="create-employee-error">{error}</div>}

        <label className="field-label">Имя</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван Иванов"
        />

        <label className="field-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="employee@company.com"
        />

        <label className="field-label">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <label className="field-label">Должность</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Например: Монтажник SMT"
        />

        <label className="field-label">Статус</label>
        <select
          className="field-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="operator">Оператор</option>
          <option value="engineer">Инженер</option>
          <option value="technologist">Технолог</option>
          <option value="admin">Админ</option>
        </select>

        <button className="btn-submit" type="submit" disabled={saving}>
          {saving ? 'Создание...' : 'Создать сотрудника'}
        </button>
      </form>
    </div>
  );
}