import { useState, useEffect } from 'react';
import { getEmployees, updateUserRole } from './api';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  role: string;
}

function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const token = localStorage.getItem('token') || '';
  const myId = JSON.parse(atob(token.split('.')[1] || 'e30=')).id;

  const load = () => {
    getEmployees(token).then(setEmployees);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    await updateUserRole(token, id, newRole);
    load();
  };

  return (
    <div>
      <h2>Список сотрудников</h2>
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