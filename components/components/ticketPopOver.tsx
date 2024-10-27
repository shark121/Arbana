import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

  import { Button } from "@/components/ui/button"
  


export default function TicketPopOver(){
    return(
        <Popover>
        <PopoverTrigger>
          <button>Open Popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover Content</div>
         {/* <PopoverTrigger>Close</PopoverTrigger> */}
        </PopoverContent>
      </Popover>
    )
}