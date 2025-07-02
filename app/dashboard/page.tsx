"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
User,
Mail,
Building,
Hash,
LogOut,
Settings,
Bell,
Calendar,
Clock,
Shield,
Activity,
Users,
Menu,
X,
} from "lucide-react"

export default function DashboardPage() {
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const router = useRouter()

useEffect(() => {
    const fetchMe = async () => {
        try {
        const res = await api.get('/auth/me')
        const u = res.data

        setUser({
            firstName: u.prénom,
            lastName: u.nom,
            email: u.email,
            department: u.department,
            employeeId: u.id,
            role: u.role || 'Employee'
        })
        } catch (err) {
        router.push('/login')
        } finally {
        setLoading(false)
        }
    }

fetchMe()
}, [router])


const handleLogout = () => {
    Cookies.remove("token")
    router.push("/login")
}

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100 px-4">
        <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-yellow-500 mx-auto"></div>
        <div className="space-y-2">
            <p className="text-slate-700 font-medium text-sm sm:text-base">Loading dashboard...</p>
            <p className="text-slate-500 text-xs sm:text-sm">Please wait a moment</p>
        </div>
        </div>
    </div>
    )
}

if (!user) return null

const getInitials = () => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
}

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-sky-50">
    {/* Enhanced Header */}
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-sky-500/10"></div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden absolute top-4 right-4 z-20">
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-white/10"
        >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        </div>

        <div className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            {/* User Info Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-yellow-400/30 shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 text-xl sm:text-2xl font-bold">
                    {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent leading-tight">
                    Welcome back, {user.firstName}
                </h1>
                <p className="text-slate-300 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                    ID: {user.employeeId || "Not defined"}
                </p>
                <Badge className="bg-gradient-to-r from-sky-500 to-sky-400 text-white border-0 px-3 py-1 text-xs sm:text-sm">
                    {user.department || "Department not specified"}
                </Badge>
                </div>
            </div>

            {/* Action Buttons */}
            <div
                className={`${mobileMenuOpen ? "block" : "hidden"} lg:block absolute lg:relative top-16 lg:top-0 left-0 right-0 lg:left-auto lg:right-auto bg-slate-800/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-4 lg:p-0 rounded-b-lg lg:rounded-none border-t lg:border-t-0 border-white/10`}
            >
                <div className="flex flex-col lg:flex-row gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-yellow-500/20 border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/30 hover:text-yellow-200 justify-start lg:justify-center"
                >
                    <Bell className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="lg:hidden xl:inline">Notifications</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-sky-500/20 border-sky-400/50 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 justify-start lg:justify-center"
                >
                    <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="lg:hidden xl:inline">Settings</span>
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 border-0 justify-start lg:justify-center"
                >
                    <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="lg:hidden xl:inline">Logout</span>
                </Button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Stats Cards */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-800">Employee ID</CardTitle>
                <Hash className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{user.employeeId || "N/A"}</div>
                <p className="text-slate-700 text-xs sm:text-sm">Unique identifier</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-sky-400 to-sky-500 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-sky-100">Department</CardTitle>
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-sky-200 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-lg sm:text-2xl font-bold truncate">{user.department || "Not defined"}</div>
                <p className="text-sky-100 text-xs sm:text-sm">Current assignment</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Email Status</CardTitle>
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-lg sm:text-xl font-bold">Verified</div>
                <p className="text-slate-300 text-xs sm:text-sm">Professional address</p>
            </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-100">Account Status</CardTitle>
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-200 flex-shrink-0" />
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
                <div className="text-lg sm:text-2xl font-bold">Active</div>
                <p className="text-green-100 text-xs sm:text-sm">All systems operational</p>
            </CardContent>
            </Card>
        </div>
        </section>

        {/* User Details Card */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Profile Information</h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0" />
                Detailed Information
            </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Full Name
                </label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 bg-yellow-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-yellow-400 break-words">
                    {user.firstName} {user.lastName}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Employee ID
                </label>
                <p className="text-base sm:text-lg font-mono font-bold text-sky-700 bg-sky-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-sky-400 break-all">
                    {user.employeeId || "Not assigned"}
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
                    {user.department || "Not specified"}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Position
                </label>
                <p className="text-base sm:text-lg font-semibold text-slate-900 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-slate-400 break-words">
                    {user.position || "Not specified"}
                </p>
                </div>

                <div className="space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Member Since
                </label>
                <p className="text-sm sm:text-base text-slate-700 flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-l-4 border-green-400">
                    <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="break-words">
                    {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : "Not available"}
                    </span>
                </p>
                </div>
            </div>
            </CardContent>
        </Card>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Quick Actions</h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold">Available Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-yellow-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Button className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base">
                <User className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">My Profile</span>
                </Button>

                <Button
                variant="outline"
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-transparent text-sm sm:text-base"
                >
                <Users className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">My Team</span>
                </Button>

                <Button
                variant="outline"
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-transparent text-sm sm:text-base"
                >
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">Settings</span>
                </Button>

                <Button
                variant="outline"
                className="h-24 sm:h-28 flex-col gap-3 sm:gap-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-transparent text-sm sm:text-base"
                >
                <Bell className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                <span className="font-semibold">Notifications</span>
                </Button>
            </div>
            </CardContent>
        </Card>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Activity</h2>
        <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                Latest Updates
            </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-sky-50">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start sm:items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg flex-shrink-0 mt-1 sm:mt-0"></div>
                <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-slate-900">System Connection</p>
                    <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    Just now
                    </p>
                </div>
                <Badge className="bg-yellow-500 text-slate-900 px-2 sm:px-3 py-1 text-xs flex-shrink-0">Live</Badge>
                </div>

                <div className="flex items-start sm:items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-green-100 to-green-50 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg flex-shrink-0 mt-1 sm:mt-0"></div>
                <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-slate-900">Profile Updated</p>
                    <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />2 hours ago
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className="border-green-400 text-green-700 px-2 sm:px-3 py-1 text-xs flex-shrink-0"
                >
                    Completed
                </Badge>
                </div>

                <div className="flex items-start sm:items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-sky-100 to-sky-50 rounded-xl border-l-4 border-sky-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-4 h-4 bg-sky-500 rounded-full shadow-lg flex-shrink-0 mt-1 sm:mt-0"></div>
                <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-slate-900">Account Created</p>
                    <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">
                        {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })
                        : "Unknown date"}
                    </span>
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className="border-sky-400 text-sky-700 px-2 sm:px-3 py-1 text-xs flex-shrink-0"
                >
                    History
                </Badge>
                </div>
            </div>
            </CardContent>
        </Card>
        </section>
    </main>
    </div>
)
}
