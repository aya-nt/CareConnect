"use client"
import { Card } from "@/components/ui/card"
import { Users, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-balance text-foreground">CareConnect</h1>
          <p className="text-lg text-muted-foreground text-pretty">Emergency alert system for peace of mind</p>
        </div>

        <div className="space-y-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <button onClick={() => router.push("/auth/signin")} className="w-full text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-card-foreground">Sign In</h2>
                  <p className="text-sm text-muted-foreground">Access your account</p>
                </div>
              </div>
            </button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <button onClick={() => router.push("/auth/signup")} className="w-full text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-xl">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-card-foreground">Sign Up</h2>
                  <p className="text-sm text-muted-foreground">Create new account</p>
                </div>
              </div>
            </button>
          </Card>
        </div>

        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">Stay connected. Stay safe. Stay supported.</p>
        </div>
      </div>
    </div>
  )
}
