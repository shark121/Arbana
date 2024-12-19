"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function ToastComponent() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          description: "Your message has been sent.",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
