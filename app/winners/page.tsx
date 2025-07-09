"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Trophy, Medal, Users, Calendar, Building2, Star } from "lucide-react"
import api from "@/lib/api"
import type { ResultatSelection } from "@/lib/types"
import { toast } from "sonner"
import { tokenManager } from "@/lib/auth"

export default function WinnersPage() {
const [winners, setWinners] = useState<ResultatSelection[]>([])
const [loading, setLoading] = useState(true)


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

const generateWinners = async () => {
try {
    const res = await api.post("/resultat-selections/winners/generate")
    toast.success("Winners generated successfully")
    fetchWinners() // Refresh the winners list
} catch (error) {
    console.error("Failed to generate winners:", error)
    toast.error("Error generating winners")
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
            <div className="text-lg text-slate-600">Loading winners...</div>
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
                    onClick={async () => {
                        console.log("🟢 Generate clicked")
                        try {
                            const res = await api.post("/resultat-selections/winners/generate")
                            console.log("✅ Response:", res.data)
                            toast.success("Winners generated successfully")
                            fetchWinners()
                        } catch (err) {
                            console.error("❌ Error:", err)
                            toast.error("Failed to generate winners")
                        }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                    Generate Winners
                </button>
            </div>
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
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {officialWinners.map((winner, index) => (
                    <Card key={winner.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
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
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alternates.map((winner) => (
                    <Card key={winner.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
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
        <Card className="mt-8">
            <CardHeader>
            <CardTitle>Selection Statistics</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{officialWinners.length}</div>
                <div className="text-sm text-slate-600">Official Winners</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{alternates.length}</div>
                <div className="text-sm text-slate-600">Alternates</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{winners.length}</div>
                <div className="text-sm text-slate-600">Total Selected</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                    {new Set(winners.map((w) => w.session_id)).size}
                </div>
                <div className="text-sm text-slate-600">Sessions</div>
                </div>
            </div>
            </CardContent>
        </Card>
        )}
    </div>
    </div>
)
}
