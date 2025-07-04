"use client"

import { tokenManager } from "@/lib/auth"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Bell, Calendar, Clock, Fuel, Plane, Trophy, Gift, MapPin, AlertCircle, Star, Award } from 'lucide-react'
import { Navigation } from "@/components/navigation"
import type { Employee, Inscription, Session } from "@/lib/types"

export default function DashboardPage() {
const [user, setUser] = useState<Employee | null>(null)
const [userInscriptions, setUserInscriptions] = useState<Inscription[]>([])
const [sessions, setSessions] = useState<Session[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const router = useRouter()

useEffect(() => {
    const fetchData = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        // Fetch user info
        const userResponse = await api.get("/auth/me")
        const userData = userResponse.data
        setUser(userData)

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

        // Fetch all sessions
        try {
        const sessionsResponse = await api.get("/api/sessions")
        setSessions(sessionsResponse.data)
        } catch (sessErr: any) {
        console.error("Failed to fetch sessions:", sessErr)
        setSessions([])
        }
    } catch (err: any) {
        console.error("Failed to fetch user data:", err)

        // If unauthorized, clear token and redirect
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load user data. Please try refreshing the page.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchData()
}, [router])

const handleLogout = () => {
    try {
    tokenManager.removeToken()
    router.push("/")
    } catch (error) {
    console.error("Error during logout:", error)
    // Force redirect even if there's an error
    router.push("/")
    }
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
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading your rewards dashboard...</p>
            <p className="text-slate-500 text-xs sm:text-sm">Please wait a moment</p>
        </div>
        </div>
    </div>
    )
}

if (error) {
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
            <Button variant="outline" onClick={handleLogout}>
            Sign Out
            </Button>
        </div>
        </div>
    </div>
    )
}

if (!user) return null

const getInitials = () => {
    return `${user.prénom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase()
}

// Calculate stats
const userStats = {
    tripsRegistered: userInscriptions.filter((i) => i.statut === "active").length,
    tripsCompleted: userInscriptions.filter((i) => i.statut === "completed").length,
    totalRegistrations: userInscriptions.length,
    availableSessions: sessions.length,
}

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-sky-50">
    {/* Enhanced Header */}
    <Navigation />

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Rewards Stats Cards */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Your Rewards Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-800">Active Registrations</CardTitle>
                <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{userStats.tripsRegistered}</div>
                <p className="text-slate-700 text-xs sm:text-sm">Current registrations</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-400 to-sky-500 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-sky-100">Completed Trips</CardTitle>
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-sky-200 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">{userStats.tripsCompleted}</div>
                <p className="text-sky-100 text-xs sm:text-sm">Successful trips</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total Registrations</CardTitle>
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">{userStats.totalRegistrations}</div>
                <p className="text-slate-300 text-xs sm:text-sm">All time</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-100">Available Sessions</CardTitle>
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-200 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">{userStats.availableSessions}</div>
                <p className="text-green-100 text-xs sm:text-sm">Sessions to explore</p>
            </CardContent>
            </Card>
        </div>
        </section>

        {/* My Trip Registrations */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <MapPin className="h-6 w-6 text-sky-500" />
            My Trip Registrations
        </h2>
        {userInscriptions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {userInscriptions.slice(0, 6).map((inscription) => {
                const session = sessions.find((s) => s.id === inscription.session_id)
                return (
                <Card
                    key={inscription.id}
                    className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="h-32 bg-gradient-to-br from-sky-400 to-sky-500 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                        <Badge
                        className={`${
                            inscription.statut === "active"
                            ? "bg-green-500"
                            : inscription.statut === "completed"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        } text-white font-semibold`}
                        >
                        {inscription.statut}
                        </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">
                        {session?.nom || inscription.session_name || "Session"}
                        </h3>
                        {session?.destination_nom && (
                        <p className="text-sky-100 text-sm">{session.destination_nom}</p>
                        )}
                    </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Registration Date:</span>
                        <span className="font-semibold text-slate-900">
                            {new Date(inscription.date_inscription).toLocaleDateString()}
                        </span>
                        </div>
                        {session && (
                        <>
                            <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">Start Date:</span>
                            <span className="font-semibold text-slate-900">
                                {new Date(session.date_debut).toLocaleDateString()}
                            </span>
                            </div>
                            <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">End Date:</span>
                            <span className="font-semibold text-slate-900">
                                {new Date(session.date_fin).toLocaleDateString()}
                            </span>
                            </div>
                        </>
                        )}
                    </div>
                    </CardContent>
                </Card>
                )
            })}
            </div>
        ) : (
            <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
                <Plane className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Registrations Yet</h3>
                <p className="text-slate-600 mb-6">Start exploring available sessions and register for your next adventure!</p>
                <Button
                onClick={() => router.push("/registration")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300"
                >
                Browse Sessions
                </Button>
            </CardContent>
            </Card>
        )}
        </section>

        {/* Employee Profile Card */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <User className="h-6 w-6 text-slate-700" />
            Employee Profile
        </h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Fuel className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0" />
                Naftal Employee Information
            </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Full Name
                </label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 bg-yellow-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-yellow-400 break-words">
                    {user.prénom} {user.nom}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Employee ID
                </label>
                <p className="text-base sm:text-lg font-mono font-bold text-sky-700 bg-sky-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-sky-400 break-all">
                    {user.matricule}
                </p>
                </div>

                <div className="space-y-3 md:col-span-2 xl:col-span-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Email Address
                </label>
                <p className="text-sm sm:text-base font-medium text-slate-800 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-slate-400 break-all">
                    {user.email}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Department
                </label>
                <p className="text-base sm:text-lg font-semibold text-slate-900 bg-gradient-to-r from-yellow-50 to-sky-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-yellow-400 break-words">
                    {user.department}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Phone Number
                </label>
                <p className="text-base sm:text-lg font-semibold text-slate-900 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-slate-400 break-words">
                    {user.téléphone}
                </p>
                </div>
            </div>
            </CardContent>
        </Card>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Gift className="h-6 w-6 text-yellow-500" />
            Quick Actions
        </h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold">Available Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-yellow-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Button
                onClick={() => router.push("/travel-periods")}
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base"
                >
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">Travel Periods</span>
                </Button>
                <Button
                onClick={() => router.push("/registration")}
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base"
                >
                <Plane className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">Register for Trip</span>
                </Button>

                <Button
                onClick={() => router.push("/winners")}
                variant="outline"
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-transparent text-sm sm:text-base"
                >
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">View Winners</span>
                </Button>

                <Button
                onClick={() => router.push("/profile")}
                variant="outline"
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-transparent text-sm sm:text-base"
                >
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">Profile Settings</span>
                </Button>
            </div>
            </CardContent>
        </Card>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Award className="h-6 w-6 text-sky-500" />
            Recent Activity
        </h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                Latest Updates
            </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-sky-50">
            <div className="space-y-4 sm:space-y-6">
                {userInscriptions.slice(0, 3).map((inscription, index) => (
                <div
                    key={inscription.id}
                    className="flex items-start sm:items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg flex-shrink-0 mt-1 sm:mt-0"></div>
                    <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                        Registered for {inscription.session_name || "Session"}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        {new Date(inscription.date_inscription).toLocaleDateString()}
                    </p>
                    </div>
                    <Badge
                    className={`${
                        inscription.statut === "active"
                        ? "bg-green-500"
                        : inscription.statut === "completed"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    } text-white px-2 sm:px-3 py-1 text-xs flex-shrink-0`}
                    >
                    {inscription.statut}
                    </Badge>
                </div>
                ))}

                {userInscriptions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">Register for a session to see your activity here</p>
                </div>
                )}
            </div>
            </CardContent>
        </Card>
        </section>
    </main>
    </div>
)
}
