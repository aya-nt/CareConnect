"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, AlertCircle, Pill, Utensils, Home, Heart, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const mockAlerts = [
  {
    id: 1,
    name: "John Doe",
    type: "status",
    message: "Feeling Great",
    time: "2 hours ago",
    status: "delivered",
  },
  {
    id: 2,
    name: "John Doe",
    type: "emergency",
    message: "Emergency Alert",
    time: "Yesterday, 3:45 PM",
    status: "responded",
  },
  {
    id: 3,
    name: "John Doe",
    type: "medical",
    message: "Medical Help Needed",
    time: "Yesterday, 11:20 AM",
    status: "responded",
  },
  {
    id: 4,
    name: "John Doe",
    type: "food",
    message: "Food Request",
    time: "2 days ago",
    status: "delivered",
  },
  {
    id: 5,
    name: "John Doe",
    type: "comfort",
    message: "Comfort Check",
    time: "2 days ago",
    status: "delivered",
  },
]

export default function FamilyAlerts() {
  const router = useRouter()

  const getIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "medical":
        return <Pill className="w-5 h-5 text-primary" />
      case "food":
        return <Utensils className="w-5 h-5 text-primary" />
      case "comfort":
        return <Home className="w-5 h-5 text-primary" />
      case "status":
        return <Heart className="w-5 h-5 text-success" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/family/dashboard")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">All Alerts</h1>
          <p className="text-muted-foreground">Complete alert history</p>
        </div>

        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    alert.type === "emergency"
                      ? "bg-destructive/20"
                      : alert.type === "status"
                        ? "bg-success/20"
                        : "bg-primary/20"
                  }`}
                >
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.name}</h3>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge
                      variant={alert.status === "responded" ? "default" : "secondary"}
                      className="shrink-0 text-xs"
                    >
                      {alert.status === "responded" ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Responded
                        </>
                      ) : (
                        "Delivered"
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
