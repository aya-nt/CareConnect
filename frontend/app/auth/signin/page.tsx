"use client"
import { useState } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock sign in logic - in real app, validate credentials and check user type
    // For now, redirect based on mock user type
    if (email.includes("care")) {
      router.push("/family/dashboard")
    } else {
      router.push("/user/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <button onClick={() => router.push("/")} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Sign In
              </Button>
            </form>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => router.push("/auth/signup")} className="text-primary font-medium hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
