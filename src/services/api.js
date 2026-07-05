import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
}

export const productsApi = {
  getAll: () => api.get('/products'),
  create: (payload) => api.post('/products', payload),
}

export const usersApi = {
  getAll: () => api.get('/users'),
  create: (payload) => api.post('/users', payload),
  update: (id, payload) => api.patch(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`),
  heartbeat: (id) => api.post(`/users/${id}/heartbeat`),
}

export const messagesApi = {
  getAll: (userId) => api.get('/messages', { params: { userId } }),
  send: (payload) => api.post('/messages', payload),
  markRead: (id) => api.patch(`/messages/${id}/read`),
  remove: (id) => api.delete(`/messages/${id}`),
}

export default api
