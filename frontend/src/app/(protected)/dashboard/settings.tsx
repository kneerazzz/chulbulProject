"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/app/components/ui/drawer"
import { Button } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"
import { User, LogOut, Lock, Edit } from "lucide-react"
import { logout } from "@/app/utils/logout"

export default function SettingsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const router = useRouter()

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
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/edit")}>
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/change-password")}>
            <Lock className="w-4 h-4 mr-2" /> Change Password
          </Button>
          <Button variant="destructive" className="justify-start" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

