"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
Calendar,
MapPin,
ArrowLeft,
Plane,
AlertCircle,
CheckCircle,
Building,
Send,
Shield,
Award,
Globe,
} from "lucide-react"

// Registration form schema
const registrationSchema = z.object({
periodId: z.string().min(1, "Please select a travel period"),
center: z.string().min(1, "Please select a center"),
})

type RegistrationData = z.infer<typeof registrationSchema>

interface TravelPeriod {
id: string
destination: string
startDate: string
endDate: string
maxParticipants: number
registeredCount: number
status: "open" | "closed" | "full" | "upcoming"
description?: string
type?: string
}

interface UserRegistration {
id: string
periodId: string
center: string
status: string
createdAt: string
}

const PREDEFINED_CENTERS = [
{
    id: "algiers",
    name: "Algiers",
    description: "Capital city center - Main headquarters",
    icon: "🏛️",
},
{
    id: "oran",
    name: "Oran",
    description: "Western region center - Port operations",
    icon: "🌊",
},
{
    id: "hassi-messaoud",
    name: "Hassi Messaoud",
    description: "Southern region center - Oil operations",
    icon: "🛢️",
},
]

export default function RegistrationPage() {
const [periods, setPeriods] = useState<TravelPeriod[]>([])
const [userRegistration, setUserRegistration] = useState<UserRegistration | null>(null)
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState<string | null>(null)
const router = useRouter()

const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
} = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
})

const selectedPeriodId = watch("periodId")
const selectedCenter = watch("center")

useEffect(() => {
    const fetchData = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        // Fetch travel periods and user registration status
        const [periodsResponse, registrationResponse] = await Promise.all([
        api.get("/api/periodes"),
        api
            .get("/api/inscriptions/me")
            .catch(() => ({ data: null })), // Don't fail if no registration exists
        ])

        setPeriods(periodsResponse.data)
        setUserRegistration(registrationResponse.data)

        // If user already registered, pre-fill the form
        if (registrationResponse.data) {
        setValue("periodId", registrationResponse.data.periodId)
        setValue("center", registrationResponse.data.center)
        }
    } catch (err: any) {
        console.error("Failed to fetch data:", err)

        // If unauthorized, clear token and redirect
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load registration data. Please try refreshing the page.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchData()
}, [router, setValue])

const onSubmit = async (data: RegistrationData) => {
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
    const response = await api.post("/api/inscriptions", {
        periodId: data.periodId,
        center: data.center,
    })

    setUserRegistration(response.data)
    setSuccess("Registration submitted successfully! You will be notified about the selection results.")

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
    setError(errorMessage)
    } finally {
    setSubmitting(false)
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    })
}

const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

const getRegistrationPercentage = (registered: number, max: number) => {
    return max > 0 ? Math.round((registered / max) * 100) : 0
}

const getStatusColor = (status: string) => {
    switch (status) {
    case "open":
        return "bg-green-500"
    case "closed":
        return "bg-red-500"
    case "full":
        return "bg-yellow-500"
    case "upcoming":
        return "bg-blue-500"
    default:
        return "bg-gray-500"
    }
}

const selectedPeriod = periods.find((p) => p.id === selectedPeriodId)
const isAlreadyRegistered = !!userRegistration
const canRegister = !isAlreadyRegistered && periods.some((p) => p.status === "open")

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Plane className="h-8 w-8 text-slate-900" />
            </div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-yellow-500 mx-auto"></div>
        <div className="space-y-2">
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading registration form...</p>
            <p className="text-slate-500 text-xs sm:text-sm">Please wait a moment</p>
        </div>
        </div>
    </div>
    )
}

if (error && periods.length === 0) {
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
                <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Trip Registration
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                {isAlreadyRegistered ? "View your registration" : "Register for your dream destination"}
                </p>
            </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
            <Badge
                className={`${
                isAlreadyRegistered
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-sky-500 to-sky-400"
                } text-white border-0 px-3 py-1`}
            >
                {isAlreadyRegistered ? "Already Registered" : "Registration Open"}
            </Badge>
            <Button
                variant="outline"
                onClick={() => router.push("/travel-periods")}
                className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 px-4 py-2"
            >
                <Calendar className="h-4 w-4 mr-2" />
                View All Periods
            </Button>
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

        {/* Registration Status Card */}
        {isAlreadyRegistered && (
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <CheckCircle className="h-6 w-6" />
                Registration Confirmed
            </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Registered Period
                    </label>
                    <p className="text-lg font-bold text-slate-900">
                    {periods.find((p) => p.id === userRegistration.periodId)?.destination || "Unknown"}
                    </p>
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Selected Center
                    </label>
                    <p className="text-lg font-bold text-slate-900">{userRegistration.center}</p>
                </div>
                </div>
                <div className="pt-4 border-t border-green-200">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Registered on: {formatDate(userRegistration.createdAt)}
                </p>
                </div>
            </div>
            </CardContent>
        </Card>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Travel Periods Selection */}
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <Globe className="h-6 w-6" />
                Select Travel Period
                <span className="text-sm font-normal bg-slate-900/20 px-2 py-1 rounded-lg">Step 1 of 2</span>
            </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-yellow-50">
            <div className="space-y-4">
                {periods.length === 0 ? (
                <div className="text-center py-8">
                    <Plane className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No travel periods available</h3>
                    <p className="text-slate-600">Please check back later for new travel opportunities.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {periods.map((period) => {
                    const registrationPercentage = getRegistrationPercentage(
                        period.registeredCount,
                        period.maxParticipants,
                    )
                    const duration = calculateDuration(period.startDate, period.endDate)
                    const isSelected = selectedPeriodId === period.id
                    const isDisabled = isAlreadyRegistered || period.status !== "open"

                    return (
                        <div key={period.id} className="relative">
                        <input
                            {...register("periodId")}
                            type="radio"
                            value={period.id}
                            id={`period-${period.id}`}
                            disabled={isDisabled}
                            className="sr-only peer"
                        />
                        <label
                            htmlFor={`period-${period.id}`}
                            className={`block cursor-pointer transition-all duration-300 ${
                            isDisabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-1"
                            }`}
                        >
                            <Card
                            className={`border-2 transition-all duration-300 ${
                                isSelected
                                ? "border-yellow-400 shadow-xl ring-2 ring-yellow-400/20"
                                : isDisabled
                                    ? "border-slate-200"
                                    : "border-slate-200 hover:border-yellow-300 hover:shadow-lg"
                            }`}
                            >
                            {/* Period Header */}
                            <div className="h-32 bg-gradient-to-br from-sky-400 to-sky-500 relative">
                                <div className="absolute inset-0 bg-black/20"></div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                <Badge
                                    className={`${getStatusColor(period.status)} text-white font-semibold px-2 py-1 text-xs`}
                                >
                                    {period.status.toUpperCase()}
                                </Badge>
                                </div>

                                {/* Type Badge */}
                                {period.type && (
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-yellow-500 text-slate-900 font-semibold px-2 py-1 text-xs">
                                    {period.type}
                                    </Badge>
                                </div>
                                )}

                                {/* Selection Indicator */}
                                {isSelected && (
                                <div className="absolute bottom-3 right-3">
                                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-slate-900" />
                                    </div>
                                </div>
                                )}

                                {/* Destination */}
                                <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {period.destination}
                                </h3>
                                </div>
                            </div>

                            {/* Period Content */}
                            <CardContent className="p-4 space-y-3">
                                {/* Description */}
                                {period.description && (
                                <p className="text-sm text-slate-600 leading-relaxed">{period.description}</p>
                                )}

                                {/* Dates */}
                                <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Start:</span>
                                    <span className="font-semibold text-slate-900">{formatDate(period.startDate)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">End:</span>
                                    <span className="font-semibold text-slate-900">{formatDate(period.endDate)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Duration:</span>
                                    <span className="font-semibold text-sky-600">
                                    {duration} {duration === 1 ? "day" : "days"}
                                    </span>
                                </div>
                                </div>

                                {/* Registration Stats */}
                                <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Registered:</span>
                                    <span className="font-semibold text-slate-900">
                                    {period.registeredCount} / {period.maxParticipants}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                        registrationPercentage >= 100
                                        ? "bg-gradient-to-r from-red-500 to-red-600"
                                        : registrationPercentage >= 80
                                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                            : "bg-gradient-to-r from-green-500 to-green-600"
                                    }`}
                                    style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-slate-500 text-center">
                                    {registrationPercentage}% filled
                                </div>
                                </div>
                            </CardContent>
                            </Card>
                        </label>
                        </div>
                    )
                    })}
                </div>
                )}

                {errors.periodId && (
                <p className="text-sm text-red-500 mt-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.periodId.message}
                </p>
                )}
            </div>
            </CardContent>
        </Card>

        {/* Centers Selection */}
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <Building className="h-6 w-6" />
                Select Your Center
                <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-lg">Step 2 of 2</span>
            </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-sky-50">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PREDEFINED_CENTERS.map((center) => {
                    const isSelected = selectedCenter === center.name
                    const isDisabled = isAlreadyRegistered

                    return (
                    <div key={center.id} className="relative">
                        <input
                        {...register("center")}
                        type="radio"
                        value={center.name}
                        id={`center-${center.id}`}
                        disabled={isDisabled}
                        className="sr-only peer"
                        />
                        <label
                        htmlFor={`center-${center.id}`}
                        className={`block cursor-pointer transition-all duration-300 ${
                            isDisabled ? "cursor-not-allowed opacity-60" : "hover:-translate-y-1"
                        }`}
                        >
                        <Card
                            className={`border-2 transition-all duration-300 ${
                            isSelected
                                ? "border-sky-400 shadow-xl ring-2 ring-sky-400/20"
                                : isDisabled
                                ? "border-slate-200"
                                : "border-slate-200 hover:border-sky-300 hover:shadow-lg"
                            }`}
                        >
                            <CardContent className="p-6 text-center space-y-4">
                            {/* Center Icon */}
                            <div className="text-4xl mb-3">{center.icon}</div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                                </div>
                            )}

                            {/* Center Info */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{center.name}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{center.description}</p>
                            </div>

                            {/* Center Badge */}
                            <Badge
                                className={`${
                                isSelected ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-700"
                                } transition-colors duration-300`}
                            >
                                Naftal Center
                            </Badge>
                            </CardContent>
                        </Card>
                        </label>
                    </div>
                    )
                })}
                </div>

                {errors.center && (
                <p className="text-sm text-red-500 mt-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.center.message}
                </p>
                )}
            </div>
            </CardContent>
        </Card>

        {/* Registration Summary */}
        {selectedPeriod && selectedCenter && (
            <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <Award className="h-6 w-6 text-yellow-400" />
                Registration Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Selected Destination
                    </label>
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-yellow-600" />
                        {selectedPeriod.destination}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                        {formatDate(selectedPeriod.startDate)} - {formatDate(selectedPeriod.endDate)}
                    </p>
                    <p className="text-sm text-slate-600">
                        Duration: {calculateDuration(selectedPeriod.startDate, selectedPeriod.endDate)} days
                    </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Selected Center
                    </label>
                    <div className="p-4 bg-sky-50 rounded-lg border-l-4 border-sky-400">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Building className="h-5 w-5 text-sky-600" />
                        {selectedCenter}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                        {PREDEFINED_CENTERS.find((c) => c.name === selectedCenter)?.description}
                    </p>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        )}

        {/* Submit Button */}
        {!isAlreadyRegistered && canRegister && (
            <div className="flex justify-center">
            <Button
                type="submit"
                disabled={submitting || !selectedPeriodId || !selectedCenter}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 py-4 px-8 rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-yellow-300 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 group min-w-[200px]"
            >
                {submitting ? (
                <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Submitting...
                </div>
                ) : (
                <div className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Submit Registration
                </div>
                )}
            </Button>
            </div>
        )}

        {/* No Registration Available Message */}
        {!canRegister && !isAlreadyRegistered && (
            <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Registration Currently Unavailable</h3>
                <p className="text-slate-600">
                There are no open travel periods available for registration at this time. Please check back later.
                </p>
            </CardContent>
            </Card>
        )}
        </form>
    </main>
    </div>
)
}
