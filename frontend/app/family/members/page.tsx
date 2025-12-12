"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Plus, Copy, Check, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const mockDisabledPerson = {
  id: 1,
  name: "Sarah Johnson",
  condition: "Mobility impairment",
  joinedDate: "Jan 15, 2024",
  totalAlerts: 24,
}

const mockCaregivers = [
  {
    id: 1,
    name: "John Doe",
    relationship: "Father",
    role: "Primary Caregiver",
    joinedDate: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Mary Doe",
    relationship: "Mother",
    role: "Caregiver",
    joinedDate: "Jan 16, 2024",
  },
  {
    id: 3,
    name: "Alex Smith",
    relationship: "Friend",
    role: "Emergency Contact",
    joinedDate: "Feb 2, 2024",
  },
]

const mockGroupId = "DPA-2024-8X9K2M"

export default function FamilyMembers() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyGroupId = () => {
    navigator.clipboard.writeText(mockGroupId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/family/dashboard")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Caregiver to Group</DialogTitle>
                <DialogDescription>
                  Share this Group ID with family members or friends to invite them to help monitor{" "}
                  {mockDisabledPerson.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="groupId">Group ID</Label>
                  <div className="flex gap-2">
                    <Input id="groupId" value={mockGroupId} readOnly className="font-mono text-lg" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyGroupId}
                      className="shrink-0 bg-transparent"
                    >
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Other caregivers can use this ID to join your monitoring group
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-foreground">How it works:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Copy the Group ID above</li>
                    <li>Share it with trusted family members or friends</li>
                    <li>They can join using this ID in their app</li>
                    <li>All group members will receive alerts</li>
                  </ol>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Caregiving Group</h1>
          <p className="text-muted-foreground">Manage caregivers monitoring {mockDisabledPerson.name}</p>
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Monitoring</h2>
          </div>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {mockDisabledPerson.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{mockDisabledPerson.name}</h3>
              <p className="text-sm text-muted-foreground">{mockDisabledPerson.condition}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium text-foreground">{mockDisabledPerson.joinedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Alerts</p>
                  <p className="text-sm font-medium text-foreground">{mockDisabledPerson.totalAlerts} this month</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1">Caregivers ({mockCaregivers.length})</h2>
          {mockCaregivers.map((caregiver) => (
            <Card key={caregiver.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {caregiver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{caregiver.name}</h3>
                      <p className="text-sm text-muted-foreground">{caregiver.relationship}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {caregiver.role}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Joined {caregiver.joinedDate}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
