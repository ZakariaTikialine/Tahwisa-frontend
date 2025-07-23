"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Calendar, Edit, Trash2, Plus, Clock, Building2 } from "lucide-react"
import api from "@/lib/api"
import type { Session, Destination, Periode } from "@/lib/types"
import { toast } from "sonner"

export default function SessionsAdminPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [periodes, setPeriodes] = useState<Periode[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    date_debut: "",
    date_fin: "",
    destination_id: "",
    periode_id: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [sessionsRes, destinationsRes, periodesRes] = await Promise.all([
        api.get("/sessions"),
        api.get("/destinations"),
        api.get("/periodes"),
      ])

      setSessions(sessionsRes.data)
      setDestinations(destinationsRes.data)
      setPeriodes(periodesRes.data)
    } catch (error) {
      toast.error("Failed to fetch data")
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nom ||
      !formData.date_debut ||
      !formData.date_fin ||
      !formData.destination_id ||
      !formData.periode_id
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    if (new Date(formData.date_debut) >= new Date(formData.date_fin)) {
      toast.error("Start date must be before end date")
      return
    }

    try {
      const payload = {
        ...formData,
        destination_id: Number.parseInt(formData.destination_id),
        periode_id: Number.parseInt(formData.periode_id),
      }

      if (editingSession) {
        await api.put(`/sessions/${editingSession.id}`, payload)
        toast.success("Session updated successfully")
      } else {
        await api.post("/sessions", payload)
        toast.success("Session created successfully")
      }

      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error: any) {
      const message = error.response?.data?.message || "Operation failed"
      toast.error(message)
    }
  }

  const handleEdit = (session: Session) => {
    setEditingSession(session)
    setFormData({
      nom: session.nom,
      date_debut: session.date_debut.split("T")[0],
      date_fin: session.date_fin.split("T")[0],
      destination_id: session.destination_id.toString(),
      periode_id: session.periode_id.toString(),
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      await api.delete(`/sessions/${id}`)
      toast.success("Session deleted successfully")
      fetchData()
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete session"
      toast.error(message)
    }
  }

  const resetForm = () => {
    setFormData({
      nom: "",
      date_debut: "",
      date_fin: "",
      destination_id: "",
      periode_id: "",
    })
    setEditingSession(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSessionStatus = (session: Session) => {
    const now = new Date()
    const startDate = new Date(session.date_debut)
    const endDate = new Date(session.date_fin)

    if (now < startDate) return { status: "upcoming", color: "bg-blue-100 text-blue-800", label: "Upcoming" }
    if (now >= startDate && now <= endDate) return { status: "active", color: "bg-green-100 text-green-800", label: "Active" }
    return { status: "completed", color: "bg-gray-100 text-gray-800", label: "Completed" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-600">Loading sessions...</div>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sessions Management</h1>
            <p className="text-slate-600">Manage travel sessions and schedules</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  {editingSession ? "Edit Session" : "Add New Session"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1">
                      Session Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="e.g. Summer 2024 Session"
                      className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="destination_id" className="block text-sm font-medium text-slate-700 mb-1">
                      Destination <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.destination_id}
                      onValueChange={(value) => setFormData({ ...formData, destination_id: value })}
                    >
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500 h-10 border border-slate-300 rounded-md bg-white px-3 py-2 text-sm shadow-sm">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-md shadow-lg border border-slate-200">
                        {destinations.map((dest) => (
                          <SelectItem 
                            key={dest.id} 
                            value={dest.id.toString()}
                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-slate-800"
                          >
                            {dest.nom} - {dest.localisation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="periode_id" className="block text-sm font-medium text-slate-700 mb-1">
                      Period <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.periode_id}
                      onValueChange={(value) => setFormData({ ...formData, periode_id: value })}
                    >
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500 h-10 border border-slate-300 rounded-md bg-white px-3 py-2 text-sm shadow-sm">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-md shadow-lg border border-slate-200">
                        {periodes.map((periode) => (
                          <SelectItem 
                            key={periode.id} 
                            value={periode.id.toString()}
                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-slate-800"
                          >
                            {periode.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_debut" className="block text-sm font-medium text-slate-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={formData.date_debut}
                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                        className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="date_fin" className="block text-sm font-medium text-slate-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={formData.date_fin}
                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                        className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="cursor-pointer flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {editingSession ? "Update Session" : "Create Session"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const sessionStatus = getSessionStatus(session)
            return (
              <Card key={session.id} className="hover:shadow-lg transition-shadow border border-slate-200 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-400">{session.nom}</CardTitle>
                    <Badge className={`${sessionStatus.color} rounded-full px-3 py-1 text-xs font-medium`}>
                      {sessionStatus.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">{session.destination_nom}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">{session.periode_nom}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">
                      {formatDate(session.date_debut)} - {formatDate(session.date_fin)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(session)}
                      className="cursor-pointer flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(session.id)}
                      className="hover:bg-red-600"
                    >
                      <Trash2 className="cursor-pointer h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions found</h3>
            <p className="text-slate-600 mb-4">Get started by creating your first session.</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Session
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}