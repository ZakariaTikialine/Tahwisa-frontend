"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Fuel, Plane, Trophy, Users, MapPin, Calendar, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Fuel className="h-7 w-7 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  Tahwisa
                </h1>
                <p className="text-sm text-slate-400">Naftal Rewards</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="text-white hover:text-yellow-400 hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push("/register")}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Tahwisa
              </span>{" "}
              with Naftal
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Your gateway to exclusive travel rewards and unforgettable experiences. Join thousands of employees
              discovering amazing destinations through our rewards program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-2 border-slate-300 hover:border-yellow-500 text-slate-700 hover:text-yellow-600 text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Tahwisa?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the best travel rewards program designed specifically for Naftal employees
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Exclusive Destinations</h3>
                <p className="text-slate-600">Access to premium travel destinations reserved for Naftal employees</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Reward System</h3>
                <p className="text-slate-600">Fair and transparent selection process for all travel opportunities</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Community</h3>
                <p className="text-slate-600">Connect with colleagues and share amazing travel experiences</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Booking</h3>
                <p className="text-slate-600">Simple registration process with real-time availability updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Explore the World?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join Tahwisa today and unlock exclusive travel opportunities designed for Naftal employees. Your next
              adventure is just a click away.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Join Tahwisa Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Fuel className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    Tahwisa
                  </h3>
                  <p className="text-sm text-slate-400">Naftal Rewards</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                Connecting Naftal employees with extraordinary travel experiences through our comprehensive rewards
                program.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-400 hover:text-yellow-400"
                    onClick={() => router.push("/login")}
                  >
                    Sign In
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-400 hover:text-yellow-400"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Naftal Headquarters
                </li>
                <li>support@tahwisa.naftal.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Tahwisa - Naftal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
