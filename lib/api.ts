import axios from "axios"
import { tokenManager } from "./auth"

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
(config) => {
    const token = tokenManager.getToken()
    if (token) {
    config.headers.Authorization = `Bearer ${token}`
    }
    return config
},
(error) => {
    return Promise.reject(error)
}
)

// Response interceptor for error handling
api.interceptors.response.use(
(response) => response,
(error) => {
    if (error.response?.status === 401) {
    tokenManager.removeToken()
    window.location.href = "/login"
    }
    return Promise.reject(error)
}
)

export default api
