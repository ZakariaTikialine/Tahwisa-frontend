"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, ArrowLeft, Plane, AlertCircle, CheckCircle, Send, Shield, Calendar, Clock } from 'lucide-react'
import type { Session, Periode, Inscription, Employee } from "@/lib/types"

export default function RegistrationPage() {
const [sessions, setSessions] = useState<Session[]>([])
const [periodes, setPeriodes] = useState<Periode[]>([])
const [userInscriptions, setUserInscriptions] = useState<Inscription[]>([])
const [user, setUser] = useState<Employee | null>(null)
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)
const [success, setSuccess] = useState<string | null>(null)
const router = useRouter()

useEffect(() => {
    const fetchData = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        // Fetch user info, sessions, periods, and user's inscriptions
        const [userResponse, sessionsResponse, periodesResponse] = await Promise.all([
        api.get("/auth/me"),
        api.get("/sessions"),
        api.get("/periodes"),
        ])

        const userData = userResponse.data
        setUser(userData)
        setSessions(sessionsResponse.data)
        setPeriodes(periodesResponse.data)

        // Fetch user's inscriptions
        try {
        const inscriptionsResponse = await api.get(`/api/inscriptions/employee/${userData.id}`)
        setUserInscriptions(inscriptionsResponse.data)
        } catch (inscErr: any) {
        if (inscErr.response?.status !== 404) {
            console.error("Failed to fetch inscriptions:", inscErr)
        }
        setUserInscriptions([])
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
}, [router])

const handleRegister = async (sessionId: number) => {
    if (!user) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
    await api.post("/inscriptions", {
        employee_id: user.id,
        session_id: sessionId,
        statut: "active",
    })

    // Refresh user's inscriptions
    const inscriptionsResponse = await api.get(`/inscriptions/employee/${user.id}`)
    setUserInscriptions(inscriptionsResponse.data)

    setSuccess("Registration submitted successfully! You are now registered for this session.")

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
    let errorMessage = "Registration failed. Please try again."

    if (err.response?.data?.message) {
        errorMessage = err.response.data.message
    } else if (err.response?.status === 409) {
        errorMessage = "You are already registered for this session."
    } else if (err.response?.status === 400) {
        errorMessage = "Registration deadline has passed for this session."
    }

    setError(errorMessage)
    } finally {
    setSubmitting(false)
    }
}

const handleCancelRegistration = async (inscriptionId: number) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return

    try {
    await api.delete(`/inscriptions/${inscriptionId}`)

    // Refresh user's inscriptions
    const inscriptionsResponse = await api.get(`/inscriptions/employee/${user!.id}`)
    setUserInscriptions(inscriptionsResponse.data)

    setSuccess("Registration cancelled successfully.")
    setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
    let errorMessage = "Failed to cancel registration."

    if (err.response?.data?.message) {
        errorMessage = err.response.data.message
    }

    setError(errorMessage)
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

const isRegistrationOpen = (periode: Periode) => {
    const today = new Date()
    const deadline = new Date(periode.date_limite_inscription)
    return periode.statut === "open" && today <= deadline
}

const isUserRegistered = (sessionId: number) => {
    return userInscriptions.some((inscription) => inscription.session_id === sessionId)
}

const getUserInscription = (sessionId: number) => {
    return userInscriptions.find((inscription) => inscription.session_id === sessionId)
}

const getSessionPeriode = (sessionId: number) => {
    const session = sessions.find((s) => s.id === sessionId)
    if (!session) return null
    return periodes.find((p) => p.id === session.periode_id)
}

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

if (error && sessions.length === 0) {
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
                <p className="text-slate-400 text-sm sm:text-base">Register for available travel sessions</p>
            </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white border-0 px-3 py-1">
                {userInscriptions.length} Active Registrations
            </Badge>
            </div>
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8">
        {/* Success/Error Messages */}
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

        {/* My Registrations */}
        {userInscriptions.length > 0 && (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            My Registrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userInscriptions.map((inscription) => {
                const session = sessions.find((s) => s.id === inscription.session_id)
                const periode = session ? getSessionPeriode(session.id) : null

                return (
                <Card key={inscription.id} className="border-0 shadow-xl overflow-hidden bg-green-50">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-400 text-white p-4">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold">
                        {session?.nom || inscription.session_name || "Session"}
                        </CardTitle>
                        <Badge className="bg-white/20 text-white">Registered</Badge>
                    </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                        <span className="text-slate-600">Registration Date:</span>
                        <span className="font-medium">{formatDate(inscription.date_inscription)}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge
                            className={`text-xs ${
                            inscription.statut === "active"
                                ? "bg-green-100 text-green-800"
                                : inscription.statut === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                            {inscription.statut}
                        </Badge>
                        </div>
                        {session && (
                        <>
                            <div className="flex justify-between">
                            <span className="text-slate-600">Destination:</span>
                            <span className="font-medium">{session.destination_nom || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                            <span className="text-slate-600">Start Date:</span>
                            <span className="font-medium">{formatDate(session.date_debut)}</span>
                            </div>
                        </>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRegistration(inscription.id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        Cancel Registration
                    </Button>
                    </CardContent>
                </Card>
                )
            })}
            </div>
        </section>
        )}

        {/* Available Sessions */}
        <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-yellow-500" />
            Available Sessions
        </h2>

        {sessions.length === 0 ? (
            <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
                <Plane className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No sessions available</h3>
                <p className="text-slate-600">Please check back later for new travel opportunities.</p>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
                const periode = getSessionPeriode(session.id)
                const isRegistered = isUserRegistered(session.id)
                const canRegister = periode ? isRegistrationOpen(periode) : false
                const inscription = getUserInscription(session.id)

                return (
                <Card
                    key={session.id}
                    className={`border-0 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isRegistered ? "bg-green-50 border-green-200" : "bg-white"
                    }`}
                >
                    {/* Session Header */}
                    <div className="h-32 bg-gradient-to-br from-sky-400 to-sky-500 relative">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        {isRegistered ? (
                        <Badge className="bg-green-500 text-white font-semibold">Registered</Badge>
                        ) : canRegister ? (
                        <Badge className="bg-yellow-500 text-slate-900 font-semibold">Open</Badge>
                        ) : (
                        <Badge className="bg-red-500 text-white font-semibold">Closed</Badge>
                        )}
                    </div>

                    {/* Session Name */}
                    <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {session.nom}
                        </h3>
                        {session.destination_nom && (
                        <p className="text-sky-100 text-sm">{session.destination_nom}</p>
                        )}
                    </div>
                    </div>

                    {/* Session Content */}
                    <CardContent className="p-4 space-y-4">
                    {/* Period Information */}
                    {periode && (
                        <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Period:</span>
                            <span className="font-semibold text-slate-900">{periode.nom}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Start:</span>
                            <span className="font-semibold text-slate-900">{formatDate(session.date_debut)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">End:</span>
                            <span className="font-semibold text-slate-900">{formatDate(session.date_fin)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Registration Deadline:</span>
                            <span className="font-semibold text-red-600">
                            {formatDate(periode.date_limite_inscription)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Duration:</span>
                            <span className="font-semibold text-sky-600">
                            {calculateDuration(session.date_debut, session.date_fin)} days
                            </span>
                        </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                        {isRegistered ? (
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">You are registered</span>
                            </div>
                            {inscription && (
                            <p className="text-xs text-slate-500">
                                Registered on {formatDate(inscription.date_inscription)}
                            </p>
                            )}
                        </div>
                        ) : canRegister ? (
                        <Button
                            onClick={() => handleRegister(session.id)}
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-semibold"
                        >
                            {submitting ? (
                            <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Registering...
                            </div>
                            ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Send className="h-4 w-4" />
                                Register Now
                            </div>
                            )}
                        </Button>
                        ) : (
                        <Button disabled className="w-full bg-slate-300 text-slate-500 cursor-not-allowed">
                            <Shield className="h-4 w-4 mr-2" />
                            Registration Closed
                        </Button>
                        )}
                    </div>
                    </CardContent>
                </Card>
                )
            })}
            </div>
        )}
        </section>
    </main>
    </div>
)
}
