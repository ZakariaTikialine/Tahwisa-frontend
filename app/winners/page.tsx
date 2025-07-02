"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
Trophy,
ArrowLeft,
AlertCircle,
Calendar,
MapPin,
Building,
Award,
Crown,
UserCheck,
Filter,
Search,
Download,
Eye,
} from "lucide-react"

interface Winner {
id: string
employeeId: string
employeeName: string
firstName: string
lastName: string
role: "official" | "backup"
center: string
periodId: string
selectionDate: string
status: "selected" | "confirmed" | "declined"
}

interface TravelPeriod {
id: string
destination: string
startDate: string
endDate: string
maxParticipants: number
status: string
}

interface Selection {
periodId: string
period: TravelPeriod
winners: Winner[]
officialCount: number
backupCount: number
centerBreakdown: { [center: string]: { official: number; backup: number } }
}

export default function WinnersPage() {
const [selections, setSelections] = useState<Selection[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [searchTerm, setSearchTerm] = useState("")
const [centerFilter, setCenterFilter] = useState<string>("all")
const [roleFilter, setRoleFilter] = useState<string>("all")
const [activeTab, setActiveTab] = useState<string>("")
const router = useRouter()

useEffect(() => {
    const fetchSelections = async () => {
    try {
        // Check if token exists
        if (!tokenManager.hasToken()) {
        router.push("/login")
        return
        }

        const response = await api.get("/api/selections")
        const selectionsData = response.data

        // Group selections by period and calculate statistics
        const groupedSelections: { [periodId: string]: Selection } = {}

        selectionsData.forEach((winner: Winner) => {
        if (!groupedSelections[winner.periodId]) {
            groupedSelections[winner.periodId] = {
            periodId: winner.periodId,
            period: {
                id: winner.periodId,
                destination: "Unknown Destination",
                startDate: "",
                endDate: "",
                maxParticipants: 0,
                status: "unknown",
            },
            winners: [],
            officialCount: 0,
            backupCount: 0,
            centerBreakdown: {},
            }
        }

        const selection = groupedSelections[winner.periodId]
        selection.winners.push(winner)

        // Count by role
        if (winner.role === "official") {
            selection.officialCount++
        } else {
            selection.backupCount++
        }

        // Count by center
        if (!selection.centerBreakdown[winner.center]) {
            selection.centerBreakdown[winner.center] = { official: 0, backup: 0 }
        }
        selection.centerBreakdown[winner.center][winner.role]++
        })

        const selectionsArray = Object.values(groupedSelections)
        setSelections(selectionsArray)

        // Set first tab as active
        if (selectionsArray.length > 0) {
        setActiveTab(selectionsArray[0].periodId)
        }
    } catch (err: any) {
        console.error("Failed to fetch selections:", err)

        // If unauthorized, clear token and redirect
        if (err.response?.status === 401) {
        tokenManager.removeToken()
        router.push("/login")
        } else {
        setError("Failed to load winners data. Please try refreshing the page.")
        }
    } finally {
        setLoading(false)
    }
    }

    fetchSelections()
}, [router])

// Get unique centers for filter
const allCenters = Array.from(
    new Set(selections.flatMap((selection) => selection.winners.map((winner) => winner.center))),
)

// Filter winners based on search and filters
const getFilteredWinners = (winners: Winner[]) => {
    return winners.filter((winner) => {
    const matchesSearch =
        winner.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCenter = centerFilter === "all" || winner.center === centerFilter
    const matchesRole = roleFilter === "all" || winner.role === roleFilter

    return matchesSearch && matchesCenter && matchesRole
    })
}

// Calculate total statistics
const totalStats = {
    totalWinners: selections.reduce((sum, s) => sum + s.winners.length, 0),
    totalOfficials: selections.reduce((sum, s) => sum + s.officialCount, 0),
    totalBackups: selections.reduce((sum, s) => sum + s.backupCount, 0),
    totalPeriods: selections.length,
}

const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available"
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    })
}

const getInitials = (winner: Winner) => {
    const firstName = winner.firstName || ""
    const lastName = winner.lastName || ""
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "W"
}

const getFullName = (winner: Winner) => {
    if (winner.employeeName) return winner.employeeName
    return `${winner.firstName || ""} ${winner.lastName || ""}`.trim() || "Unknown Employee"
}

const getRoleColor = (role: string) => {
    return role === "official"
    ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
    : "bg-gradient-to-r from-sky-500 to-sky-400"
}

const getRoleIcon = (role: string) => {
    return role === "official" ? Crown : UserCheck
}

const getStatusColor = (status: string) => {
    switch (status) {
    case "confirmed":
        return "bg-green-500"
    case "declined":
        return "bg-red-500"
    case "selected":
    default:
        return "bg-yellow-500"
    }
}

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Trophy className="h-8 w-8 text-slate-900" />
            </div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-yellow-500 mx-auto"></div>
        <div className="space-y-2">
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading winners...</p>
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
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Trip Winners
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">Selected employees for travel rewards</p>
            </div>
            </div>

            <div className="ml-auto">
            <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white border-0 px-3 py-1">
                {totalStats.totalWinners} Winners Selected
            </Badge>
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
            <CardTitle className="text-sm font-medium text-slate-800">Total Winners</CardTitle>
            <Trophy className="h-5 w-5 text-slate-700" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalStats.totalWinners}</div>
            <p className="text-slate-700 text-sm">Selected employees</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-green-100">Official Winners</CardTitle>
            <Crown className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{totalStats.totalOfficials}</div>
            <p className="text-green-100 text-sm">Primary selections</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-sky-100">Backup Winners</CardTitle>
            <UserCheck className="h-5 w-5 text-sky-200" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{totalStats.totalBackups}</div>
            <p className="text-sky-100 text-sm">Reserve selections</p>
            </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">Travel Periods</CardTitle>
            <Calendar className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
            <div className="text-3xl font-bold">{totalStats.totalPeriods}</div>
            <p className="text-slate-300 text-sm">With selections</p>
            </CardContent>
        </Card>
        </section>

        {/* Search and Filter */}
        <section className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none shadow-sm"
            />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
            {/* Center Filter */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-slate-400" />
                </div>
                <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none shadow-sm appearance-none cursor-pointer min-w-[150px]"
                >
                <option value="all">All Centers</option>
                {allCenters.map((center) => (
                    <option key={center} value={center}>
                    {center}
                    </option>
                ))}
                </select>
            </div>

            {/* Role Filter */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
                </div>
                <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 outline-none shadow-sm appearance-none cursor-pointer min-w-[140px]"
                >
                <option value="all">All Roles</option>
                <option value="official">Official</option>
                <option value="backup">Backup</option>
                </select>
            </div>

            {/* Export Button */}
            <Button
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-6 py-3 bg-transparent"
            >
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
            </div>
        </div>
        </section>

        {/* Winners by Period - Tabs */}
        <section className="space-y-6">
        {selections.length === 0 ? (
            <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
                <Trophy className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No winners selected yet</h3>
                <p className="text-slate-600">Winners will appear here once the selection process is completed.</p>
            </CardContent>
            </Card>
        ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-2 bg-white p-2 rounded-xl shadow-lg min-w-max">
                {selections.map((selection) => (
                    <TabsTrigger
                    key={selection.periodId}
                    value={selection.periodId}
                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-400 data-[state=active]:text-slate-900 rounded-lg transition-all duration-300 min-w-[200px]"
                    >
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-semibold text-sm">{selection.period.destination}</span>
                    </div>
                    <div className="text-xs opacity-75">
                        {selection.officialCount + selection.backupCount} winners
                    </div>
                    </TabsTrigger>
                ))}
                </TabsList>
            </div>

            {/* Tab Content */}
            {selections.map((selection) => {
                const filteredWinners = getFilteredWinners(selection.winners)

                return (
                <TabsContent key={selection.periodId} value={selection.periodId} className="space-y-6">
                    {/* Period Information */}
                    <Card className="border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-2xl font-bold mb-2">
                            <MapPin className="h-6 w-6 text-yellow-400" />
                            {selection.period.destination}
                            </CardTitle>
                            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(selection.period.startDate)} - {formatDate(selection.period.endDate)}
                            </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Badge className="bg-yellow-500 text-slate-900 px-3 py-1">
                            {selection.officialCount} Official
                            </Badge>
                            <Badge className="bg-sky-500 text-white px-3 py-1">{selection.backupCount} Backup</Badge>
                        </div>
                        </div>
                    </CardHeader>

                    {/* Center Breakdown */}
                    <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-slate-600" />
                        Winners by Center
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(selection.centerBreakdown).map(([center, counts]) => (
                            <div key={center} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <h4 className="font-semibold text-slate-900 mb-2">{center}</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Official:</span>
                                <Badge className="bg-yellow-500 text-slate-900 px-2 py-1 text-xs">
                                    {counts.official}
                                </Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Backup:</span>
                                <Badge className="bg-sky-500 text-white px-2 py-1 text-xs">{counts.backup}</Badge>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                    </Card>

                    {/* Winners List */}
                    <Card className="border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 p-6">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <Award className="h-6 w-6" />
                        Selected Winners
                        <span className="text-sm font-normal bg-slate-900/20 px-2 py-1 rounded-lg">
                            {filteredWinners.length} of {selection.winners.length}
                        </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {filteredWinners.length === 0 ? (
                        <div className="text-center py-8">
                            <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No winners match your filters</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
                        </div>
                        ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredWinners.map((winner) => {
                            const RoleIcon = getRoleIcon(winner.role)

                            return (
                                <Card
                                key={winner.id}
                                className="border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-12 w-12 border-2 border-slate-200">
                                        <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 font-bold">
                                        {getInitials(winner)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Winner Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-slate-900 truncate">{getFullName(winner)}</h3>
                                        <RoleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                        </div>

                                        <div className="space-y-2">
                                        {/* Employee ID */}
                                        <p className="text-sm text-slate-600 flex items-center gap-2">
                                            <span className="font-medium">ID:</span>
                                            <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                                            {winner.employeeId}
                                            </code>
                                        </p>

                                        {/* Center */}
                                        <p className="text-sm text-slate-600 flex items-center gap-2">
                                            <Building className="h-3 w-3" />
                                            {winner.center}
                                        </p>

                                        {/* Role Badge */}
                                        <div className="flex items-center gap-2">
                                            <Badge
                                            className={`${getRoleColor(winner.role)} text-slate-900 font-semibold px-3 py-1 text-xs`}
                                            >
                                            {winner.role.charAt(0).toUpperCase() + winner.role.slice(1)}
                                            </Badge>

                                            {/* Status Badge */}
                                            <Badge
                                            className={`${getStatusColor(winner.status)} text-white px-2 py-1 text-xs`}
                                            >
                                            {winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}
                                            </Badge>
                                        </div>

                                        {/* Selection Date */}
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Selected: {formatDate(winner.selectionDate)}
                                        </p>
                                        </div>
                                    </div>
                                    </div>
                                </CardContent>
                                </Card>
                            )
                            })}
                        </div>
                        )}
                    </CardContent>
                    </Card>
                </TabsContent>
                )
            })}
            </Tabs>
        )}
        </section>
    </main>
    </div>
)
}
