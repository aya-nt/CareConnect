"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Heart, Pill, Utensils, Home, Activity, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type AlertType = "emergency" | "medical" | "food" | "comfort" | null

export default function UserDashboard() {
  const router = useRouter()
  const [selectedAlert, setSelectedAlert] = useState<AlertType>(null)
  const [isSending, setIsSending] = useState(false)
  const [lastAlert, setLastAlert] = useState<{ type: string; time: string } | null>(null)

  const sendAlert = (type: AlertType) => {
    setSelectedAlert(type)
    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
      setLastAlert({
        type:
          type === "emergency"
            ? "Emergency"
            : type === "medical"
              ? "Medical Help"
              : type === "food"
                ? "Food Needed"
                : "Comfort Check",
        time: new Date().toLocaleTimeString(),
      })
      setTimeout(() => setSelectedAlert(null), 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Badge variant="outline" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Quick Alerts</h1>
          <p className="text-muted-foreground">Tap to send an alert to your family</p>
        </div>

        {lastAlert && (
          <Card className="p-4 bg-success/10 border-success/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-success/20 rounded-full">
                <Heart className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-success-foreground">Alert Sent!</p>
                <p className="text-sm text-muted-foreground">
                  {lastAlert.type} at {lastAlert.time}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          <Card
            className={`p-8 cursor-pointer transition-all ${
              selectedAlert === "emergency"
                ? "bg-destructive/10 border-destructive shadow-lg scale-105"
                : "hover:shadow-md active:scale-95"
            }`}
            onClick={() => sendAlert("emergency")}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className={`p-6 rounded-full ${selectedAlert === "emergency" ? "bg-destructive" : "bg-destructive/20"}`}
              >
                <AlertCircle
                  className={`w-12 h-12 ${selectedAlert === "emergency" ? "text-white" : "text-destructive"}`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Emergency</h3>
                <p className="text-muted-foreground mt-1">I need help right now</p>
              </div>
              {isSending && selectedAlert === "emergency" && (
                <Badge variant="secondary" className="animate-pulse">
                  Sending...
                </Badge>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedAlert === "medical"
                  ? "bg-primary/10 border-primary shadow-lg scale-105"
                  : "hover:shadow-md active:scale-95"
              }`}
              onClick={() => sendAlert("medical")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className={`p-4 rounded-full ${selectedAlert === "medical" ? "bg-primary" : "bg-primary/20"}`}>
                  <Pill className={`w-8 h-8 ${selectedAlert === "medical" ? "text-white" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Medical</h3>
                  <p className="text-xs text-muted-foreground mt-1">Need medication</p>
                </div>
                {isSending && selectedAlert === "medical" && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    Sending...
                  </Badge>
                )}
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedAlert === "food"
                  ? "bg-primary/10 border-primary shadow-lg scale-105"
                  : "hover:shadow-md active:scale-95"
              }`}
              onClick={() => sendAlert("food")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className={`p-4 rounded-full ${selectedAlert === "food" ? "bg-primary" : "bg-primary/20"}`}>
                  <Utensils className={`w-8 h-8 ${selectedAlert === "food" ? "text-white" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Food</h3>
                  <p className="text-xs text-muted-foreground mt-1">Hungry or thirsty</p>
                </div>
                {isSending && selectedAlert === "food" && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    Sending...
                  </Badge>
                )}
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedAlert === "comfort"
                  ? "bg-primary/10 border-primary shadow-lg scale-105"
                  : "hover:shadow-md active:scale-95"
              }`}
              onClick={() => sendAlert("comfort")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className={`p-4 rounded-full ${selectedAlert === "comfort" ? "bg-primary" : "bg-primary/20"}`}>
                  <Home className={`w-8 h-8 ${selectedAlert === "comfort" ? "text-white" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Comfort</h3>
                  <p className="text-xs text-muted-foreground mt-1">Need company</p>
                </div>
                {isSending && selectedAlert === "comfort" && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    Sending...
                  </Badge>
                )}
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-md active:scale-95 transition-all"
              onClick={() => router.push("/user/status")}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-4 rounded-full bg-success/20">
                  <Heart className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">I'm OK</h3>
                  <p className="text-xs text-muted-foreground mt-1">Send status</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/user/history")}>
          View Alert History
        </Button>
      </div>
    </div>
  )
}
