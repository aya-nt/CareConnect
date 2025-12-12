"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FamilySettings() {
  const router = useRouter()

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
          <h1 className="text-3xl font-bold text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground">Customize how you receive alerts</p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Alert Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emergency" className="text-base">
                    Emergency Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">High priority notifications</p>
                </div>
                <Switch id="emergency" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="medical" className="text-base">
                    Medical Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">Medication and health needs</p>
                </div>
                <Switch id="medical" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status" className="text-base">
                    Status Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">Daily check-ins</p>
                </div>
                <Switch id="status" defaultChecked />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Notification Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push" className="text-base">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Mobile and desktop alerts</p>
                </div>
                <Switch id="push" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms" className="text-base">
                    SMS Messages
                  </Label>
                  <p className="text-sm text-muted-foreground">Text message alerts</p>
                </div>
                <Switch id="sms" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Daily summary emails</p>
                </div>
                <Switch id="email" />
              </div>
            </div>
          </div>
        </Card>

        <Button className="w-full">Save Settings</Button>
      </div>
    </div>
  )
}
