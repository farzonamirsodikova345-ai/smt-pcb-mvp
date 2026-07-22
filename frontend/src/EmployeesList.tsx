import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, deleteUser } from './api';
import './EmployeesList.css';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  admin: 'Админ',
  technologist: 'Технолог',
  engineer: 'Инженер',
  operator: 'Оператор',
};

export default function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const data = await getEmployees(token);
      setEmployees(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не удалось загрузить сотрудников');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить сотрудника?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token') || '';
      await deleteUser(token, id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не удалось удалить сотрудника');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="employees-list-page">
      <div className="employees-list-header">
        <button
          className="btn-add-employee-link"
          onClick={() => navigate('/create-employee')}
        >
          + Добавить сотрудника
        </button>
      </div>

      {error && <div className="employees-list-error">{error}</div>}

      <div className="employees-list-card">
        <h2 className="employees-list-title">Список сотрудников</h2>
        {loading ? (
          <div className="employees-list-empty">Загрузка...</div>
        ) : employees.length === 0 ? (
          <div className="employees-list-empty">Сотрудников пока нет</div>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Должность</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.position || '—'}</td>
                  <td>{roleLabels[emp.role] || emp.role}</td>
                  <td className="employees-table-actions">
                    {emp.role !== 'admin' && (
                      <button
                        className="btn-delete-employee"
                        onClick={() => handleDelete(emp._id)}
                        disabled={deletingId === emp._id}
                      >
                        {deletingId === emp._id ? '...' : 'Удалить'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}