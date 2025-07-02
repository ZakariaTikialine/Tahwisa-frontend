"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
Calendar,
Users,
Clock,
MapPin,
ArrowLeft,
Plane,
AlertCircle,
CalendarDays,
TrendingUp,
Globe,
Award,
Eye,
Filter,
Search,
} from "lucide-react"

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
createdAt: string
updatedAt: string
}

export default function TravelPeriodsPage() {
const [periods, setPeriods] = useState<TravelPeriod[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [searchTerm, setSearchTerm] = useState("")
const [statusFilter, setStatusFilter] = useState<string>("all")
const router = useRouter()

useEffect(() => {
    const fetchTravelPeriods = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        const response = await api.get("/api/periodes")
        setPeriods(response.data)
    } catch (err: any) {
        console.error("Failed to fetch travel periods:", err)

        // If unauthorized, clear token and redirect
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load travel periods. Please try refreshing the page.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchTravelPeriods()
}, [router])

// Filter periods based on search and status
const filteredPeriods = periods.filter((period) => {
    const matchesSearch =
    period.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    period.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    period.type?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || period.status === statusFilter

    return matchesSearch && matchesStatus
})

// Calculate statistics
const stats = {
    totalPeriods: periods.length,
    openPeriods: periods.filter((p) => p.status === "open").length,
    totalRegistrations: periods.reduce((sum, p) => sum + p.registeredCount, 0),
    averageRegistrations:
    periods.length > 0 ? Math.round(periods.reduce((sum, p) => sum + p.registeredCount, 0) / periods.length) : 0,
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

const getStatusText = (status: string) => {
    switch (status) {
    case "open":
        return "Open for Registration"
    case "closed":
        return "Registration Closed"
    case "full":
        return "Fully Booked"
    case "upcoming":
        return "Coming Soon"
    default:
        return "Unknown Status"
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

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Calendar className="h-8 w-8 text-slate-900" />
            </div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-yellow-500 mx-auto"></div>
        <div className="space-y-2">
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading travel periods...</p>
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
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Travel Periods
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                View all available travel destinations and periods
                </p>
            </div>
            </div>

            <div className="ml-auto">
            <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white border-0 px-3 py-1">
                {periods.length} Periods Available
            </Badge>
            <Button
                onClick={() => router.push("/registration")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-semibold px-4 py-2"
            >
                <Plane className="h-4 w-4 mr-2" />
                Register for Trip
            </Button>
            </div>
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8">
        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-800">Total Periods</CardTitle>
            <Globe className="h-5 w-5 text-slate-700" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalPeriods}</div>
            <p className="text-slate-700 text-sm">Available destinations</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-green-100">Open for Registration</CardTitle>
            <CalendarDays className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{stats.openPeriods}</div>
            <p className="text-green-100 text-sm">Currently accepting registrations</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-sky-100">Total Registrations</CardTitle>
            <Users className="h-5 w-5 text-sky-200" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{stats.totalRegistrations}</div>
            <p className="text-sky-100 text-sm">Employees registered</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Average Registrations</CardTitle>
            <TrendingUp className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{stats.averageRegistrations}</div>
            <p className="text-slate-300 text-sm">Per destination</p>
            </CardContent>
        </Card>
        </section>

        {/* Search and Filter */}
        <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Search destinations, descriptions, or types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none shadow-sm"
            />
            </div>

            {/* Status Filter */}
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none shadow-sm appearance-none cursor-pointer"
            >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="full">Full</option>
                <option value="upcoming">Upcoming</option>
            </select>
            </div>
        </div>

        {/* Results count */}
        <div className="text-slate-600 text-sm">
            Showing {filteredPeriods.length} of {periods.length} travel periods
        </div>
        </section>

        {/* Travel Periods Grid */}
        <section className="space-y-6">
        {filteredPeriods.length === 0 ? (
            <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
                <Plane className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No travel periods found</h3>
                <p className="text-slate-600">
                {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "There are currently no travel periods available."}
                </p>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredPeriods.map((period) => {
                const registrationPercentage = getRegistrationPercentage(period.registeredCount, period.maxParticipants)
                const duration = calculateDuration(period.startDate, period.endDate)

                return (
                <Card
                    key={period.id}
                    className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                    {/* Card Header with Destination Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-sky-400 to-sky-500 relative">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <Badge className={`${getStatusColor(period.status)} text-white font-semibold px-3 py-1`}>
                        {getStatusText(period.status)}
                        </Badge>
                    </div>

                    {/* Type Badge */}
                    {period.type && (
                        <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-slate-900 font-semibold px-3 py-1">{period.type}</Badge>
                        </div>
                    )}

                    {/* Destination Info */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {period.destination}
                        </h3>
                        <p className="text-sky-100 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {duration} {duration === 1 ? "day" : "days"}
                        </p>
                    </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-6 space-y-4">
                    {/* Description */}
                    {period.description && (
                        <p className="text-slate-600 text-sm leading-relaxed">{period.description}</p>
                    )}

                    {/* Travel Dates */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">Start Date:</span>
                        <span className="font-semibold text-slate-900">{formatDate(period.startDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">End Date:</span>
                        <span className="font-semibold text-slate-900">{formatDate(period.endDate)}</span>
                        </div>
                    </div>

                    {/* Registration Statistics */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">Registered:</span>
                        <span className="font-semibold text-sky-600">
                            {period.registeredCount} / {period.maxParticipants}
                        </span>
                        </div>

                        {/* Registration Progress Bar */}
                        <div className="space-y-2">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                                registrationPercentage >= 100
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : registrationPercentage >= 80
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                    : "bg-gradient-to-r from-green-500 to-green-600"
                            }`}
                            style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{registrationPercentage}% filled</span>
                            <span>{period.maxParticipants - period.registeredCount} spots remaining</span>
                        </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {formatDate(period.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            ID: {period.id.slice(0, 8)}...
                        </span>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )
            })}
            </div>
        )}
        </section>

        {/* Summary Information */}
        <section className="space-y-6">
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <Award className="h-6 w-6 text-yellow-400" />
                Travel Periods Summary
            </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">
                    {periods.filter((p) => p.status === "open").length}
                </div>
                <p className="text-sm text-slate-600">Open Periods</p>
                </div>

                <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-yellow-600">
                    {periods.filter((p) => p.status === "full").length}
                </div>
                <p className="text-sm text-slate-600">Fully Booked</p>
                </div>

                <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-red-600">
                    {periods.filter((p) => p.status === "closed").length}
                </div>
                <p className="text-sm text-slate-600">Closed Periods</p>
                </div>

                <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                    {periods.filter((p) => p.status === "upcoming").length}
                </div>
                <p className="text-sm text-slate-600">Upcoming Periods</p>
                </div>
            </div>
            </CardContent>
        </Card>
        </section>
    </main>
    </div>
)
}
