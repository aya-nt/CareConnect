"use client"
import { useState } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Shield, Users, Copy, Check, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

type UserType = "disabled" | "caregiver" | null
type DisabilityType = "blind" | "deaf" | "paralyzed" | "aged" | null

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<"type" | "details" | "success">("type")
  const [userType, setUserType] = useState<UserType>(null)
  const [disabilityType, setDisabilityType] = useState<DisabilityType>(null)
  const [groupId, setGroupId] = useState("")
  const [generatedGroupId, setGeneratedGroupId] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const generateGroupId = () => {
    return `GROUP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  }

  const handleTypeSelection = (type: UserType) => {
    setUserType(type)
    setStep("details")
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType === "disabled") {
      const newGroupId = generateGroupId()
      setGeneratedGroupId(newGroupId)
      setStep("success")
    } else {
      router.push("/family/dashboard")
    }
  }

  const copyGroupId = async () => {
    await navigator.clipboard.writeText(generatedGroupId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinue = () => {
    router.push("/user/dashboard")
  }

  const handleBack = () => {
    router.push("/")
  }

  if (step === "type") {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-background">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
              <p className="text-muted-foreground">Choose your account type</p>
            </div>

            <div className="space-y-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <button onClick={() => handleTypeSelection("disabled")} className="w-full text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-card-foreground">I need help</h2>
                      <p className="text-sm text-muted-foreground">Get support from caregivers</p>
                    </div>
                  </div>
                </button>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <button onClick={() => handleTypeSelection("caregiver")} className="w-full text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-success/10 rounded-xl">
                      <Users className="w-8 h-8 text-success" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-card-foreground">I'm a caregiver</h2>
                      <p className="text-sm text-muted-foreground">Join a care group</p>
                    </div>
                  </div>
                </button>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "success" && userType === "disabled") {
    return (
      <div className="min-h-screen flex flex-col p-6 bg-background">
        <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Account Created!</h1>
              <p className="text-muted-foreground">Your care group is ready</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Group ID</label>
                <div className="flex gap-2">
                  <Input value={generatedGroupId} readOnly className="h-12 text-base font-mono font-semibold" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyGroupId}
                    className="h-12 w-12 shrink-0 bg-transparent"
                  >
                    {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this ID with family members or friends so they can join your care group
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <UserPlus className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Invite Caregivers</p>
                    <p className="text-xs text-muted-foreground">
                      Send this Group ID to family members. They can create a caregiver account and use this ID to join
                      your care group and receive alerts.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Button onClick={handleContinue} className="w-full h-12 text-base font-semibold">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <button onClick={() => setStep("type")} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {userType === "disabled" ? "Person Needing Help" : "Caregiver"} Account
            </h1>
            <p className="text-muted-foreground">Complete your registration</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              {userType === "disabled" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Disability Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "blind", label: "Blind" },
                      { value: "deaf", label: "Deaf" },
                      { value: "paralyzed", label: "Paralyzed" },
                      { value: "aged", label: "Aged" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setDisabilityType(type.value as DisabilityType)}
                        className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                          disabilityType === type.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-card-foreground hover:border-primary/50"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {userType === "caregiver" && (
                <div className="space-y-2">
                  <label htmlFor="groupId" className="text-sm font-medium text-foreground">
                    Group ID
                  </label>
                  <Input
                    id="groupId"
                    type="text"
                    placeholder="Enter the group ID to join"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask the person you're caring for or another caregiver for the Group ID
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-12 text-base"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Create Account
              </Button>
            </form>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => router.push("/auth/signin")} className="text-primary font-medium hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
