"use client";

import {
  CreatorSchemaType,
  PermissionsSchemaType,
  TeamDataType,
} from "@/lib/types";
import {
  PermissionsComponent,
  PermissionsPopover,
} from "../../../../../../components/ui/permissionsComponent";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";

export default function Team({ params }: { params: { data: string } }) {
  const eventId = params.data;
  const [popOverOpenState, setPopOverOpenState] = useState(false);

  const [permissionsTray, setPermissionsTray] = useState<TeamDataType>();

  const [updatedPermissions, setUpdatedPermissions] = useState<string[]>([]);

  console.log(eventId);

  useEffect(() => {
    async function fetchTeamData() {
      await fetch(`/api/team/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setPermissionsTray(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    fetchTeamData();
  }, []);

  async function handleSubmitChanges() {
    const updatedPermissionsObject: TeamDataType = {};

    /// Check for updated permissions
    if (!updatedPermissions) return;

    permissionsTray &&
      updatedPermissions.forEach((userId) => {
        updatedPermissionsObject[userId] = permissionsTray[userId];
      });

    console.log(updatedPermissionsObject, updatedPermissions);

    await fetch(`/api/team/`, {
      method: "PATCH",
      body: JSON.stringify({ eventId, updatedPermissionsObject }),
    })
      // .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function handleAddTeamMember({
    email,
    permissions,
  }: {
    email: string;
    permissions: PermissionsSchemaType;
  }) {
    const event = sessionStorage.getItem(eventId);

    if (event) {
      const eventToJson = JSON.parse(event);

      if (eventToJson.creator.email === email) {
        console.log("Attempting to add the creator is not allowed");
        return;
      }
    } else {
      console.log("Event not found");
      return;
    }

    await fetch(`/api/team/`, {
      method: "POST",
      body: JSON.stringify({ eventId, email, permissions }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Add Team Member");
  }

 async function handleDelete(uid: string) {
    // setPermissionsTray({})
    if (!permissionsTray) return;
    const currentTray: TeamDataType = {};

    for (let key in permissionsTray) {
      if (permissionsTray[key].info.uid !== uid) {
        currentTray[key] = permissionsTray[key];
      }
    }
    
   
    await fetch(`/api/team/${eventId}/${uid}`, {
      method: "DELETE",
    }).then((response) => console.log("deleted", uid));

    setPermissionsTray(currentTray);
  }

  if (!permissionsTray) return <Loading />;

  return (
    permissionsTray && (
      <div>
        <div className="text-[2rem]">Team</div>
        <div className="h-[3rem] w-full my-4 px-4">
          {/* <Button variant={"outline"}>Add Team Member</Button> */}
          <PermissionsPopover
            openState={popOverOpenState}
            setOpenState={setPopOverOpenState}
            handleAddTeamMember={handleAddTeamMember}
          />
        </div>
        <div>
          {Object.keys(permissionsTray).map((user) => {
            return (
              <PermissionsComponent
                user={permissionsTray[user]}
                permissionsTray={permissionsTray}
                key={permissionsTray[user].info.uid}
                setUpdatedPermissions={setUpdatedPermissions}
                updatedPermissions={updatedPermissions}
                handleDelete={handleDelete}
              />
            );
          })}
        </div>
        <div className="h-[3rem] w-full my-4 flex items-center justify-center">
          <Button
            variant={"outline"}
            onClick={async () => await handleSubmitChanges()}
          >
            Submit Changes
          </Button>
        </div>
      </div>
    )
  );
}
