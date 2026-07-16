import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const createEmployee = async (token: string, name: string, email: string, password: string, position: string) => {
  const response = await axios.post(
    `${API_URL}/auth/create-employee`,
    { name, email, password, position },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getTasks = async (token: string) => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createTask = async (token: string, title: string, description: string, assignedTo: string, dueDate: string) => {
  const response = await axios.post(
    `${API_URL}/tasks`,
    { title, description, assignedTo, dueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateTaskStatus = async (token: string, taskId: string, status: string) => {
  const response = await axios.patch(
    `${API_URL}/tasks/${taskId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteTask = async (token: string, taskId: string) => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getEmployees = async (token: string) => {
  const response = await axios.get(`${API_URL}/tasks/users/list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
