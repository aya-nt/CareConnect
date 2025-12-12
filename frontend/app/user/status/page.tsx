"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Heart, Smile, Frown, Meh } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserStatus() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const sendStatus = (mood: string) => {
    setSelectedMood(mood)
    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
      setTimeout(() => router.push("/user/dashboard"), 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6 pb-8">
        <div className="flex items-center justify-between pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/user/dashboard")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">How are you feeling?</h1>
          <p className="text-muted-foreground">Let your family know you're doing well</p>
        </div>

        {isSending && (
          <Card className="p-4 bg-success/10 border-success/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-full animate-pulse">
                <Heart className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-success-foreground">Sending status...</p>
                <p className="text-sm text-muted-foreground">Your family will be notified</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          <Card
            className={`p-8 cursor-pointer transition-all ${
              selectedMood === "great"
                ? "bg-success/10 border-success shadow-lg scale-105"
                : "hover:shadow-md active:scale-95"
            }`}
            onClick={() => sendStatus("great")}
          >
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-full ${selectedMood === "great" ? "bg-success" : "bg-success/20"}`}>
                <Smile className={`w-10 h-10 ${selectedMood === "great" ? "text-white" : "text-success"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">Feeling Great</h3>
                <p className="text-muted-foreground mt-1">Everything is good</p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-8 cursor-pointer transition-all ${
              selectedMood === "okay"
                ? "bg-primary/10 border-primary shadow-lg scale-105"
                : "hover:shadow-md active:scale-95"
            }`}
            onClick={() => sendStatus("okay")}
          >
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-full ${selectedMood === "okay" ? "bg-primary" : "bg-primary/20"}`}>
                <Meh className={`w-10 h-10 ${selectedMood === "okay" ? "text-white" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">Doing Okay</h3>
                <p className="text-muted-foreground mt-1">Things are alright</p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-8 cursor-pointer transition-all ${
              selectedMood === "tired"
                ? "bg-accent/50 border-border shadow-lg scale-105"
                : "hover:shadow-md active:scale-95"
            }`}
            onClick={() => sendStatus("tired")}
          >
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-full ${selectedMood === "tired" ? "bg-muted" : "bg-muted/50"}`}>
                <Frown
                  className={`w-10 h-10 ${selectedMood === "tired" ? "text-foreground" : "text-muted-foreground"}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">A Bit Tired</h3>
                <p className="text-muted-foreground mt-1">Could use some rest</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
