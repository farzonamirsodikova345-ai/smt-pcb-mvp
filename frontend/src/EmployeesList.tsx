import { useState, useEffect } from 'react';
import { getEmployees } from './api';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
}

function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    getEmployees(token).then(setEmployees);
  }, []);

  return (
    <div>
      <h2>Список сотрудников</h2>
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp._id} className="employee-card">
            <div className="employee-name">{emp.name}</div>
            {emp.position && <div className="employee-position">{emp.position}</div>}
            <div className="employee-email">{emp.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeesList;