"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, Hash, Building, Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import type { Employee } from "@/lib/types"

type FormField = {
id: keyof Employee
label: string
icon: React.ElementType
type?: string
required?: boolean
placeholder?: string
colSpan?: number
}

export default function ProfilePage() {
const [user, setUser] = useState<Employee | null>(null)
const [formData, setFormData] = useState<Partial<Employee>>({
    nom: "",
    prénom: "",
    email: "",
    téléphone: "",
    matricule: "",
    structure: "",
    password: "",
    role: "employee"
})
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState<string | null>(null)
const router = useRouter()

const personalInfoFields: FormField[] = [
    { id: "nom", label: "Last Name", icon: User, required: true },
    { id: "prénom", label: "First Name", icon: User, required: true },
    { id: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { id: "password", label: "New Password (leave blank to keep current)", icon: Hash, type: "password", placeholder: "Enter new password" }
]

const professionalInfoFields: FormField[] = [
    { id: "téléphone", label: "Phone Number", icon: Phone, type: "tel", required: true },
    { id: "matricule", label: "Employee ID", icon: Hash, required: true },
    { id: "structure", label: "Structure", icon: Building, required: true, colSpan: 2 }
]

useEffect(() => {
    const fetchUserData = async () => {
    try {
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        const response = await api.get("/auth/me")
        const userData = response.data
        setUser(userData)
        setFormData({
        nom: userData.nom || "",
        prénom: userData.prénom || "",
        email: userData.email || "",
        téléphone: userData.téléphone || "",
        matricule: userData.matricule || "",
        structure: userData.structure || "",
        password: "",
        role: userData.role || "employee"
        })
    } catch (err: any) {
        console.error("Failed to fetch user data:", err)
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load profile data.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchUserData()
}, [router])

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
    const updateData = { ...formData }
    if (!updateData.password) {
        delete updateData.password
    }

    await api.put(`/employees/${user.id}`, updateData)
    setSuccess("Profile updated successfully!")
    setFormData(prev => ({ ...prev, password: "" }))
    setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to update profile"
    setError(errorMessage)
    } finally {
    setSaving(false)
    }
}

const handleInputChange = (field: keyof Employee, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
}

const renderFormField = (field: FormField) => {
    const Icon = field.icon
    return (
    <div 
        key={field.id} 
        className={`space-y-2 ${field.colSpan ? `md:col-span-${field.colSpan}` : ''}`}
    >
        <Label htmlFor={field.id} className="text-sm font-semibold text-slate-700">
        {field.label}
        </Label>
        <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
            id={field.id}
            type={field.type || "text"}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="pl-10 bg-white border-slate-300 focus:border-yellow-400 focus:ring-yellow-400"
            required={field.required}
            placeholder={field.placeholder}
        />
        </div>
    </div>
    )
}

const renderSection = (title: string, icon: React.ElementType, fields: FormField[]) => (
    <div className="space-y-6">
    <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        {React.createElement(icon, { className: "h-5 w-5 text-yellow-500" })}
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(renderFormField)}
    </div>
    </div>
)

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mx-auto"></div>
        <p className="text-slate-700 font-medium">Loading profile...</p>
        </div>
    </div>
    )
}

if (!user) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Profile Not Found</h1>
        <p className="text-slate-600">Unable to load your profile information.</p>
        <Button 
            onClick={() => router.push("/registration")} 
            className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white"
        >
            Back to Registration
        </Button>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-sky-50">
    {/* Header */}
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-sky-500/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-4 sm:gap-6">
            <Button
            variant="ghost"
            onClick={() => router.push("/registration")}
            className="cursor-pointer text-white hover:bg-white/10 p-2"
            >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Profile Settings
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">Manage your account information</p>
            </div>
            </div>
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
        {/* Status Alerts */}
        {success && (
            <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
        )}

        {error && (
            <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
        )}

        {/* Profile Form Card */}
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
                <User className="h-6 w-6 text-yellow-400" />
                Employee Information
            </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {renderSection("Personal Information", User, personalInfoFields)}
                {renderSection("Professional Information", Building, professionalInfoFields)}

                <div className="pt-6">
                <Button
                    type="submit"
                    disabled={saving}
                    className="cursor-pointer w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-semibold py-3"
                >
                    {saving ? (
                    <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving Changes...
                    </div>
                    ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                    </div>
                    )}
                </Button>
                </div>
            </form>
            </CardContent>
        </Card>
        </div>
    </main>
    </div>
)
}