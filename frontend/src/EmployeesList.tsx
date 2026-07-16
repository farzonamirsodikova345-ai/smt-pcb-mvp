import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateUserRole } from './api';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
}

function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token') || '';
  const myId = JSON.parse(atob(token.split('.')[1] || 'e30=')).id;

  const load = () => {
    getEmployees(token).then(setEmployees);
  };

  useEffect(() => {
    load();
  }, []);

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
      load();
      setTimeout(() => setShowForm(false), 800);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Ошибка добавления сотрудника');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    await updateUserRole(token, id, newRole);
    load();
  };

  return (
    <div>
      <h2>Сотрудники</h2>

      <button className="add-employee-toggle" onClick={() => setShowForm(!showForm)}>
        {showForm ? '− Скрыть форму' : '+ Добавить сотрудника'}
      </button>

      {showForm && (
        <div className="add-employee-form-wrap">
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Имя сотрудника" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email сотрудника" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Должность" value={position} onChange={(e) => setPosition(e.target.value)} />
            <input type="password" placeholder="Временный пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Сохранить сотрудника</button>
          </form>
        </div>
      )}

      <h2 style={{ marginTop: '24px' }}>Список сотрудников</h2>
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp._id} className="employee-card">
            <div className="employee-name">{emp.name}</div>
            {emp.position && <div className="employee-position">{emp.position}</div>}
            <div className="employee-email">{emp.email}</div>
            <div className="employee-role-row">
              <span className={`role-pill role-${emp.role}`}>
                {emp.role === 'admin' ? 'Администратор' : 'Сотрудник'}
              </span>
              {emp._id !== myId && (
                <button
                  className="role-switch-btn"
                  onClick={() => handleRoleChange(emp._id, emp.role === 'admin' ? 'employee' : 'admin')}
                >
                  {emp.role === 'admin' ? 'Сделать сотрудником' : 'Сделать админом'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeesList;