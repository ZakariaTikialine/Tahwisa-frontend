"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Fuel, Home, User, Calendar, Plane, Trophy, LogOut, Menu, X, Settings } from "lucide-react"

export function Navigation() {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const router = useRouter()
const pathname = usePathname()
const isLoggedIn = tokenManager.hasToken()

const handleLogout = () => {
    tokenManager.removeToken()
    router.push("/")
}

const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/travel-periods", label: "Travel Periods", icon: Calendar },
    { href: "/registration", label: "Register for Trip", icon: Plane },
    { href: "/winners", label: "Winners", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
]

if (!isLoggedIn) return null

return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <Fuel className="h-6 w-6 text-slate-900" />
            </div>
            <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Tahwisa
            </h1>
            <p className="text-xs text-slate-400">Naftal Rewards</p>
            </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
                <Button
                key={item.href}
                variant="ghost"
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-slate-300 hover:text-yellow-400 hover:bg-white/10"
                }`}
                >
                <Icon className="h-4 w-4" />
                {item.label}
                </Button>
            )
            })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
            <Button
            variant="ghost"
            onClick={() => router.push("/profile")}
            className="text-slate-300 hover:text-yellow-400 hover:bg-white/10"
            >
            <Settings className="h-4 w-4 mr-2" />
            Settings
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
            </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:bg-white/10"
        >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 py-4">
            <div className="space-y-2">
            {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                <Button
                    key={item.href}
                    variant="ghost"
                    onClick={() => {
                    router.push(item.href)
                    setMobileMenuOpen(false)
                    }}
                    className={`w-full justify-start gap-3 ${
                    isActive
                        ? "text-yellow-400 bg-yellow-400/10"
                        : "text-slate-300 hover:text-yellow-400 hover:bg-white/10"
                    }`}
                >
                    <Icon className="h-4 w-4" />
                    {item.label}
                </Button>
                )
            })}

            <div className="pt-4 border-t border-white/10 space-y-2">
                <Button
                variant="ghost"
                onClick={() => {
                    router.push("/profile")
                    setMobileMenuOpen(false)
                }}
                className="w-full justify-start gap-3 text-slate-300 hover:text-yellow-400 hover:bg-white/10"
                >
                <Settings className="h-4 w-4" />
                Settings
                </Button>
                <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full justify-start gap-3 bg-red-600 hover:bg-red-700"
                >
                <LogOut className="h-4 w-4" />
                Logout
                </Button>
            </div>
            </div>
        </div>
        )}
    </div>
    </nav>
)
}
