"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { tokenManager } from "@/lib/auth"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
User,
Mail,
Phone,
Hash,
Building,
Fuel,
ArrowLeft,
Save,
CheckCircle,
AlertCircle,
Edit,
Calendar,
Shield,
} from "lucide-react"

// Profile update schema
const profileSchema = z.object({
nom: z.string().min(2, "Last name must be at least 2 characters"),
prénom: z.string().min(2, "First name must be at least 2 characters"),
email: z.string().email("Please enter a valid email address"),
téléphone: z.string().min(10, "Phone number must be at least 10 digits"),
matricule: z.string().min(3, "Employee ID must be at least 3 characters"),
department: z.string().min(2, "Department must be at least 2 characters"),
})

type ProfileData = z.infer<typeof profileSchema>

export default function ProfilePage() {
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [updating, setUpdating] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState<string | null>(null)
const [isEditing, setIsEditing] = useState(false)
const router = useRouter()

const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
} = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
})

const watchedFields = watch()

useEffect(() => {
    const fetchUserProfile = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        // Get current user data first to get the ID
        const currentUserRes = await api.get("/auth/me")
        const userId = currentUserRes.data.id

        // Fetch detailed profile from employees endpoint
        const profileRes = await api.get(`/api/employees/${userId}`)
        const userData = profileRes.data

        setUser(userData)

        // Pre-fill the form with current values
        reset({
        nom: userData.nom || userData.lastName || "",
        prénom: userData.prénom || userData.firstName || "",
        email: userData.email || "",
        téléphone: userData.téléphone || userData.phone || "",
        matricule: userData.matricule || userData.employeeId || "",
        department: userData.department || "",
        })
    } catch (err: any) {
        console.error("Failed to fetch user profile:", err)

        // If unauthorized, clear token and redirect
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load profile data. Please try refreshing the page.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchUserProfile()
}, [router, reset])

const onSubmit = async (data: ProfileData) => {
    setUpdating(true)
    setError(null)
    setSuccess(null)

    try {
    const userId = user.id
    const response = await api.put(`/api/employees/${userId}`, data)

    // Update local user state with new data
    setUser({ ...user, ...response.data })
    setSuccess("Profile updated successfully!")
    setIsEditing(false)

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again."
    setError(errorMessage)
    } finally {
    setUpdating(false)
    }
}

const isFieldValid = (fieldName: string) => {
    return watchedFields[fieldName as keyof ProfileData] && !errors[fieldName as keyof typeof errors]
}

const getInitials = () => {
    if (!user) return "U"
    const firstName = user.prénom || user.firstName || ""
    const lastName = user.nom || user.lastName || ""
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
}

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Fuel className="h-8 w-8 text-slate-900" />
            </div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-yellow-500 mx-auto"></div>
        <div className="space-y-2">
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading your profile...</p>
            <p className="text-slate-500 text-xs sm:text-sm">Please wait a moment</p>
        </div>
        </div>
    </div>
    )
}

if (error && !user) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-slate-600">{error}</p>
        <div className="space-x-4">
            <Button onClick={() => window.location.reload()} className="bg-yellow-500 hover:bg-yellow-600">
            Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
            </Button>
        </div>
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
            onClick={() => router.push("/dashboard")}
            className="text-white hover:bg-white/10 p-2"
            >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Employee Profile
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">Manage your personal information</p>
            </div>
            </div>

            <div className="ml-auto">
            <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white border-0 px-3 py-1">
                Naftal Employee
            </Badge>
            </div>
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8">
        {/* Success/Error Messages */}
        {success && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 font-medium">{success}</p>
        </div>
        )}

        {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
        </div>
        )}

        {/* Profile Overview Card */}
        <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-yellow-400/30 shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 text-xl sm:text-2xl font-bold">
                    {getInitials()}
                </AvatarFallback>
                </Avatar>
                <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {user?.prénom || user?.firstName} {user?.nom || user?.lastName}
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 w-fit">
                    ID: {user?.matricule || user?.employeeId || "Not assigned"}
                    </Badge>
                    <Badge className="bg-sky-500/20 text-sky-300 border border-sky-400/30 w-fit">
                    {user?.department || "Department not specified"}
                    </Badge>
                </div>
                </div>
            </div>

            <Button
                onClick={() => setIsEditing(!isEditing)}
                className={`${
                isEditing
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300"
                } text-slate-900 font-semibold`}
            >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
            </div>
        </CardHeader>
        </Card>

        {/* Profile Form */}
        <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <Fuel className="h-6 w-6" />
            Personal Information
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <User className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-slate-900">Personal Details</h3>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Last Name (Nom)
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        {...register("nom")}
                        disabled={!isEditing}
                        className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                            ? "bg-white border-slate-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-slate-900"
                            : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                        placeholder="Enter your last name"
                    />
                    {isFieldValid("nom") && isEditing && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                    </div>
                    {errors.nom && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.nom.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    First Name (Prénom)
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        {...register("prénom")}
                        disabled={!isEditing}
                        className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                            ? "bg-white border-slate-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-slate-900"
                            : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                        placeholder="Enter your first name"
                    />
                    {isFieldValid("prénom") && isEditing && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                    </div>
                    {errors.prénom && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.prénom.message}
                    </p>
                    )}
                </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("email")}
                    type="email"
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                        ? "bg-white border-slate-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-slate-900"
                        : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                    }`}
                    placeholder="Enter your email address"
                    />
                    {isFieldValid("email") && isEditing && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    )}
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                    </p>
                )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Phone Number (Téléphone)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("téléphone")}
                    type="tel"
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                        ? "bg-white border-slate-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900"
                        : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                    }`}
                    placeholder="Enter your phone number"
                    />
                    {isFieldValid("téléphone") && isEditing && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    )}
                </div>
                {errors.téléphone && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.téléphone.message}
                    </p>
                )}
                </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                <Building className="h-5 w-5 text-sky-500" />
                <h3 className="text-lg font-semibold text-slate-900">Professional Information</h3>
                </div>

                {/* Employee ID and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Employee ID (Matricule)
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        {...register("matricule")}
                        disabled={!isEditing}
                        className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                            ? "bg-white border-slate-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900"
                            : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                        placeholder="Enter your employee ID"
                    />
                    {isFieldValid("matricule") && isEditing && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                    </div>
                    {errors.matricule && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.matricule.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Department
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        {...register("department")}
                        disabled={!isEditing}
                        className={`w-full pl-12 pr-10 py-4 border rounded-xl transition-all duration-300 outline-none ${
                        isEditing
                            ? "bg-white border-slate-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900"
                            : "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
                        }`}
                        placeholder="Enter your department"
                    />
                    {isFieldValid("department") && isEditing && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    )}
                    </div>
                    {errors.department && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.department.message}
                    </p>
                    )}
                </div>
                </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-300 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group"
                >
                    {updating ? (
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                        Updating Profile...
                    </div>
                    ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Save Changes
                    </div>
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                    setIsEditing(false)
                    setError(null)
                    // Reset form to original values
                    reset({
                        nom: user?.nom || user?.lastName || "",
                        prénom: user?.prénom || user?.firstName || "",
                        email: user?.email || "",
                        téléphone: user?.téléphone || user?.phone || "",
                        matricule: user?.matricule || user?.employeeId || "",
                        department: user?.department || "",
                    })
                    }}
                    className="px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-semibold text-lg rounded-xl"
                >
                    Cancel
                </Button>
                </div>
            )}
            </form>
        </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <Shield className="h-6 w-6" />
            Account Information
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Account Status</label>
                <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-green-700">Active</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Member Since</label>
                <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-500" />
                {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : "Not available"}
                </p>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Account Type</label>
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 px-4 py-2 text-sm font-semibold">
                Naftal Employee
                </Badge>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Rewards Program</label>
                <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white px-4 py-2 text-sm font-semibold">
                Active Member
                </Badge>
            </div>
            </div>
        </CardContent>
        </Card>
    </main>
    </div>
)
}
