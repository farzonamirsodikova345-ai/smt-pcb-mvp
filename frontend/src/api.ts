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

export const createEmployee = async (token: string, name: string, email: string, password: string, position: string, role: string) => {
  const response = await axios.post(
    `${API_URL}/auth/create-employee`,
    { name, email, password, position, role },
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
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateUserRole = async (token: string, userId: string, role: string) => {
  const response = await axios.put(
    `${API_URL}/users/${userId}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteUser = async (token: string, userId: string) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getEquipment = async (token: string) => {
  const response = await axios.get(`${API_URL}/equipment`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface CreateEquipmentPayload {
  name: string;
  description: string;
  photoUrl: string;
  yearOfManufacture?: string;
  purpose?: string;
  functionality?: string;
  workingPrinciple?: string;
}

export const createEquipment = async (token: string, data: CreateEquipmentPayload) => {
  const response = await axios.post(
    `${API_URL}/equipment`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateEquipment = async (token: string, id: string, data: Partial<CreateEquipmentPayload>) => {
  const response = await axios.patch(
    `${API_URL}/equipment/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteEquipment = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/equipment/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface Criterion {
  _id?: string;
  title: string;
  type: 'yesNo' | 'photo' | 'text' | 'info';
  weight: number;
}

export interface Category {
  title: string;
  criteria: Criterion[];
}

export interface Section {
  title: string;
  weight: number;
  categories: Category[];
}

export interface CheckListTemplate {
  _id: string;
  name: string;
  instruction: string;
  color: string;
  linearFlow: boolean;
  allowGalleryUpload: boolean;
  requireGeolocation: boolean;
  sections: Section[];
  updatedBy?: string;
  updatedAt?: string;
  usageCount?: number;
  lastUsedAt?: string | null;
}

export const getCheckLists = async (token: string) => {
  const response = await axios.get(`${API_URL}/checklists`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCheckList = async (token: string, id: string) => {
  const response = await axios.get(`${API_URL}/checklists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createCheckList = async (token: string, data: Partial<CheckListTemplate>) => {
  const response = await axios.post(
    `${API_URL}/checklists`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateCheckList = async (token: string, id: string, data: Partial<CheckListTemplate>) => {
  const response = await axios.patch(
    `${API_URL}/checklists/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteCheckList = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/checklists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface Answer {
  criterionId: string;
  value: any;
}

export interface Inspection {
  _id: string;
  templateId: string;
  templateName: string;
  color: string;
  status: 'in_progress' | 'completed';
  answers: Answer[];
  inspectionDate?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: { name: string } | string;
  updatedBy?: { name: string } | string;
}

export const getInspections = async (token: string) => {
  const response = await axios.get(`${API_URL}/inspections`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getInspection = async (token: string, id: string) => {
  const response = await axios.get(`${API_URL}/inspections/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createInspection = async (token: string, templateId: string) => {
  const response = await axios.post(
    `${API_URL}/inspections`,
    { templateId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateInspection = async (token: string, id: string, data: Partial<Inspection>) => {
  const response = await axios.patch(
    `${API_URL}/inspections/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
export const startTodayInspection = async (token: string, templateId: string) => {
  const response = await axios.post(
    `${API_URL}/inspections/today`,
    { templateId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getInspectionsByTemplate = async (token: string, templateId: string) => {
  const response = await axios.get(`${API_URL}/inspections/template/${templateId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
export interface Material {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
  createdAt: string;
}

export const getMaterials = async (token: string) => {
  const response = await axios.get(`${API_URL}/materials`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface CreateMaterialPayload {
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
}

export const createMaterial = async (token: string, data: CreateMaterialPayload) => {
  const response = await axios.post(
    `${API_URL}/materials`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateMaterial = async (token: string, id: string, data: Partial<CreateMaterialPayload>) => {
  const response = await axios.patch(
    `${API_URL}/materials/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteMaterial = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/materials/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};