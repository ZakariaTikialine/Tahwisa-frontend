"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validation"
import type { z } from "zod"
import api from "@/lib/api"
import { tokenManager } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { User, Mail, Lock, Phone, Hash, Building, Eye, EyeOff, Fuel, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
const router = useRouter()
const [isLoading, setIsLoading] = useState(false)
const [showPassword, setShowPassword] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState(false)

// Check if user is already logged in
useEffect(() => {
    if (tokenManager.hasToken()) {
    router.push("/dashboard")
    }
}, [router])

const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
} = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
})

const watchedFields = watch()

const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
    await api.post("/auth/register", data)
    setSuccess(true)

    // Redirect to login after a short delay
    setTimeout(() => {
        router.push("/login")
    }, 2000)
    } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
    setError(errorMessage)
    } finally {
    setIsLoading(false)
    }
}

const isFieldValid = (fieldName: string) => {
    return watchedFields[fieldName as keyof RegisterData] && !errors[fieldName as keyof typeof errors]
}

if (success) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-xl mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
        <p className="text-slate-400 text-lg">Welcome to Naftal Employee Rewards. Redirecting to login...</p>
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl"></div>
    </div>

    <div className="w-full max-w-2xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl mb-6">
            <Fuel className="h-8 w-8 text-slate-900" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-2">
            Join Naftal Rewards
        </h1>
        <p className="text-slate-400 text-lg">Register to participate in amazing trip opportunities</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Error Message */}
        {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-white/20">
                <User className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    Last Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("nom")}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your last name"
                    />
                    {isFieldValid("nom") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    )}
                </div>
                {errors.nom && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.nom.message}
                    </p>
                )}
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    First Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("prénom")}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your first name"
                    />
                    {isFieldValid("prénom") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    )}
                </div>
                {errors.prénom && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.prénom.message}
                    </p>
                )}
                </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Email Address
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your email address"
                />
                {isFieldValid("email") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                )}
                </div>
                {errors.email && (
                <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.email.message}
                </p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">Password</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Create a secure password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                </div>
                {errors.password && (
                <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.password.message}
                </p>
                )}
            </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-white/20">
                <Building className="h-5 w-5 text-sky-400" />
                <h3 className="text-lg font-semibold text-white">Professional Information</h3>
            </div>

            {/* Phone and Employee ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    Phone Number
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("téléphone")}
                    type="tel"
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your phone number"
                    />
                    {isFieldValid("téléphone") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    )}
                </div>
                {errors.téléphone && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.téléphone.message}
                    </p>
                )}
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                    Employee ID
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    {...register("matricule")}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your employee ID"
                    />
                    {isFieldValid("matricule") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    )}
                </div>
                {errors.matricule && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.matricule.message}
                    </p>
                )}
                </div>
            </div>

            {/* Department Field */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">Department</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    {...register("department")}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                    placeholder="Enter your department"
                />
                {isFieldValid("department") && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                )}
                </div>
                {errors.department && (
                <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.department.message}
                </p>
                )}
            </div>
            </div>

            {/* Submit Button */}
            <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-300 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group"
            >
            {isLoading ? (
                <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                Creating your account...
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
            )}
            </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-slate-400">Already have an account?</span>
            </div>
            </div>
            <div className="mt-4">
            <a
                href="/login"
                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
                Sign in instead
                <ArrowRight className="h-4 w-4" />
            </a>
            </div>
        </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
            <Fuel className="h-4 w-4" />
            Naftal Employee Registration - Secure & Confidential
        </p>
        </div>
    </div>
    </div>
)
}
