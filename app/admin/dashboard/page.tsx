    "use client"

    import { useState, useEffect } from "react"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Navigation } from "@/components/navigation"
    import { Calendar, Users, Trophy, Clock, TrendingUp, Building2, Plane, Download, Search, Filter } from "lucide-react"
    import { useRouter } from "next/navigation"
    import api from "@/lib/api"
    import type { Employee, Session, Inscription } from "@/lib/types"
    import { tokenManager } from "@/lib/auth"
    import { Input } from "@/components/ui/input"
    import { saveAs } from "file-saver"

    interface DashboardStats {
        totalSessions: number
        activeRegistrations: number
        completedTrips: number
        upcomingSessions: number
    }

    interface FullHistoryRow {
        employee_nom: string
        employee_prenom: string
        session_nom: string
        date_inscription: string
        statut: string
        type_selection: string | null
        ordre_priorite: number | null
        date_selection: string | null
    }

    function AdminHistorySection() {
        const [fullHistory, setFullHistory] = useState<FullHistoryRow[]>([])
        const [search, setSearch] = useState("")
        const [filterYear, setFilterYear] = useState("")
        const [filterStatus, setFilterStatus] = useState("")

        useEffect(() => {
            fetchFullHistory()
        }, [])

        const fetchFullHistory = async () => {
            try {
                const res = await api.get("/inscriptions/full-history")
                setFullHistory(res.data)
            } catch (err) {
                console.error("Failed to load full history", err)
            }
        }

        const filteredHistory = fullHistory.filter(row => {
            const matchesSearch = `${row.employee_nom} ${row.employee_prenom} ${row.session_nom}`
                .toLowerCase()
                .includes(search.toLowerCase())
            const matchesYear = filterYear ? row.date_inscription.startsWith(filterYear) : true
            const matchesStatus = filterStatus ? row.statut === filterStatus : true
            return matchesSearch && matchesYear && matchesStatus
        })

        const downloadCSV = () => {
            const headers = [
                "Nom", "Prénom", "Session", "Date Inscription", "Statut", "Type Sélection", "Ordre", "Date Sélection"
            ]
            const rows = filteredHistory.map(row => [
                row.employee_nom,
                row.employee_prenom,
                row.session_nom,
                row.date_inscription,
                row.statut,
                row.type_selection || "",
                row.ordre_priorite?.toString() || "",
                row.date_selection || ""
            ])
            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            saveAs(blob, `tahwisa_history_${Date.now()}.csv`)
        }

        const getStatusBadge = (status: string) => {
            const styles = {
                active: "bg-green-100 text-green-800 border border-green-200",
                completed: "bg-blue-100 text-blue-800 border border-blue-200",
                cancelled: "bg-red-100 text-red-800 border border-red-200",
                pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
                selected: "bg-purple-100 text-purple-800 border border-purple-200"
            }
            return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 border border-gray-200"
        }

        const getTypeSelectionBadge = (type: string | null) => {
            if (!type) return null
            const styles = {
                automatique: "bg-indigo-50 text-indigo-700 border border-indigo-200",
                manuelle: "bg-orange-50 text-orange-700 border border-orange-200"
            }
            return styles[type as keyof typeof styles] || "bg-gray-50 text-gray-700 border border-gray-200"
        }

        const uniqueStatuses = [...new Set(fullHistory.map(row => row.statut))]
        const uniqueYears = [...new Set(fullHistory.map(row => row.date_inscription.split('-')[0]))]

        return (
            <Card className="mt-8 shadow-lg border-0">
                <CardHeader >
                    <CardTitle className="flex justify-between items-center text-xl font-semibold text-gray-800">
                        <div className="flex items-center gap-2 text-white">
                            📊 Inscriptions & Sélections
                            <span className="text-sm font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {filteredHistory.length} résultats
                            </span>
                        </div>
                        <Button onClick={downloadCSV} className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-md">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter CSV
                        </Button>
                    </CardTitle>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Rechercher nom, prénom, session..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        
                        <select
                            value={filterYear}
                            onChange={e => setFilterYear(e.target.value)}
                            className="cursor-pointer px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Toutes les années</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="cursor-pointer px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Tous les statuts</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </CardHeader>
                
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employé</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Session</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Inscription</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type Sélection</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ordre</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Sélection</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {row.employee_prenom} {row.employee_nom}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{row.session_nom}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(row.date_inscription).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(row.statut)}`}>
                                                {row.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.type_selection ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeSelectionBadge(row.type_selection)}`}>
                                                    {row.type_selection}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {row.ordre_priorite ? (
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                    {row.ordre_priorite}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {row.date_selection ? 
                                                new Date(row.date_selection).toLocaleDateString('fr-FR') : 
                                                <span className="text-gray-400">—</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredHistory.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">📝</div>
                                <p className="text-gray-500">Aucun résultat trouvé</p>
                                <p className="text-sm text-gray-400">Essayez de modifier vos filtres</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
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
            return { status: "Completed", color: "text-black" }
        }

        if (loading) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                    <Navigation />
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-lg text-black">Loading dashboard...</div>
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
                        <h1 className="text-3xl font-bold text-black mb-2">
                            Welcome back, {employee?.prénom} {employee?.nom}!
                        </h1>
                        <p className="text-black">
                            Employee ID: {employee?.matricule} | Structure: {employee?.structure}
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
                                                    <h4 className="font-medium text-black">{session.nom}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-black mt-1">
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
                                    <p className="text-black text-center py-4">No sessions available</p>
                                )}

                                <Button onClick={() => router.push("/travel-periods")} className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700">
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
                                                <h4 className="font-medium text-black">{inscription.session_name}</h4>
                                                <div className="flex items-center gap-4 text-sm text-black mt-1">
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
                                                            : "bg-slate-100 text-black"
                                                }`}
                                            >
                                                {inscription.statut}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-black text-center py-4">No registrations yet</p>
                                )}

                                <Button
                                    onClick={() => router.push("/registration")}
                                    className="cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-black"
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
                                <Button onClick={() => router.push("/travel-periods")} variant="outline" className="cursor-pointer h-20 flex-col gap-2">
                                    <Calendar className="h-6 w-6" />
                                    View Periods
                                </Button>
                                <Button onClick={() => router.push("/registration")} variant="outline" className="cursor-pointer h-20 flex-col gap-2">
                                    <Plane className="h-6 w-6" />
                                    Register
                                </Button>
                                <Button onClick={() => router.push("/winners")} variant="outline" className="cursor-pointer h-20 flex-col gap-2">
                                    <Trophy className="h-6 w-6" />
                                    View Winners
                                </Button>
                                <Button onClick={() => router.push("/profile")} variant="outline" className="cursor-pointer h-20 flex-col gap-2">
                                    <Users className="h-6 w-6" />
                                    Update Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin History Section */}
                    <AdminHistorySection />
                </div>
            </div>
        )
    }
