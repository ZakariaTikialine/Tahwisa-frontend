"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validation"
import type { z } from "zod"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  User,
  Mail,
  Lock,
  Phone,
  Hash,
  Building,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  Fuel,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// infer the type from zod schema
type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const password = watch("password")
  const [passwordFocus, setPasswordFocus] = useState(false)

  const passwordRequirements = [
    { id: 1, text: "8+ characters", valid: password?.length >= 8 },
    { id: 2, text: "1 uppercase letter", valid: /[A-Z]/.test(password) },
    { id: 3, text: "1 lowercase letter", valid: /[a-z]/.test(password) },
    { id: 4, text: "1 number", valid: /[0-9]/.test(password) }
  ]

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post("/auth/register", data)
      if (response.data.error) throw new Error(response.data.error)
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-xl mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
          <p className="text-slate-400 text-lg">Redirecting to login page...</p>
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl mb-4">
            <Fuel className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            Join Naftal Rewards
          </h1>
          <p className="text-slate-400 text-sm">Register to participate in amazing trip opportunities</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Last Name</Label>
              <Input className="bg-white/10 text-white border-white/20" {...register("nom")} placeholder="e.g. Doe" />
              {errors.nom && <p className="text-sm text-red-400">{errors.nom.message}</p>}
            </div>
            <div>
              <Label className="text-white">First Name</Label>
              <Input className="bg-white/10 text-white border-white/20" {...register("prénom")} placeholder="e.g. John" />
              {errors.prénom && <p className="text-sm text-red-400">{errors.prénom.message}</p>}
            </div>
          </div>

          <div>
            <Label className="text-white">Email</Label>
            <Input type="email" className="bg-white/10 text-white border-white/20" {...register("email")} placeholder="email@naftal.dz" />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <Label className="text-white">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="bg-white/10 text-white border-white/20 pr-10"
                {...register("password")}
                placeholder="••••••••"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <button
                type="button"
                className="cursor-pointer absolute right-2 top-2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordFocus && (
              <ul className="text-sm text-slate-400 mt-2 space-y-1">
                {passwordRequirements.map((r) => (
                  <li key={r.id} className="flex items-center gap-2">
                    {r.valid ? <Check className="text-green-400 w-4 h-4" /> : <X className="text-red-400 w-4 h-4" />}
                    {r.text}
                  </li>
                ))}
              </ul>
            )}
            {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Phone</Label>
              <Input className="bg-white/10 text-white border-white/20" {...register("téléphone")} placeholder="e.g. 0551 23 45 67" />
              {errors.téléphone && <p className="text-sm text-red-400">{errors.téléphone.message}</p>}
            </div>
            <div>
              <Label className="text-white">Employee ID</Label>
              <Input className="bg-white/10 text-white border-white/20" {...register("matricule")} placeholder="e.g. 123456" />
              {errors.matricule && <p className="text-sm text-red-400">{errors.matricule.message}</p>}
            </div>
          </div>

          <div>
            <Label className="text-white">Structure</Label>
            <Input className="bg-white/10 text-white border-white/20" {...register("structure")} placeholder="e.g. HR" />
            {errors.structure && <p className="text-sm text-red-400">{errors.structure.message}</p>}
          </div>

          <Button disabled={isLoading} type="submit" className="cursor-pointer w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-sky-400 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
            <Fuel className="h-4 w-4" /> Naftal Employee Registration - Secure & Confidential
          </p>
        </form>
      </div>
    </div>
  )
}