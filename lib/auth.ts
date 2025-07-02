export const tokenManager = {
setToken: (token: string) => {
    try {
    localStorage.setItem('token', token)
    } catch (error) {
    console.error('Failed to save token to localStorage:', error)
    }
},

getToken: () => {
    try {
    return localStorage.getItem('token')
    } catch (error) {
    console.error('Failed to get token from localStorage:', error)
    return null
    }
},

removeToken: () => {
    try {
    localStorage.removeItem('token')
    } catch (error) {
    console.error('Failed to remove token from localStorage:', error)
    }
},

hasToken: () => {
    return !!tokenManager.getToken()
}
}
