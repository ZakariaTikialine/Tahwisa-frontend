"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
const router = useRouter()
const [email, setEmail] = useState('')
const [isLoading, setIsLoading] = useState(false)
const [message, setMessage] = useState('')
const [isSuccess, setIsSuccess] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
    await api.post('/auth/request-password-reset', { email })
    setIsSuccess(true)
    setMessage('If an account exists with this email, a password reset link has been sent.')
    } catch (error: any) {
    setMessage(error.response?.data?.message || 'An error occurred')
    } finally {
    setIsLoading(false)
    }
}

return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-slate-600 hover:text-slate-800 mb-6"
        >
        <ArrowLeft className="h-4 w-4" />
        Back
        </button>

        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Forgot Password</h1>
        <p className="text-slate-600 mt-2">
            Enter your email to receive a password reset link
        </p>
        </div>

        {message && (
        <div className={`mb-6 p-4 rounded-lg ${
            isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
            <div className="flex items-center gap-2">
            {isSuccess ? (
                <CheckCircle className="h-5 w-5" />
            ) : (
                <AlertCircle className="h-5 w-5" />
            )}
            <p>{message}</p>
            </div>
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
            />
            </div>
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
            <div className="cursor-pointer flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
            </div>
            ) : (
            'Send Reset Link'
            )}
        </button>
        </form>
    </div>
    </div>
)
}