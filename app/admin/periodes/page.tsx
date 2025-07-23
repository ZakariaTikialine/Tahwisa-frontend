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
import { Calendar, Edit, Trash2, Plus, Clock, AlertCircle } from "lucide-react"
import api from "@/lib/api"
import type { Periode } from "@/lib/types"
import { toast } from "sonner"

export default function PeriodesAdminPage() {
  const [periodes, setPeriodes] = useState<Periode[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPeriode, setEditingPeriode] = useState<Periode | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    date_debut_periode: "",
    date_fin_periode: "",
    date_limite_inscription: "",
    statut: "open" as "open" | "closed",
  })

  useEffect(() => {
    fetchPeriodes()
  }, [])

  const fetchPeriodes = async () => {
    try {
      const response = await api.get("/periodes")
      setPeriodes(response.data)
    } catch (error) {
      toast.error("Failed to fetch periods")
      console.error("Error fetching periods:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nom ||
      !formData.date_debut_periode ||
      !formData.date_fin_periode ||
      !formData.date_limite_inscription
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    if (new Date(formData.date_debut_periode) >= new Date(formData.date_fin_periode)) {
      toast.error("Start date must be before end date")
      return
    }

    if (new Date(formData.date_limite_inscription) >= new Date(formData.date_debut_periode)) {
      toast.error("Registration deadline must be before period start date")
      return
    }

    try {
      if (editingPeriode) {
        await api.put(`/periodes/${editingPeriode.id}`, formData)
        toast.success("Period updated successfully")
      } else {
        await api.post("/periodes", formData)
        toast.success("Period created successfully")
      }

      setDialogOpen(false)
      resetForm()
      fetchPeriodes()
    } catch (error: any) {
      const message = error.response?.data?.message || "Operation failed"
      toast.error(message)
    }
  }

  const handleEdit = (periode: Periode) => {
    setEditingPeriode(periode)
    setFormData({
      nom: periode.nom,
      date_debut_periode: periode.date_debut_periode.split("T")[0] || "",
      date_fin_periode: periode.date_fin_periode.split("T")[0] || "",
      date_limite_inscription: periode.date_limite_inscription.split("T")[0] || "",
      statut: periode.statut || "open",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this period?")) return

    try {
      await api.delete(`/periodes/${id}`)
      toast.success("Period deleted successfully")
      fetchPeriodes()
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete period"
      toast.error(message)
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
    setEditingPeriode(null)
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

  const getPeriodeStatus = (periode: Periode) => {
    const now = new Date()
    const startDate = new Date(periode.date_debut_periode)
    const endDate = new Date(periode.date_fin_periode)
    const deadline = new Date(periode.date_limite_inscription)

    if (periode.statut === "closed") {
      return { status: "closed", color: "bg-red-100 text-red-800", label: "Closed" }
    }

    if (now > deadline) {
      return { status: "expired", color: "bg-gray-100 text-gray-800", label: "Registration Expired" }
    }

    if (now < startDate) {
      return { status: "upcoming", color: "bg-blue-100 text-blue-800", label: "Upcoming" }
    }

    if (now >= startDate && now <= endDate) {
      return { status: "active", color: "bg-green-100 text-green-800", label: "Active" }
    }

    return { status: "ended", color: "bg-gray-100 text-gray-800", label: "Ended" }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-600">Loading periods...</div>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Periods Management</h1>
            <p className="text-slate-600">Manage travel periods and registration deadlines</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  {editingPeriode ? "Edit Period" : "Add New Period"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1">
                      Period Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="e.g. Summer 2024"
                      className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_debut_periode" className="block text-sm font-medium text-slate-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_debut_periode"
                        type="date"
                        value={formData.date_debut_periode}
                        onChange={(e) => setFormData({ ...formData, date_debut_periode: e.target.value })}
                        className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="date_fin_periode" className="block text-sm font-medium text-slate-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_fin_periode"
                        type="date"
                        value={formData.date_fin_periode}
                        onChange={(e) => setFormData({ ...formData, date_fin_periode: e.target.value })}
                        className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date_limite_inscription" className="block text-sm font-medium text-slate-700 mb-1">
                      Registration Deadline <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date_limite_inscription"
                      type="date"
                      value={formData.date_limite_inscription}
                      onChange={(e) => setFormData({ ...formData, date_limite_inscription: e.target.value })}
                      className="focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="statut" className="block text-sm font-medium text-slate-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.statut}
                      onValueChange={(value: "open" | "closed") => setFormData({ ...formData, statut: value })}
                    >
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500 h-10 border text-black border-slate-300 rounded-md bg-white px-3 py-2 text-sm shadow-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-md shadow-lg border border-slate-200">
                        <SelectItem 
                          value="open" 
                          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-black"
                        >
                          Open
                        </SelectItem>
                        <SelectItem 
                          value="closed" 
                          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-black"
                        >
                          Closed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="cursor-pointer flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {editingPeriode ? "Update Period" : "Create Period"}
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
          {periodes.map((periode) => {
            const periodeStatus = getPeriodeStatus(periode)
            const daysUntilDeadline = getDaysUntilDeadline(periode.date_limite_inscription)
            const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

            return (
              <Card key={periode.id} className="hover:shadow-lg transition-shadow border border-slate-200 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-400">{periode.nom}</CardTitle>
                    <Badge className={`${periodeStatus.color} rounded-full px-3 py-1 text-xs font-medium`}>
                      {periodeStatus.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">
                      {formatDate(periode.date_debut_periode)} - {formatDate(periode.date_fin_periode)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">Deadline: {formatDate(periode.date_limite_inscription)}</span>
                  </div>

                  {isUrgent && (
                    <div className="flex items-center gap-2 text-amber-700 bg-amber-100/80 p-2 rounded-lg border border-amber-200">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {daysUntilDeadline} day{daysUntilDeadline !== 1 ? "s" : ""} left!
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="text-sm text-slate-500 mb-1">Duration</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {Math.ceil(
                        (new Date(periode.date_fin_periode).getTime() -
                          new Date(periode.date_debut_periode).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(periode)}
                      className="cursor-pointer flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(periode.id)}
                      className="cursor-pointer hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {periodes.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No periods found</h3>
            <p className="text-slate-600 mb-4">Get started by creating your first period.</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Period
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}