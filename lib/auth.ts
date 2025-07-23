interface TokenData {
token: string
employee: {
    id: number
    nom: string
    prénom: string
    email: string
    password: string
    téléphone: string
    matricule: string
    structure: string
    role: string
}
}

export const tokenManager = {
setToken: (tokenData: TokenData) => {
    try {
    localStorage.setItem("authorization", tokenData.token)
    localStorage.setItem("employee_data", JSON.stringify(tokenData.employee))
    } catch (error) {
    console.error("Failed to save token to localStorage:", error)
    }
},

getToken: () => {
    try {
    return localStorage.getItem("authorization")
    } catch (error) {
    console.error("Failed to get token from localStorage:", error)
    return null
    }
},

removeToken: () => {
    try {
    localStorage.removeItem("authorization")
    localStorage.removeItem("employee_data") 
    } catch (error) {
    console.error("Failed to remove token from localStorage:", error)
    }
},

hasToken: () => {
    return !!tokenManager.getToken()
},

getEmployeeData: (): TokenData["employee"] | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem("employee_data")
    if (!data || data === "undefined") return null
    try {
    return JSON.parse(data)
    } catch (error) {
    console.error("Failed to parse employee data:", error)
    localStorage.removeItem("employee_data")
    return null
    }
}
}
