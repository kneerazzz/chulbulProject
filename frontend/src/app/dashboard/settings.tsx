"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User, LogOut, Lock, Edit } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

export default function SettingsDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
        const res = await axios.post("/api/auth/logout", {}, {
            withCredentials: true
        })
        if(res.data.statusCode !== 200){
            toast.error("Error logging out")
        }
        toast.success("Logged out successfully!!")
        router.push("/login")
    } catch (error) {
        console.log("Error logging out", error)
        router.push("/profile")
        toast.error("Please Try Logging out again") 
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="p-6 w-64">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile")}>
            <User className="w-4 h-4 mr-2" /> View Profile
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/edit-profile")}>
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/change-password")}>
            <Lock className="w-4 h-4 mr-2" /> Change Password
          </Button>
          <Button variant="destructive" className="justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
