import axios from 'axios'

const api = axios.create({
    baseURL: 'https://tahwisa-backend-production.up.railway.app/api',
})

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
