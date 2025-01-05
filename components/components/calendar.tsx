"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date is required.",
  }),
})

export default function CalendarForm({
  defaultDate, 
  setDateState,
  label
}: {
  defaultDate?: Date;
  dateState: Date | undefined;
  setDateState: React.Dispatch<React.SetStateAction<Date | undefined>>;
  label?:string
}) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // dob: new Date("Wed Dec 31 2025 00:00:00 GMT-0500 (Eastern Standard Time)"),
      dob:  defaultDate ?  defaultDate  : undefined,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8"
      onChange={(e)=>console.log(e)}
      >
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => { 
            // field.onChange = (e)=> setDateState(e)
           return <FormItem className="flex flex-col">
              <FormLabel>{label ?? ""}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >

                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(e)=>{
                    console.log(e)
                    setDateState(e)
                    return field.onChange(e)
                    }}
                        
                    // onSelect={(date)=>setDateState(date)}
                    // disabled={(date) =>
                    //   date > new Date() || date < new Date("1900-01-01")
                    // }
                    initialFocus
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          }}
        />
      </form>
    </Form>
  )
}
