"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Get token client-side
  useEffect(() => {
    setIsMounted(true)
    const searchParams = new URLSearchParams(window.location.search)
    setToken(searchParams.get('token'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (!token) {
      setMessage('Invalid reset token')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      await api.post('/auth/reset-password', { 
        token, 
        newPassword: password 
      })
      setIsSuccess(true)
      setMessage('Password reset successfully! Redirecting to login...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Password reset failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state until component mounts client-side
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Loading password reset...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-slate-600 mt-2">
            Enter your new password below
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
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}