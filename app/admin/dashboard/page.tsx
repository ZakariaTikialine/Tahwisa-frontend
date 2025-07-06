    "use client"

    import { useState, useEffect } from "react"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Navigation } from "@/components/navigation"
    import { Calendar, Users, Trophy, Clock, TrendingUp, Building2, Plane } from "lucide-react"
    import { useRouter } from "next/navigation"
    import api from "@/lib/api"
    import type { Employee, Session, Inscription } from "@/lib/types"
    import { tokenManager } from "@/lib/auth"

    interface DashboardStats {
    totalSessions: number
    activeRegistrations: number
    completedTrips: number
    upcomingSessions: number
    }

    export default function DashboardPage() {
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [stats, setStats] = useState<DashboardStats>({
        totalSessions: 0,
        activeRegistrations: 0,
        completedTrips: 0,
        upcomingSessions: 0,
    })
    const [recentSessions, setRecentSessions] = useState<Session[]>([])
    const [userInscriptions, setUserInscriptions] = useState<Inscription[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
        const token = tokenManager.getToken()
        if (!token) {
            router.push("/login")
            return
        }

        // Get current user info from token (you might need to decode JWT or call user endpoint)
        const userResponse = await api.get("/auth/me") // Assuming you have this endpoint
        setEmployee(userResponse.data)

        // Fetch sessions
        const sessionsResponse = await api.get("/sessions")
        const sessions = sessionsResponse.data
        setRecentSessions(sessions.slice(0, 3)) // Show latest 3 sessions

        // Fetch user's inscriptions
        const inscriptionsResponse = await api.get(`/inscriptions/employee/${userResponse.data.id}`)
        const inscriptions = inscriptionsResponse.data
        setUserInscriptions(inscriptions)

        // Calculate stats
        const now = new Date()
        const upcomingSessions = sessions.filter((session: Session) => new Date(session.date_debut) > now)
        const activeSessions = sessions.filter((session: Session) => {
            const start = new Date(session.date_debut)
            const end = new Date(session.date_fin)
            return now >= start && now <= end
        })
        const completedSessions = sessions.filter((session: Session) => new Date(session.date_fin) < now)

        setStats({
            totalSessions: sessions.length,
            activeRegistrations: inscriptions.filter((i: Inscription) => i.statut === "active").length,
            completedTrips: inscriptions.filter((i: Inscription) => i.statut === "completed").length,
            upcomingSessions: upcomingSessions.length,
        })
        } catch (error) {
        console.error("Error fetching dashboard data:", error)
        } finally {
        setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        })
    }

    const getSessionStatus = (session: Session) => {
        const now = new Date()
        const startDate = new Date(session.date_debut)
        const endDate = new Date(session.date_fin)

        if (now < startDate) return { status: "Upcoming", color: "text-blue-600" }
        if (now >= startDate && now <= endDate) return { status: "Active", color: "text-green-600" }
        return { status: "Completed", color: "text-gray-600" }
    }

    if (loading) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-slate-600">Loading dashboard...</div>
            </div>
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {employee?.prénom} {employee?.nom}!
            </h1>
            <p className="text-slate-600">
                Employee ID: {employee?.matricule} | Department: {employee?.department}
            </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-blue-100">Available travel sessions</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Registrations</CardTitle>
                <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.activeRegistrations}</div>
                <p className="text-xs text-yellow-100">Your current registrations</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
                <Trophy className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.completedTrips}</div>
                <p className="text-xs text-green-100">Trips you've completed</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                <p className="text-xs text-purple-100">Sessions starting soon</p>
                </CardContent>
            </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Sessions */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Recent Sessions
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {recentSessions.length > 0 ? (
                    recentSessions.map((session) => {
                    const sessionStatus = getSessionStatus(session)
                    return (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{session.nom}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {session.destination_nom}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(session.date_debut)}
                            </span>
                            </div>
                        </div>
                        <div className={`text-sm font-medium ${sessionStatus.color}`}>{sessionStatus.status}</div>
                        </div>
                    )
                    })
                ) : (
                    <p className="text-slate-600 text-center py-4">No sessions available</p>
                )}

                <Button onClick={() => router.push("/travel-periods")} className="w-full bg-blue-600 hover:bg-blue-700">
                    View All Sessions
                </Button>
                </CardContent>
            </Card>

            {/* Your Registrations */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-yellow-600" />
                    Your Registrations
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {userInscriptions.length > 0 ? (
                    userInscriptions.slice(0, 3).map((inscription) => (
                    <div key={inscription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{inscription.session_name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(inscription.date_inscription)}
                            </span>
                            {inscription.deadline && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Deadline: {formatDate(inscription.deadline)}
                            </span>
                            )}
                        </div>
                        </div>
                        <div
                        className={`text-sm font-medium px-2 py-1 rounded ${
                            inscription.statut === "active"
                            ? "bg-green-100 text-green-800"
                            : inscription.statut === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                        >
                        {inscription.statut}
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-slate-600 text-center py-4">No registrations yet</p>
                )}

                <Button
                    onClick={() => router.push("/registration")}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                >
                    Register for Trip
                </Button>
                </CardContent>
            </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button onClick={() => router.push("/travel-periods")} variant="outline" className="h-20 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    View Periods
                </Button>
                <Button onClick={() => router.push("/registration")} variant="outline" className="h-20 flex-col gap-2">
                    <Plane className="h-6 w-6" />
                    Register
                </Button>
                <Button onClick={() => router.push("/winners")} variant="outline" className="h-20 flex-col gap-2">
                    <Trophy className="h-6 w-6" />
                    View Winners
                </Button>
                <Button onClick={() => router.push("/profile")} variant="outline" className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Update Profile
                </Button>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    )
    }
