"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
const router = useRouter()
const searchParams = useSearchParams()
const token = searchParams.get('token')
const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
const [message, setMessage] = useState('')

useEffect(() => {
    if (token) {
    verifyEmail(token)
    } else {
    setStatus('error')
    setMessage('No verification token provided')
    }
}, [token])

const verifyEmail = async (token: string) => {
    try {
    await api.post('/auth/verify-email', { token })
    setStatus('success')
    setMessage('Email verified successfully! You can now log in.')
    setTimeout(() => router.push('/login'), 3000)
    } catch (error: any) {
    setStatus('error')
    setMessage(error.response?.data?.message || 'Email verification failed')
    }
}

return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Email Verification</h1>
        </div>

        <div className={`p-4 rounded-lg ${
        status === 'loading' ? 'bg-blue-50 text-blue-800' :
        status === 'success' ? 'bg-green-50 text-green-800' :
        'bg-red-50 text-red-800'
        }`}>
        <div className="flex items-center gap-3">
            {status === 'loading' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
            ) : status === 'success' ? (
            <CheckCircle className="h-5 w-5" />
            ) : (
            <AlertCircle className="h-5 w-5" />
            )}
            <p>{message}</p>
        </div>
        </div>

        {status === 'error' && (
        <div className="mt-6 text-center">
            <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
            >
            Go to Login
            </button>
        </div>
        )}
    </div>
    </div>
)
}