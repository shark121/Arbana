"use client";
import {
  PermissionsSchemaType,
  CreatorSchemaType,
  TeamDataType,
} from "@/lib/types";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UserCog2Icon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PermissionsComponent({
  user,
  permissionsTray,
  setUpdatedPermissions,
  updatedPermissions,
}: {
  user: { permissions: PermissionsSchemaType; info: CreatorSchemaType };
  permissionsTray: TeamDataType;
  setUpdatedPermissions: React.Dispatch<React.SetStateAction<string[]>>;
  updatedPermissions: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [allowEditChecked, setAllowEditChecked] = useState(
    user.permissions.canEdit
  );
  const [allowDeleteChecked, setAllowDeleteChecked] = useState(
    user.permissions.canDelete
  );
  const [allowViewChecked, setAllowViewChecked] = useState(
    user.permissions.canView
  );
  const [allowScanChecked, setAllowScanChecked] = useState(
    user.permissions.canScan
  );
  const [allowAddToTeamChecked, setAllowAddToTeamChecked] = useState(
    user.permissions.canAddToTeam
  );
  const [allowViewStatsChecked, setAllowViewStatsChecked] = useState(
    user.permissions.canViewStats
  );

  useEffect(() => {
    if (!updatedPermissions.includes(user.info.uid))
      setUpdatedPermissions([...updatedPermissions, user.info.uid]);

    permissionsTray[user.info.uid] = {
      info: user.info,
      permissions: {
        canEdit: allowEditChecked,
        canDelete: allowDeleteChecked,
        canView: allowViewChecked,
        canScan: allowScanChecked,
        canAddToTeam: allowAddToTeamChecked,
        canViewStats: allowViewStatsChecked,
      },
    };
  }, [allowEditChecked, allowScanChecked, allowViewStatsChecked]);

  console.log(allowEditChecked);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 hover:bg-gray-100"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <div className="text-thin font-semibold flex w-full items-center justify-between">
          <UserCog2Icon />
          <div>{user.info.email}</div>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
          <div>Allow Edit</div>
          <Checkbox
            checked={allowEditChecked}
            onCheckedChange={(e) => setAllowEditChecked(Boolean(e.valueOf()))}
          />
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
          <div>Allow Scan</div>
          <Checkbox
            checked={allowScanChecked}
            onCheckedChange={(e) => setAllowScanChecked(Boolean(e.valueOf()))}
          />
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
          <div>Allow View Stats</div>
          <Checkbox
            checked={allowViewStatsChecked}
            onCheckedChange={(e) =>
              setAllowViewStatsChecked(Boolean(e.valueOf()))
            }
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PermissionsPopover({
  openState,
  setOpenState,
  handleAddTeamMember,
}: {
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTeamMember: ({
    email,
    permissions,
  }: {
    email: string;
    permissions: PermissionsSchemaType;
  }) => Promise<void>;
}) {
  const [allowEditChecked, setAllowEditChecked] = useState(false);
  const [allowScanChecked, setAllowScanChecked] = useState(false);
  const [allowViewStatsChecked, setAllowViewStatsChecked] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  return (
    <Popover open={openState} defaultOpen={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setOpenState(!openState)}>
          Add Team Member
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Add New Team Member</h4>
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={() => setOpenState(false)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Describe permissions for the new team member
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Email</Label>
              <Input
                id="email"
                placeholder="example@gmail.com"
                type="email"
                className="col-span-4 h-12"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
              <div>Allow Scan</div>
              <Checkbox
                // checked={allowScanChecked}
                onCheckedChange={(e) =>
                  setAllowScanChecked(Boolean(e.valueOf()))
                }
              />
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
              <div>Allow Edit</div>
              <Checkbox
                // checked={allowEditChecked}
                onCheckedChange={(e) =>
                  setAllowEditChecked(Boolean(e.valueOf()))
                }
              />
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center ">
              <div>Allow View Stats</div>
              <Checkbox
                // checked={allowViewStatsChecked}
                onCheckedChange={(e) =>
                  setAllowViewStatsChecked(Boolean(e.valueOf()))
                }
              />
            </div>
          </div>
        </div>
        {/* <PopoverTrigger asChild> */}
        <Button
          className="w-full my-4"
          onClick={async () => {
            // console.log("adding")
            setOpenState(false);
            await handleAddTeamMember({
              email: userEmail,
              permissions: {
                canEdit: allowEditChecked,
                canScan: allowScanChecked,
                canViewStats: allowViewStatsChecked,
              },
            });
          }}
        >
          Add
        </Button>
        {/* </PopoverTrigger> */}
      </PopoverContent>
    </Popover>
  );
}
