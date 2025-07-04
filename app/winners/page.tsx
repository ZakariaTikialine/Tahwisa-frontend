"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, Shuffle, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from "sonner"
import api from "@/lib/api"
import type { ResultatSelection, Session } from "@/lib/types"

export default function Winners() {
const [selections, setSelections] = useState<ResultatSelection[]>([])
const [sessions, setSessions] = useState<Session[]>([])
const [selectedSession, setSelectedSession] = useState<number | null>(null)
const [loading, setLoading] = useState(true)
const [generating, setGenerating] = useState(false)

// Fetch all sessions
const fetchSessions = async () => {
    try {
    const response = await api.get("/sessions")
    setSessions(response.data)
    if (response.data.length > 0 && !selectedSession) {
        setSelectedSession(response.data[0].id)
    }
    } catch (error) {
    console.error("Error fetching sessions:", error)
    toast.error("Failed to load sessions")
    }
}

// Fetch selection results for a session
const fetchSelectionResults = async (sessionId: number) => {
    try {
    const response = await api.get(`/resultat-selections/session/${sessionId}`)
    setSelections(response.data)
    } catch (error: any) {
    if (error.response?.status === 404) {
        setSelections([])
    } else {
        console.error("Error fetching selection results:", error)
        setSelections([])
    }
    }
}

// Generate selection for a session
const generateSelection = async (sessionId: number) => {
    setGenerating(true)
    try {
    const response = await api.post(`/resultat-selections/generate/${sessionId}`)

    if (response.status === 201) {
        toast.success("Selection generated successfully!")
        await fetchSelectionResults(sessionId)
    }
    } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to generate selection"
    toast.error(errorMessage)
    } finally {
    setGenerating(false)
    }
}

useEffect(() => {
    const loadData = async () => {
    setLoading(true)
    await fetchSessions()
    setLoading(false)
    }
    loadData()
}, [])

useEffect(() => {
    if (selectedSession) {
    fetchSelectionResults(selectedSession)
    }
}, [selectedSession])

const officiels = selections.filter((s) => s.type_selection === "officiel").sort((a, b) => a.ordre_priorite - b.ordre_priorite)
const suppleants = selections.filter((s) => s.type_selection === "suppléant").sort((a, b) => a.ordre_priorite - b.ordre_priorite)
const selectedSessionData = sessions.find((s) => s.id === selectedSession)

if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading winners...</p>
        </div>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-4">
    <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold text-gray-900">Selection Results</h1>
            <Trophy className="h-8 w-8 text-yellow-600" />
        </div>
        <p className="text-lg text-gray-600">View and manage travel selection winners</p>
        </div>

        {/* Session Selection */}
        <Card className="border-2 border-yellow-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-blue-100">
            <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Session
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
            {sessions.map((session) => (
                <Button
                key={session.id}
                variant={selectedSession === session.id ? "default" : "outline"}
                onClick={() => setSelectedSession(session.id)}
                className={
                    selectedSession === session.id
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                }
                >
                {session.nom}
                </Button>
            ))}
            </div>

            {selectedSessionData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">{selectedSessionData.nom}</h3>
                <div className="text-blue-700 space-y-1">
                <p>
                    <strong>Destination:</strong> {selectedSessionData.destination_nom || "N/A"}
                </p>
                <p>
                    <strong>Period:</strong> {selectedSessionData.periode_nom || "N/A"}
                </p>
                <p>
                    <strong>Duration:</strong> {new Date(selectedSessionData.date_debut).toLocaleDateString()} -{" "}
                    {new Date(selectedSessionData.date_fin).toLocaleDateString()}
                </p>
                </div>
            </div>
            )}
        </CardContent>
        </Card>

        {/* Generate Selection Button */}
        {selectedSession && (
        <div className="text-center">
            <Button
            onClick={() => generateSelection(selectedSession)}
            disabled={generating}
            className="bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
            {generating ? (
                <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
                </>
            ) : (
                <>
                <Shuffle className="h-5 w-5 mr-2" />
                Generate New Selection
                </>
            )}
            </Button>
        </div>
        )}

        {/* Selection Results */}
        {selectedSession && (
        <>
            {selections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
                {/* Official Winners */}
                <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Official Winners ({officiels.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                    {officiels.map((selection, index) => (
                        <div
                        key={selection.id}
                        className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200"
                        >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold text-green-900">
                            {selection.employee_prenom} {selection.employee_nom}
                            </h3>
                            <p className="text-sm text-green-700">Priority: {selection.ordre_priorite}</p>
                            <p className="text-xs text-green-600">
                            Selected: {new Date(selection.date_selection).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge className="bg-green-600 text-white">Official</Badge>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>

                {/* Substitute Winners */}
                <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-sky-100">
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Users className="h-5 w-5" />
                    Substitutes ({suppleants.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                    {suppleants.map((selection, index) => (
                        <div
                        key={selection.id}
                        className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold text-blue-900">
                            {selection.employee_prenom} {selection.employee_nom}
                            </h3>
                            <p className="text-sm text-blue-700">Priority: {selection.ordre_priorite}</p>
                            <p className="text-xs text-blue-600">
                            Selected: {new Date(selection.date_selection).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge className="bg-blue-600 text-white">Substitute</Badge>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </div>
            ) : (
            <Card className="border-2 border-gray-200 shadow-lg">
                <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Selection Results</h3>
                <p className="text-gray-500 mb-6">No winners have been selected for this session yet.</p>
                <Button
                    onClick={() => selectedSession && generateSelection(selectedSession)}
                    disabled={generating}
                    className="bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-700 hover:to-blue-700 text-white"
                >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Selection
                </Button>
                </CardContent>
            </Card>
            )}
        </>
        )}

        {/* Selection Info */}
        {selections.length > 0 && (
        <Card className="border-2 border-yellow-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-100 to-blue-100">
            <CardTitle>Selection Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{officiels.length}</div>
                <div className="text-sm text-gray-600">Official Winners</div>
                </div>
                <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{suppleants.length}</div>
                <div className="text-sm text-gray-600">Substitutes</div>
                </div>
                <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-600">{selections.length}</div>
                <div className="text-sm text-gray-600">Total Selected</div>
                </div>
            </div>
            {selections.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                    Selection generated on: {new Date(selections[0].date_selection).toLocaleString()}
                </p>
                </div>
            )}
            </CardContent>
        </Card>
        )}
    </div>
    </div>
)
}
