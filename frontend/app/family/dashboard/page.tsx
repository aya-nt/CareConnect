"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Bell, Heart, AlertCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const mockAlerts = [
  {
    id: 1,
    name: "John Doe",
    type: "status",
    message: "Feeling Great",
    time: "2 hours ago",
    urgent: false,
  },
  {
    id: 2,
    name: "John Doe",
    type: "emergency",
    message: "Emergency Alert",
    time: "Yesterday, 3:45 PM",
    urgent: false,
    responded: true,
  },
]

export default function FamilyDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Family Dashboard</h1>
          <p className="text-muted-foreground">Monitor your loved ones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Total Alerts</span>
              </div>
              <p className="text-3xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Urgent</span>
              </div>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-xs text-success">All clear</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Response Time</span>
              </div>
              <p className="text-3xl font-bold text-foreground">3m</p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Alerts</h2>
            <Button variant="outline" size="sm" onClick={() => router.push("/family/alerts")}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <Card key={alert.id} className="p-4 bg-card border">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${alert.type === "emergency" ? "bg-destructive/20" : "bg-success/20"}`}
                  >
                    {alert.type === "emergency" ? (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <Heart className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-foreground">{alert.name}</h3>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      {alert.urgent && (
                        <Badge variant="destructive" className="shrink-0">
                          Urgent
                        </Badge>
                      )}
                      {alert.responded && (
                        <Badge variant="secondary" className="shrink-0">
                          Responded
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            className="w-full h-14 bg-transparent"
            onClick={() => router.push("/family/members")}
          >
            Manage Family Members
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 bg-transparent"
            onClick={() => router.push("/family/settings")}
          >
            Notification Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
