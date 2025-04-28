import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TicketSchemaType } from "@/lib/types";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar,
  Users,
  Ticket,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function TicketPopover({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: TicketSchemaType;
}) {
  const {
    name,
    startDate,
    endDate,
    eventID,
    ticketID,
    tier,
    price,
    quantity,
    groupNumber,
    scans,
    transactionID,
    createdAt,
  } = data;

  console.log(data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };
  console.log(groupNumber!*quantity - scans)
  console.log(groupNumber, quantity, scans);

  return (
    data && <Card className="w-full box-border max-w-md mx-auto shadow-md m-4">
      <CardHeader className="bg-slate-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-300"
          >
            {tier}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">Event ID: {eventID}</p>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Date & Time
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Start:</span>
                <span className="text-sm">{startDate && formatDate(startDate)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">End:</span>
                <span className="text-sm">{ endDate && formatDate(endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Ticket ID</span>
            <div className="flex items-center">
              <Ticket className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium">{ticketID}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Price</span>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium">${price.toFixed(2)}</span>
              {/* <span className="text-sm font-medium">${price}</span> */}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Quantity</span>
            <div className="flex items-center">
              <Hash className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium">{quantity}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Group Number</span>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium">{groupNumber}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Verification
          </h3>
          <div className="flex items-center mb-2">
            {scans ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <XCircle className="h-4 w-4 mr-2 text-red-500" />}
            <div className="flex flex-col">
              <span className="text-sm">Scanned {(groupNumber ?? 1)*quantity - scans} time(s)</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Transaction ID: {transactionID.slice(0, 10)} ...</div>
            <div>Created: {formatDate(createdAt)}</div>
          </div>
        </div>
        <Button onClick={()=>setOpen(false)}>Close</Button>
      </CardContent>
    </Card>
  );
}
