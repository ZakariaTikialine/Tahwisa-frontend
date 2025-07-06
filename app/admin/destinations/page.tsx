"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { MapPin, Users, Edit, Trash2, Plus, Building2, ExternalLink } from "lucide-react"
import api from "@/lib/api"
import type { Destination } from "@/lib/types"
import { toast } from "sonner"

export default function DestinationsAdminPage() {
const [destinations, setDestinations] = useState<Destination[]>([])
const [loading, setLoading] = useState(true)
const [dialogOpen, setDialogOpen] = useState(false)
const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
const [formData, setFormData] = useState({
    nom: "",
    localisation: "",
    capacité: "",
    type: "externe" as "externe" | "naftal_interne",
    description: "",
})

useEffect(() => {
    fetchDestinations()
}, [])

const fetchDestinations = async () => {
    try {
    const response = await api.get("/destinations")
    setDestinations(response.data)
    } catch (error) {
    toast.error("Failed to fetch destinations")
    console.error("Error fetching destinations:", error)
    } finally {
    setLoading(false)
    }
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nom || !formData.localisation || !formData.capacité || !formData.description) {
    toast.error("Please fill in all required fields")
    return
    }

    const capacité = Number.parseInt(formData.capacité)
    if (isNaN(capacité) || capacité <= 0) {
    toast.error("Capacity must be a positive number")
    return
    }

    try {
    const payload = {
        ...formData,
        capacité,
    }

    if (editingDestination) {
        await api.put(`/destinations/${editingDestination.id}`, payload)
        toast.success("Destination updated successfully")
    } else {
        await api.post("/destinations", payload)
        toast.success("Destination created successfully")
    }

    setDialogOpen(false)
    resetForm()
    fetchDestinations()
    } catch (error: any) {
    const message = error.response?.data?.message || "Operation failed"
    toast.error(message)
    }
}

const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
    nom: destination.nom,
    localisation: destination.localisation,
    capacité: destination.capacité.toString(),
    type: destination.type,
    description: destination.description,
    })
    setDialogOpen(true)
}

const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    try {
    await api.delete(`/destinations/${id}`)
    toast.success("Destination deleted successfully")
    fetchDestinations()
    } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete destination"
    toast.error(message)
    }
}

const resetForm = () => {
    setFormData({
    nom: "",
    localisation: "",
    capacité: "",
    type: "externe",
    description: "",
    })
    setEditingDestination(null)
}

const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
}

if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-600">Loading destinations...</div>
        </div>
        </div>
    </div>
    )
}

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <Navigation />

    <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Destinations Management</h1>
            <p className="text-slate-600">Manage travel destinations and their details</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
            </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>{editingDestination ? "Edit Destination" : "Add New Destination"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <Label htmlFor="nom">Name *</Label>
                <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Destination name"
                    required
                />
                </div>

                <div>
                <Label htmlFor="localisation">Location *</Label>
                <Input
                    id="localisation"
                    value={formData.localisation}
                    onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                    placeholder="City, Country"
                    required
                />
                </div>

                <div>
                <Label htmlFor="capacité">Capacity *</Label>
                <Input
                    id="capacité"
                    type="number"
                    min="1"
                    value={formData.capacité}
                    onChange={(e) => setFormData({ ...formData, capacité: e.target.value })}
                    placeholder="Maximum participants"
                    required
                />
                </div>

                <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                    value={formData.type}
                    onValueChange={(value: "externe" | "naftal_interne") => setFormData({ ...formData, type: value })}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="externe">External</SelectItem>
                    <SelectItem value="naftal_interne">Naftal Internal</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Destination description"
                    rows={3}
                    required
                />
                </div>

                <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    {editingDestination ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                </Button>
                </div>
            </form>
            </DialogContent>
        </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{destination.nom}</CardTitle>
                </div>
                <Badge variant={destination.type === "externe" ? "default" : "secondary"}>
                    {destination.type === "externe" ? (
                    <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        External
                    </>
                    ) : (
                    <>
                        <Building2 className="h-3 w-3 mr-1" />
                        Internal
                    </>
                    )}
                </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{destination.localisation}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">Capacity: {destination.capacité} people</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3">{destination.description}</p>

                <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(destination)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(destination.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            </CardContent>
            </Card>
        ))}
        </div>

        {destinations.length === 0 && (
        <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No destinations found</h3>
            <p className="text-slate-600 mb-4">Get started by creating your first destination.</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                <Plus className="h-4 w-4 mr-2" />
                Add First Destination
                </Button>
            </DialogTrigger>
            </Dialog>
        </div>
        )}
    </div>
    </div>
)
}
