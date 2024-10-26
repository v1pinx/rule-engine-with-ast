// client/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API = {
  rules: {
    create: (data) => fetch(`${API_BASE_URL}/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
    evaluate: (ruleId, data) => fetch(`${API_BASE_URL}/rules/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ruleId, data }),
    }),
    getAll: () => fetch(`${API_BASE_URL}/rules`),
  },
};