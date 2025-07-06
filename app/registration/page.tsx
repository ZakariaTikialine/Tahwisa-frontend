"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Plane, Calendar, Clock, Building2, CheckCircle } from "lucide-react"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import type { Session, Employee } from "@/lib/types"
import { toast } from "sonner"

export default function RegistrationPage() {
const [sessions, setSessions] = useState<Session[]>([])
const [employee, setEmployee] = useState<Employee | null>(null)
const [loading, setLoading] = useState(true)
const [registering, setRegistering] = useState<number | null>(null)
const [selectedSession, setSelectedSession] = useState<Session | null>(null)



useEffect(() => {
    const employeeData = tokenManager.getEmployeeData()
    if (employeeData) {
    setEmployee({ ...employeeData, role: "employee" })
    }
    fetchSessions()
}, [])

const fetchSessions = async () => {
    try {
    const response = await api.get("/sessions")
    // Filter for upcoming sessions only
    const now = new Date()
    const upcomingSessions = response.data.filter((session: Session) => new Date(session.date_debut) > now)
    setSessions(upcomingSessions)
    } catch (error) {
    toast.error("Failed to fetch sessions")
    console.error("Error fetching sessions:", error)
    } finally {
    setLoading(false)
    }
}

const handleRegister = async (sessionId: number) => {
    if (!employee) return

    setRegistering(sessionId)
    try {
    await api.post("/inscriptions", {
        employee_id: employee.id,
        session_id: sessionId,
    })
    toast.success("Registration successful!")
    fetchSessions() // Refresh to update availability
    } catch (error: any) {
    const message = error.response?.data?.message || "Registration failed"
    toast.error(message)
    } finally {
    setRegistering(null)
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    })
}

const getSessionStatus = (session: Session) => {
    const now = new Date()
    const startDate = new Date(session.date_debut)

    if (now < startDate) {
    return { status: "available", color: "bg-green-100 text-green-800", label: "Available" }
    }
    return { status: "unavailable", color: "bg-gray-100 text-gray-800", label: "Unavailable" }
}

if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-600">Loading sessions...</div>
        </div>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <Navigation />

    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Register for Travel</h1>
        <p className="text-slate-600">Choose from available travel sessions and secure your spot</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
            const sessionStatus = getSessionStatus(session)
            const isAvailable = sessionStatus.status === "available"

            return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{session.nom}</CardTitle>
                    <Badge className={sessionStatus.color}>{sessionStatus.label}</Badge>
                </div>
                </CardHeader>

                <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">{session.destination_nom}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{session.periode_nom}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                    {formatDate(session.date_debut)} - {formatDate(session.date_fin)}
                    </span>
                </div>

                <div className="flex gap-2 pt-2">
                    <Dialog>
                    <DialogTrigger asChild>
                        <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedSession(session)}
                        >
                        View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                        <DialogTitle>{selectedSession?.nom}</DialogTitle>
                        </DialogHeader>
                        {selectedSession && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-600" />
                            <span>{selectedSession.destination_nom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-600" />
                            <span>{selectedSession.periode_nom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-600" />
                            <span>
                                {formatDate(selectedSession.date_debut)} - {formatDate(selectedSession.date_fin)}
                            </span>
                            </div>
                            <div className="pt-4">
                            <Button
                                onClick={() => {
                                handleRegister(selectedSession.id)
                                }}
                                disabled={!isAvailable || registering === selectedSession.id}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                            >
                                {registering === selectedSession.id ? (
                                "Registering..."
                                ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Register Now
                                </>
                                )}
                            </Button>
                            </div>
                        </div>
                        )}
                    </DialogContent>
                    </Dialog>

                    <Button
                    size="sm"
                    onClick={() => handleRegister(session.id)}
                    disabled={!isAvailable || registering === session.id}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                    >
                    {registering === session.id ? (
                        "..."
                    ) : (
                        <>
                        <Plane className="h-4 w-4 mr-1" />
                        Register
                        </>
                    )}
                    </Button>
                </div>
                </CardContent>
            </Card>
            )
        })}
        </div>

        {sessions.length === 0 && (
        <div className="text-center py-12">
            <Plane className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions available</h3>
            <p className="text-slate-600">Check back later for new travel opportunities.</p>
        </div>
        )}
    </div>
    </div>
)
}
