"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Trophy, Medal, Users, Calendar, Building2, Star, Loader2, Play } from "lucide-react"
import api from "@/lib/api"
import type { ResultatSelection } from "@/lib/types"
import { toast } from "sonner"
import { tokenManager } from "@/lib/auth"

// Mock employee names for the spinning wheel (replace with real data)
const mockEmployees = [
    "Ahmed Benali", "Fatima Zahra", "Mohamed Cherif", "Amina Khadija", 
    "Youssef Amine", "Salma Nour", "Omar Tarek", "Khadija Aicha",
    "Hassan Ali", "Zineb Malak", "Karim Said", "Layla Rim",
    "Mehdi Ayoub", "Samira Widad", "Rachid Nabil", "Hanane Ghita"
]

export default function WinnersPage() {
const [winners, setWinners] = useState<ResultatSelection[]>([])
const [loading, setLoading] = useState(true)
const [generating, setGenerating] = useState(false)
const [currentEmployee, setCurrentEmployee] = useState("")
const [spinning, setSpinning] = useState(false)
const [selectedEmployee, setSelectedEmployee] = useState("")
const [isAdmin, setIsAdmin] = useState(false)

useEffect(() => {
const employee = tokenManager.getEmployeeData()
if (employee && employee.role === "admin") {
    setIsAdmin(true)
}
}, [])

useEffect(() => {
    fetchWinners()
}, [])

const fetchWinners = async () => {
    try {
        const response = await api.get("/resultat-selections")
        setWinners(response.data)
    } catch (error) {
        toast.error("Failed to fetch winners")
        console.error("Error fetching winners:", error)
    } finally {
        setLoading(false)
    }
}

const spinWheel = () => {
    return new Promise((resolve) => {
        setSpinning(true)
        let currentIndex = 0
        const totalSpins = 30 + Math.floor(Math.random() * 20) // 30-50 spins
        let spinCount = 0

        const spinInterval = setInterval(() => {
            setCurrentEmployee(mockEmployees[currentIndex])
            currentIndex = (currentIndex + 1) % mockEmployees.length
            spinCount++

            // Slow down towards the end
            if (spinCount > totalSpins - 10) {
                clearInterval(spinInterval)
                const slowInterval = setInterval(() => {
                    setCurrentEmployee(mockEmployees[currentIndex])
                    currentIndex = (currentIndex + 1) % mockEmployees.length
                    spinCount++

                    if (spinCount >= totalSpins) {
                        clearInterval(slowInterval)
                        const finalEmployee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)]
                        setCurrentEmployee(finalEmployee)
                        setSelectedEmployee(finalEmployee)
                        setSpinning(false)
                        resolve(finalEmployee)
                    }
                }, 200) // Slower speed
            }
        }, 50) // Fast initial speed
    })
}

const generateWinners = async () => {
    setGenerating(true)
    setSelectedEmployee("")
    
    try {
        console.log("🟢 Generate clicked")
        
        // Show the spinning wheel for 3-5 selections
        const numberOfSelections = 3 + Math.floor(Math.random() * 3)
        
        for (let i = 0; i < numberOfSelections; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause between selections
            await spinWheel()
            await new Promise(resolve => setTimeout(resolve, 1000)) // Show selected name
        }
        
        // Now make the actual API call
        const res = await api.post("/resultat-selections/winners/generate")
        console.log("✅ Response:", res.data)
        toast.success("Winners generated successfully")
        await fetchWinners()
        
    } catch (err) {
        console.error("❌ Error:", err)
        toast.error("Failed to generate winners")
    } finally {
        setGenerating(false)
        setCurrentEmployee("")
        setSelectedEmployee("")
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    })
}

const getWinnerIcon = (type: string, priority: number) => {
    if (type === "officiel") {
    if (priority === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (priority === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (priority === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <Star className="h-5 w-5 text-blue-500" />
    }
    return <Users className="h-5 w-5 text-green-500" />
}

const getWinnerBadge = (type: string) => {
    return type === "officiel" ? (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Official Winner</Badge>
    ) : (
    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
        Alternate
    </Badge>
    )
}

const officialWinners = winners
    .filter((w) => w.type_selection === "officiel")
    .sort((a, b) => a.ordre_priorite - b.ordre_priorite)
const alternates = winners
    .filter((w) => w.type_selection === "suppléant")
    .sort((a, b) => a.ordre_priorite - b.ordre_priorite)

if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <div className="text-lg text-slate-600">Loading winners...</div>
            </div>
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Travel Winners</h1>
        <p className="text-slate-600">Congratulations to all selected participants!</p>
        
        {isAdmin && (
            <div className="mb-6">
                <button
                    onClick={generateWinners}
                    disabled={generating}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                        ${generating 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                        } 
                        text-white shadow-md
                    `}
                >
                    {generating ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Generating Winners...</span>
                        </>
                    ) : (
                        <>
                            <Play className="h-5 w-5" />
                            <span>Generate Winners</span>
                        </>
                    )}
                </button>
            </div>
        )}

        {/* Spinning Wheel */}
        {generating && (
            <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-blue-900">🎯 Winner Selection in Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    {/* Spinning Circle */}
                    <div className="relative">
                        <div className="w-48 h-48 relative">
                            <div className={`
                                absolute inset-0 rounded-full border-8 border-blue-200 bg-white shadow-2xl
                                flex items-center justify-center transition-all duration-300
                                ${spinning ? 'animate-pulse' : ''}
                            `}>
                                <div className="text-center">
                                    <div className={`
                                        text-lg font-bold text-blue-900 transition-all duration-150
                                        ${spinning ? 'scale-110' : 'scale-100'}
                                    `}>
                                        {currentEmployee || "Ready to spin..."}
                                    </div>
                                    {spinning && (
                                        <div className="text-sm text-blue-600 mt-1">
                                            🎲 Selecting...
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Pointer */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
                            </div>
                        </div>
                        
                        {/* Employee Names Around Circle */}
                        <div className="absolute inset-0 w-48 h-48">
                            {mockEmployees.slice(0, 8).map((name, index) => {
                                const angle = (index * 45) - 90 // Distribute around circle
                                const x = Math.cos(angle * Math.PI / 180) * 110
                                const y = Math.sin(angle * Math.PI / 180) * 110
                                
                                return (
                                    <div
                                        key={index}
                                        className={`
                                            absolute text-xs font-medium px-2 py-1 rounded-full transition-all duration-200
                                            ${currentEmployee === name 
                                                ? 'bg-yellow-200 text-yellow-800 scale-110 font-bold' 
                                                : 'bg-gray-100 text-gray-600'
                                            }
                                        `}
                                        style={{
                                            left: `${96 + x}px`,
                                            top: `${96 + y}px`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        {name.split(' ')[0]}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                        {selectedEmployee && !spinning && (
                            <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-sm">
                                <div className="text-green-800 font-semibold">🎉 Selected!</div>
                                <div className="text-green-700 font-bold text-lg">{selectedEmployee}</div>
                            </div>
                        )}
                        
                        {spinning && (
                            <div className="text-blue-600 font-medium">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <div className="mt-2">Spinning the wheel...</div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )}
        </div>

        {winners.length === 0 ? (
        <Card className="text-center py-12">
            <CardContent>
            <Trophy className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Winners Yet</h3>
            <p className="text-slate-600">Winners will be announced once the selection process is complete.</p>
            </CardContent>
        </Card>
        ) : (
        <div className="space-y-8">
            {/* Official Winners */}
            {officialWinners.length > 0 && (
            <div>
                <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-slate-900">Official Winners</h2>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {officialWinners.length} Selected
                </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {officialWinners.map((winner, index) => (
                    <Card key={winner.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:transform hover:scale-105">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            {getWinnerIcon(winner.type_selection, winner.ordre_priorite)}
                            <CardTitle className="text-lg">
                            {winner.employee_nom} {winner.employee_prenom}
                            </CardTitle>
                        </div>
                        {getWinnerBadge(winner.type_selection)}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm">{winner.session_nom}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Selected: {formatDate(winner.date_selection)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-slate-500">Priority: #{winner.ordre_priorite}</div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                            {winner.ordre_priorite === 1
                                ? "🥇"
                                : winner.ordre_priorite === 2
                                ? "🥈"
                                : winner.ordre_priorite === 3
                                    ? "🥉"
                                    : "⭐"}
                            </div>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            )}

            {/* Alternates */}
            {alternates.length > 0 && (
            <div>
                <div className="flex items-center gap-2 mb-6">
                <Users className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-slate-900">Alternates</h2>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {alternates.length} Available
                </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alternates.map((winner) => (
                    <Card key={winner.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 hover:transform hover:scale-105">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            {getWinnerIcon(winner.type_selection, winner.ordre_priorite)}
                            <CardTitle className="text-lg">
                            {winner.employee_nom} {winner.employee_prenom}
                            </CardTitle>
                        </div>
                        {getWinnerBadge(winner.type_selection)}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm">{winner.session_nom}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Selected: {formatDate(winner.date_selection)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-slate-500">Priority: #{winner.ordre_priorite}</div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-green-600">🔄</div>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            )}
        </div>
        )}

        {/* Statistics */}
        {winners.length > 0 && (
        <Card className="mt-8 shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Selection Statistics
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">{officialWinners.length}</div>
                <div className="text-sm font-medium text-slate-600">Official Winners</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-green-600 mb-2">{alternates.length}</div>
                <div className="text-sm font-medium text-slate-600">Alternates</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{winners.length}</div>
                <div className="text-sm font-medium text-slate-600">Total Selected</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                    {new Set(winners.map((w) => w.session_id)).size}
                </div>
                <div className="text-sm font-medium text-slate-600">Sessions</div>
                </div>
            </div>
            </CardContent>
        </Card>
        )}
    </div>
    </div>
)
}