import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"

export function SignInAlert({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <Dialog open={isOpen}>
      {/* <DialogTrigger asChild className={`${isOpen ? "" : "hidden"}`} hidden={!isOpen}>
     <Button variant="outline">Share</Button> 
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md w-[90%]">
        <DialogHeader>
          <DialogTitle>Sign In?</DialogTitle>
          <DialogDescription>
            Sign in to store purchase tickets
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" className="w-full my-1" variant="secondary" onClick={() => setIsOpen(false)}>
              Continue Without Sign In
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" className="w-full my-1" variant="secondary" onClick={() => setIsOpen(false)}>
              Sign In
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
