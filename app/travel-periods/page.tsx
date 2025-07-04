"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Calendar, Clock, Users } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import type { Periode } from "@/lib/types"

export default function TravelPeriodsPage() {
const [periodes, setPeriodes] = useState<Periode[]>([])
const [loading, setLoading] = useState(true)
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
const [editingPeriode, setEditingPeriode] = useState<Periode | null>(null)
const [formData, setFormData] = useState({
    nom: "",
    date_debut_periode: "",
    date_fin_periode: "",
    date_limite_inscription: "",
    statut: "open" as "open" | "closed",
})

// Fetch all periods
const fetchPeriodes = async () => {
    try {
    const response = await api.get("/periodes")
    setPeriodes(response.data)
    } catch (error) {
    toast.error("Failed to fetch travel periods")
    } finally {
    setLoading(false)
    }
}

// Create new period
const createPeriode = async () => {
    try {
    const response = await api.post("/periodes", formData)
    toast.success("Period created successfully!")
    fetchPeriodes()
    setIsCreateDialogOpen(false)
    resetForm()
    } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create period"
    toast.error(errorMessage)
    }
}

// Update period
const updatePeriode = async () => {
    if (!editingPeriode) return

    try {
    const response = await api.put(`/periodes/${editingPeriode.id}`, formData)
    toast.success("Period updated successfully!")
    fetchPeriodes()
    setIsEditDialogOpen(false)
    setEditingPeriode(null)
    resetForm()
    } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update period"
    toast.error(errorMessage)
    }
}

// Delete period
const deletePeriode = async (id: number) => {
    if (!confirm("Are you sure you want to delete this travel period?")) return

    try {
    await api.delete(`/periodes/${id}`)
    toast.success("Period deleted successfully!")
    fetchPeriodes()
    } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete period"
    toast.error(errorMessage)
    }
}

const resetForm = () => {
    setFormData({
    nom: "",
    date_debut_periode: "",
    date_fin_periode: "",
    date_limite_inscription: "",
    statut: "open",
    })
}

const handleEdit = (periode: Periode) => {
    setEditingPeriode(periode)
    setFormData({
    nom: periode.nom,
    date_debut_periode: periode.date_debut_periode.split("T")[0],
    date_fin_periode: periode.date_fin_periode.split("T")[0],
    date_limite_inscription: periode.date_limite_inscription.split("T")[0],
    statut: periode.statut,
    })
    setIsEditDialogOpen(true)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    })
}

const isRegistrationOpen = (periode: Periode) => {
    const today = new Date()
    const deadline = new Date(periode.date_limite_inscription)
    return periode.statut === "open" && today <= deadline
}

useEffect(() => {
    fetchPeriodes()
}, [])

if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading travel periods...</p>
        </div>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-6">
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Periods</h1>
            <p className="text-gray-600">Manage travel periods and registration deadlines</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Period
            </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Create New Travel Period</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div>
                <Label htmlFor="nom">Period Name</Label>
                <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="e.g., Summer 2024"
                />
                </div>
                <div>
                <Label htmlFor="date_debut">Start Date</Label>
                <Input
                    id="date_debut"
                    type="date"
                    value={formData.date_debut_periode}
                    onChange={(e) => setFormData({ ...formData, date_debut_periode: e.target.value })}
                />
                </div>
                <div>
                <Label htmlFor="date_fin">End Date</Label>
                <Input
                    id="date_fin"
                    type="date"
                    value={formData.date_fin_periode}
                    onChange={(e) => setFormData({ ...formData, date_fin_periode: e.target.value })}
                />
                </div>
                <div>
                <Label htmlFor="date_limite">Registration Deadline</Label>
                <Input
                    id="date_limite"
                    type="date"
                    value={formData.date_limite_inscription}
                    onChange={(e) => setFormData({ ...formData, date_limite_inscription: e.target.value })}
                />
                </div>
                <div>
                <Label htmlFor="statut">Status</Label>
                <Select
                    value={formData.statut}
                    onValueChange={(value: "open" | "closed") => setFormData({ ...formData, statut: value })}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <Button onClick={createPeriode} className="w-full bg-yellow-600 hover:bg-yellow-700">
                Create Period
                </Button>
            </div>
            </DialogContent>
        </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600">Total Periods</p>
                <p className="text-3xl font-bold text-gray-900">{periodes.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600">Open Periods</p>
                <p className="text-3xl font-bold text-gray-900">
                    {periodes.filter((p) => p.statut === "open").length}
                </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
            </div>
            </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600">Active Registration</p>
                <p className="text-3xl font-bold text-gray-900">
                    {periodes.filter((p) => isRegistrationOpen(p)).length}
                </p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
            </div>
            </CardContent>
        </Card>
        </div>

        {/* Periods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periodes.map((periode) => (
            <Card key={periode.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-gray-900">{periode.nom}</CardTitle>
                <div className="flex gap-2">
                    <Badge
                    variant={periode.statut === "open" ? "default" : "secondary"}
                    className={
                        periode.statut === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                    >
                    {periode.statut}
                    </Badge>
                    {isRegistrationOpen(periode) && (
                    <Badge className="bg-yellow-100 text-yellow-800">Registration Open</Badge>
                    )}
                </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(periode.date_debut_periode)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(periode.date_fin_periode)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Registration Deadline:</span>
                    <span className="font-medium">{formatDate(periode.date_limite_inscription)}</span>
                </div>
                </div>

                <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(periode)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePeriode(periode.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
                </div>
            </CardContent>
            </Card>
        ))}
        </div>

        {periodes.length === 0 && (
        <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Travel Periods</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first travel period.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-yellow-600 hover:bg-yellow-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Period
            </Button>
        </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
            <DialogTitle>Edit Travel Period</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <div>
                <Label htmlFor="edit_nom">Period Name</Label>
                <Input
                id="edit_nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="e.g., Summer 2024"
                />
            </div>
            <div>
                <Label htmlFor="edit_date_debut">Start Date</Label>
                <Input
                id="edit_date_debut"
                type="date"
                value={formData.date_debut_periode}
                onChange={(e) => setFormData({ ...formData, date_debut_periode: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="edit_date_fin">End Date</Label>
                <Input
                id="edit_date_fin"
                type="date"
                value={formData.date_fin_periode}
                onChange={(e) => setFormData({ ...formData, date_fin_periode: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="edit_date_limite">Registration Deadline</Label>
                <Input
                id="edit_date_limite"
                type="date"
                value={formData.date_limite_inscription}
                onChange={(e) => setFormData({ ...formData, date_limite_inscription: e.target.value })}
                />
            </div>
            <div>
                <Label htmlFor="edit_statut">Status</Label>
                <Select
                value={formData.statut}
                onValueChange={(value: "open" | "closed") => setFormData({ ...formData, statut: value })}
                >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <Button onClick={updatePeriode} className="w-full bg-yellow-600 hover:bg-yellow-700">
                Update Period
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    </div>
    </div>
)
}
