import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from './api';

function AddEmployeePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await createEmployee(token, name, email, password, position);
      setMessage('Сотрудник успешно добавлен');
      setName('');
      setEmail('');
      setPassword('');
      setPosition('');
      setTimeout(() => navigate('/employees'), 800);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Ошибка добавления сотрудника');
    }
  };

  return (
    <div>
      <h2>Добавить сотрудника</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Имя сотрудника" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email сотрудника" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Должность" value={position} onChange={(e) => setPosition(e.target.value)} />
        <input type="password" placeholder="Временный пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Добавить сотрудника</button>
      </form>
    </div>
  );
}

export default AddEmployeePage;