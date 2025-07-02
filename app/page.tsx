"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Fuel,
  Plane,
  Trophy,
  ArrowRight,
  Menu,
  X,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Calendar,
  Gift,
  Users,
  Award,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const features = [
    {
      icon: Plane,
      title: "Amazing Destinations",
      description: "Win trips to exotic locations around the world. From tropical beaches to mountain adventures.",
      color: "from-yellow-500 to-yellow-400",
    },
    {
      icon: Trophy,
      title: "Fair Winner Selection",
      description: "Transparent and fair selection process ensures every employee has an equal chance to win.",
      color: "from-sky-500 to-sky-400",
    },
    {
      icon: Calendar,
      title: "Easy Registration",
      description: "Simple and quick registration process. Sign up for multiple trips with just a few clicks.",
      color: "from-slate-700 to-slate-800",
    },
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Special rewards and bonuses for Naftal employees. More than just trips - complete experiences.",
      color: "from-yellow-500 to-yellow-400",
    },
    {
      icon: Users,
      title: "Team Building",
      description: "Some trips include team-building activities and opportunities to connect with colleagues.",
      color: "from-sky-500 to-sky-400",
    },
    {
      icon: Camera,
      title: "Memorable Experiences",
      description: "Create lasting memories with professionally organized trips and unique experiences.",
      color: "from-slate-700 to-slate-800",
    },
  ]

  const recentWinners = [
    {
      name: "Ahmed Benali",
      department: "Operations",
      trip: "Maldives Beach Resort",
      date: "December 2024",
      image: "AB",
    },
    {
      name: "Fatima Khelil",
      department: "Engineering",
      trip: "Swiss Alps Adventure",
      date: "November 2024",
      image: "FK",
    },
    {
      name: "Youssef Mansouri",
      department: "Sales",
      trip: "Dubai City Break",
      date: "October 2024",
      image: "YM",
    },
  ]

  const testimonials = [
    {
      name: "Amina Boudjema",
      department: "Human Resources",
      trip: "Bali Paradise",
      content:
        "The trip to Bali was absolutely incredible! Everything was perfectly organized. Thank you Naftal for this amazing opportunity.",
      rating: 5,
    },
    {
      name: "Karim Zeroual",
      department: "Technical Services",
      trip: "Paris & London Tour",
      content:
        "I never thought I'd win, but here I am after an amazing European adventure. The registration process was so simple!",
      rating: 5,
    },
    {
      name: "Leila Hamidi",
      department: "Finance",
      trip: "Turkish Riviera",
      content:
        "Outstanding experience from start to finish. The team at Naftal really takes care of their employees. Highly recommend participating!",
      rating: 5,
    },
  ]

  const upcomingTrips = [
    {
      destination: "Thailand Beach Resort",
      duration: "7 Days",
      deadline: "Jan 15, 2025",
      spots: "5 Winners",
      type: "Tropical",
    },
    {
      destination: "Morocco Imperial Cities",
      duration: "5 Days",
      deadline: "Feb 10, 2025",
      spots: "3 Winners",
      type: "Cultural",
    },
    {
      destination: "Spain & Portugal",
      duration: "10 Days",
      deadline: "Mar 5, 2025",
      spots: "4 Winners",
      type: "Adventure",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-sky-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-sky-500/10"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Fuel className="h-6 w-6 sm:h-7 sm:w-7 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  Tahwisa
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">Naftal Employee Rewards</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#trips" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Available Trips
              </a>
              <a href="#winners" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Recent Winners
              </a>
              <a href="#how-it-works" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                How It Works
              </a>
              <a href="#contact" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Contact
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="bg-transparent border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200"
              >
                Employee Login
              </Button>
              <Button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-semibold"
              >
                Register Now
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
            <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-b-lg">
              <div className="px-4 py-6 space-y-4">
                <nav className="space-y-4">
                  <a
                    href="#trips"
                    className="block text-slate-300 hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Available Trips
                  </a>
                  <a
                    href="#winners"
                    className="block text-slate-300 hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Recent Winners
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-slate-300 hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  <a
                    href="#contact"
                    className="block text-slate-300 hover:text-yellow-400 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                </nav>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full bg-transparent border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20"
                  >
                    Employee Login
                  </Button>
                  <Button
                    onClick={() => router.push("/register")}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Fuel className="h-8 w-8 text-slate-900" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Welcome to{" "}
              </span>
              <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Tahwisa
              </span>
            </h1>

            <div className="mb-8 sm:mb-12">
              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 mb-4">
                <span className="font-semibold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                  Naftal Employee Rewards Program
                </span>
              </p>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Register for amazing trips around the world and win incredible experiences.
                <span className="font-semibold text-yellow-600"> Your next adventure awaits!</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-bold text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                Register for Trips
                <Plane className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full sm:w-auto border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-semibold text-lg px-8 py-4"
              >
                Employee Login
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  150+
                </div>
                <p className="text-slate-600 font-medium">Happy Winners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent">
                  25+
                </div>
                <p className="text-slate-600 font-medium">Destinations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                  5★
                </div>
                <p className="text-slate-600 font-medium">Trip Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Trips Section */}
      <section id="trips" className="py-16 sm:py-20 lg:py-24 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Available Trips</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Register now for these amazing destinations. Limited spots available!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {upcomingTrips.map((trip, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-sky-400 to-sky-500 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-slate-900 font-semibold">{trip.type}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{trip.destination}</h3>
                    <p className="text-sky-100">{trip.duration}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Registration Deadline:</span>
                      <span className="font-semibold text-slate-900">{trip.deadline}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Available Spots:</span>
                      <span className="font-semibold text-yellow-600">{trip.spots}</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300"
                      onClick={() => router.push("/register")}
                    >
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners Section */}
      <section id="winners" className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Recent Winners</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Congratulations to our latest trip winners! Your adventure could be next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recentWinners.map((winner, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-yellow-50/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-slate-900">{winner.image}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{winner.name}</h3>
                  <p className="text-slate-600 mb-1">{winner.department}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-600">{winner.trip}</span>
                  </div>
                  <p className="text-sm text-slate-500">{winner.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">How It Works</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Simple steps to register and win amazing trips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Winner Stories</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Hear from our employees who won amazing trips through Tahwisa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.department}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Plane className="h-4 w-4 text-sky-500" />
                      <p className="text-sm text-sky-600 font-medium">{testimonial.trip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-sky-500/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Trophy className="h-12 w-12 text-yellow-400" />
            <Plane className="h-12 w-12 text-sky-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Ready to Win Your Next Trip?</h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join hundreds of Naftal employees who have already won amazing trips. Register now and your dream
            destination could be waiting for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 hover:from-yellow-400 hover:to-yellow-300 font-bold text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Register for Trips
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-2 border-sky-400/50 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200 font-semibold text-lg px-8 py-4"
            >
              Employee Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Fuel className="h-7 w-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    Tahwisa
                  </h3>
                  <p className="text-slate-400">Naftal Employee Rewards</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                Rewarding our dedicated Naftal employees with unforgettable travel experiences. Your hard work deserves
                amazing adventures.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 sm:mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#trips" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    Available Trips
                  </a>
                </li>
                <li>
                  <a href="#winners" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    Recent Winners
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-yellow-400 transition-colors">
                    Employee Guidelines
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 sm:mb-6">Contact HR</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-slate-300">hr@naftal.dz</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sky-400 flex-shrink-0" />
                  <span className="text-slate-300">+213 21 XX XX XX</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Naftal Headquarters
                    <br />
                    Algiers, Algeria
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © 2024 Naftal - Tahwisa Employee Rewards Program. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Award className="h-4 w-4 text-yellow-400" />
                <span>For Naftal Employees Only</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
