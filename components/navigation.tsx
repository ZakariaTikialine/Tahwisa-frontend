"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { tokenManager } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Fuel, Home, User, Calendar, Plane, Trophy, LogOut, Menu, X, 
  Building2, ChevronDown, ChevronRight, type LucideIcon
} from "lucide-react"

type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
  admin?: boolean
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuthStatus = () => {
      const hasToken = tokenManager.hasToken()
      setIsLoggedIn(hasToken)
      
      if (hasToken) {
        const employeeData = tokenManager.getEmployeeData()
        if (employeeData) {
          setIsAdmin(employeeData.role === "admin")
        }
      } else {
        setIsAdmin(false)
      }
    }
    checkAuthStatus()
  }, [])

  if (!isLoggedIn) return null

  const handleLogout = () => {
    tokenManager.removeToken()
    router.push("/")
  }

  const navigationItems: NavigationItem[] = [
    ...(isAdmin ? [
      { href: "/admin/dashboard", label: "Dashboard", icon: Home, admin: true },
      { href: "/admin/destinations", label: "Destinations", icon: Building2, admin: true },
      { href: "/admin/sessions", label: "Sessions", icon: Calendar, admin: true },
      { href: "/admin/periodes", label: "Travel Periods", icon: Calendar, admin: true },
    ] : []),
    { href: "/registration", label: "Register for Trip", icon: Plane },
    { href: "/winners", label: "Winners", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User }
  ]

  const userItems = navigationItems.filter(item => !item.admin)
  const adminItems = navigationItems.filter(item => item.admin)

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl sticky top-0 z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => router.push("/registration")} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Fuel className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Tahwisa
              </h1>
              <p className="text-xs text-slate-400">Naftal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* User Navigation Items */}
            {userItems.map((item) => (
              <NavButton 
                key={item.href}
                item={item}
                pathname={pathname}
                router={router}
                onClick={() => {}}
              />
            ))}
            
            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`flex items-center gap-1 px-3 text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin")
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-slate-300 hover:text-yellow-400 hover:bg-white/10"
                  }`}
                >
                  <span>Admin</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${adminMenuOpen ? "rotate-180" : ""}`} />
                </Button>
                
                {adminMenuOpen && (
                  <div className="absolute left-0 mt-1 w-56 origin-top-left rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-slate-700">
                    <div className="py-1">
                      {adminItems.map((item) => (
                        <NavButton 
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          router={router}
                          className="w-full justify-start text-left px-4 py-2 text-sm hover:bg-slate-700"
                          onClick={() => setAdminMenuOpen(false)}
                          iconPosition="left"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logout Button */}
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="h-9 text-sm bg-red-600 hover:bg-red-700 px-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:bg-white/10 p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="py-2 space-y-1">
              {/* User Items */}
              {userItems.map((item) => (
                <MobileNavButton 
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  router={router}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
              
              {/* Admin Items with Accordion */}
              {isAdmin && (
                <div className="space-y-1">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-300 hover:text-yellow-400 hover:bg-slate-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span>Admin Panel</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${adminMenuOpen ? "rotate-90" : ""}`} />
                  </button>
                  
                  {adminMenuOpen && (
                    <div className="ml-8 space-y-1">
                      {adminItems.map((item) => (
                        <MobileNavButton 
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          router={router}
                          onClick={() => setMobileMenuOpen(false)}
                          indent
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Logout Button */}
              <Button
                variant="destructive"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full justify-start gap-3 px-4 py-2 text-sm mt-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

interface NavButtonProps {
  item: NavigationItem
  pathname: string
  router: ReturnType<typeof useRouter>
  className?: string
  onClick: () => void
  iconPosition?: 'left' | 'right'
}

function NavButton({ item, pathname, router, className = "", onClick, iconPosition = "left" }: NavButtonProps) {
  const isActive = pathname === item.href
  const Icon = item.icon
  
  return (
    <Button
      variant="ghost"
      onClick={() => {
        router.push(item.href)
        onClick()
      }}
      className={`flex items-center gap-2 px-3 text-sm font-medium transition-colors ${
        isActive
          ? "text-yellow-400 bg-yellow-400/10"
          : "text-slate-300 hover:text-yellow-400 hover:bg-white/10"
      } ${className}`}
    >
      {iconPosition === "left" && <Icon className="h-4 w-4" />}
      <span>{item.label}</span>
      {iconPosition === "right" && <Icon className="h-4 w-4" />}
    </Button>
  )
}

interface MobileNavButtonProps {
  item: NavigationItem
  pathname: string
  router: ReturnType<typeof useRouter>
  onClick: () => void
  indent?: boolean
}

function MobileNavButton({ item, pathname, router, onClick, indent = false }: MobileNavButtonProps) {
  const isActive = pathname === item.href
  const Icon = item.icon
  
  return (
    <button
      onClick={() => {
        router.push(item.href)
        onClick()
      }}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "text-yellow-400 bg-yellow-400/10"
          : "text-slate-300 hover:text-yellow-400 hover:bg-slate-800"
      } ${indent ? "ml-8" : ""}`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <span>{item.label}</span>
      {item.admin && (
        <span className="text-xs bg-yellow-400/20 px-1.5 py-0.5 rounded ml-auto">Admin</span>
      )}
    </button>
  )
}