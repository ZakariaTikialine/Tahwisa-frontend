"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validation"
import type { z } from "zod"
import api from "@/lib/api"
import { tokenManager } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fuel, AlertCircle, RefreshCw } from 'lucide-react'
import Link from "next/link"

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    // Debug logging
    const logDebug = (context: string, data: any) => {
        const debugData = {
            context,
            data,
            timestamp: new Date().toISOString()
        }
        console.log(`[LOGIN DEBUG] ${context}:`, data)
        setDebugInfo(debugData)
    }

    // Check if user is already logged in
    useEffect(() => {
        if (tokenManager.hasToken()) {
            router.push("/registration")
        }
    }, [router])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true)
        setError(null)
        setUnverifiedEmail(null)
        logDebug("Form Submission Started", data)

        try {
            // Basic validation
            if (!data.email || !data.password) {
                throw new Error("Email and password are required")
            }

            logDebug("Making API Request", {
                endpoint: "/auth/login",
                payload: { email: data.email, password: "***" } // Don't log actual password
            })

            const response = await api.post("/auth/login", data)
            logDebug("API Response", response.data)

            if (!response.data) {
                throw new Error("No response data from server")
            }

            if (response.data.token) {
                tokenManager.setToken({
                    token: response.data.token,
                    employee: response.data.employee
                })
                logDebug("Login Success", {
                    user: response.data.employee.email,
                    token: response.data.token.slice(0, 10) + "..."
                })
                router.push("/registration")
            } else {
                throw new Error("No token received from server")
            }
        } catch (err: any) {
            let errorMessage = "Login failed. Please try again."
            
            if (err.response) {
                // Handle API errors
                if (err.response.data?.code === 'EMAIL_NOT_VERIFIED') {
                    setUnverifiedEmail(data.email)
                    errorMessage = "Please verify your email before logging in."
                } else {
                    errorMessage = err.response.data?.message || 
                                err.response.statusText || 
                                `Server error (${err.response.status})`
                }
                logDebug("API Error", err.response)
            } else if (err.message) {
                // Handle client errors
                errorMessage = err.message
                logDebug("Client Error", err)
            }

            setError(errorMessage)
            logDebug("Error State Updated", { error: errorMessage })
        } finally {
            setIsLoading(false)
            logDebug("Loading State Updated", { isLoading: false })
        }
    }

    const handleResendVerification = async () => {
        if (!unverifiedEmail) return

        try {
            logDebug("Resending Verification Email", { email: unverifiedEmail })
            await api.post("/auth/resend-verification", { email: unverifiedEmail })
            setError("Verification email resent. Please check your inbox.")
            setUnverifiedEmail(null)
            logDebug("Verification Email Resent", { email: unverifiedEmail })
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to resend verification email."
            setError(errorMessage)
            logDebug("Resend Error", err.response || err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl mb-6">
                        <Fuel className="h-8 w-8 text-slate-900" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-2">
                        Employee Login
                    </h1>
                    <p className="text-slate-400 text-lg">Access your Naftal rewards account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    {/* Enhanced Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <h4 className="font-medium text-red-300">Login Error</h4>
                            </div>
                            <p className="text-red-300 text-sm">{error}</p>
                            {unverifiedEmail && (
                                <button
                                    onClick={handleResendVerification}
                                    className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Resend verification email
                                </button>
                            )}
                            {process.env.NODE_ENV === 'development' && (
                                <button 
                                    onClick={() => console.log(debugInfo)} 
                                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                                >
                                    Click to view debug details in console
                                </button>
                            )}
                        </div>
                    )}

                    {/* Debug Panel (visible in development) */}
                    {process.env.NODE_ENV === 'development' && debugInfo && (
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-blue-400">Debug Information</span>
                                <button 
                                    onClick={() => setDebugInfo(null)}
                                    className="text-blue-300 hover:text-blue-200 text-xs"
                                >
                                    Hide
                                </button>
                            </div>
                            <pre className="overflow-x-auto text-blue-300">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
                                />
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
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-200 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none backdrop-blur-sm"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-300 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Signing you in...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    Sign In
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Additional Options */}
                    <div className="mt-8 space-y-4">
                        <div className="text-center">
                            <Link href="/forgot-password" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                                Forgot your password?
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-slate-400">Don't have an account?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-medium"
                            >
                                Create an account
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                        <Fuel className="h-4 w-4" />
                        Naftal Employee Rewards - Secure Access
                    </p>
                </div>
            </div>
        </div>
    )
}