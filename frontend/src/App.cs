* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', Arial, sans-serif;
  background: #e8f5e9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

#root {
  width: 100%;
  max-width: 600px;
}

h1 {
  text-align: center;
  color: #2e7d32;
  margin-bottom: 24px;
  font-size: 28px;
}

h2 {
  color: #388e3c;
  margin-bottom: 16px;
  font-size: 20px;
}

div {
  background: #f1f8f2;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.15);
}

div > div {
  box-shadow: none;
  padding: 0;
  background: transparent;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
  padding: 0;
  box-shadow: none;
}

input, select {
  padding: 10px 14px;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  background: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #66bb6a;
}

button {
  padding: 10px 16px;
  background: #66bb6a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background: #4caf50;
}

li button {
  background: #ef5350;
  margin-left: 8px;
}

li button:hover {
  background: #e53935;
}

form + button {
  background: transparent;
  color: #388e3c;
  margin-top: 8px;
}

form + button:hover {
  background: #dcedc8;
}

ul {
  list-style: none;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  background: #f1f8f2;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

li strong {
  color: #2e7d32;
}

p {
  padding: 10px 14px;
  border-radius: 8px;
  background: #ffebee;
  color: #c62828;
  font-size: 14px;
}

.task-card {
  border-left: 5px solid #bdbdbd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.task-todo {
  border-left-color: #fb8c00;
  background: #fff8e1;
}

.task-in_progress {
  border-left-color: #1e88e5;
  background: #e3f2fd;
}

.task-done {
  border-left-color: #43a047;
  background: #e8f5e9;
}

.task-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.task-icon {
  font-size: 20px;
}

.task-desc {
  color: #666;
  font-size: 13px;
  background: transparent;
  padding: 0;
  margin-top: 2px;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-actions select {
  width: auto;
}


