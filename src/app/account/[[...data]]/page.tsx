"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreatorSchemaType, CreatorSchema } from "@/lib/types";
import { Camera, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

async function sendAccountUpdate({
  account,
}: {
  account: CreatorSchemaType & { imageFile: File | null, shouldUpdateEmail: boolean };
}) {
  const { imageFile, ...rest } = account;
  const requestFormData = new FormData();
  imageFile && requestFormData.append("imageFile", imageFile);
  requestFormData.append("rest", JSON.stringify(rest));

  console.log(account, "requestFormData");

  return await fetch("/api/account/", {
    method: "PATCH",
    body: requestFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data, "event data"))
    .catch((error) => {
      window.alert(`An error occured ${String(error)}`);
      console.log(error);
    });
}

export default function AccountPage() {
  const [imageFileState, setImageFileState] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<CreatorSchemaType | null>(
    null
  );

  const form = useForm<Omit<CreatorSchemaType, "uid" | "imageUrl">>({
    resolver: zodResolver(CreatorSchema.omit({ uid: true, imageUrl: true })),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      //   imageUrl: "",
      location: "",
      verified: false,
      bio: "",
      socialMediaLinks: [],
    },
  });

  useEffect(() => {
    if (!imageFileState) return;
    const fileUrl = URL.createObjectURL(imageFileState);
    setImageUrl(fileUrl);
  }, [imageFileState]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem("user");

    if (!userInfo) return;

    let user = null;

    if (userInfo) user = JSON.parse(userInfo as string) as any;

    const userId = user?.uid;

    fetch(`/api/account/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccountData(data.data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!accountData) return;
    const { imageUrl } = accountData;
    imageUrl && setImageUrl(imageUrl);

    form.setValue("name", accountData.name);
    form.setValue("email", accountData.email);
    form.setValue("mobile", accountData.mobile);
    form.setValue("location", accountData.location);
    form.setValue("bio", accountData.bio);
    form.setValue("socialMediaLinks", accountData.socialMediaLinks);
  }, [accountData]);

  //   function onSubmit(data: z.infer<typeof FormSchema>) {
  //     toast({
  //       title: "You submitted the following values:",
  //       description: (
  //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //         </pre>
  //       ),
  //     })
  //   }

  async function onSubmit(event: Omit<CreatorSchemaType, "uid" | "imageUrl"> ) {
    if (!accountData) return;

    // console.log(accountData, "accountData");
    // return
     
    const shouldUpdateEmail = accountData.email !== event.email;

    let updatedEvent: CreatorSchemaType = {
      ...event,
      uid: accountData.uid,
      imageUrl: accountData.imageUrl,
    };

    if (imageFileState) {
      const updatedEventWithFile: CreatorSchemaType & { imageFile: File } = {
        ...updatedEvent,
        imageFile: imageFileState as File,
      };

      await sendAccountUpdate({ account: {...updatedEventWithFile, shouldUpdateEmail} });

    } else {
      await sendAccountUpdate({ account: {...updatedEvent, imageFile : null, shouldUpdateEmail} });
    }

    console.log(updatedEvent, "data");
    // console.log(e);
  }

  return (
    <div className="w-full h-full flex items-center justify-center flex-col ">
      <div className="relative aspect-square h-[10.5rem] sm:h-[11.5rem] flex items-center justify-center">
        <div className="w-[10rem] h-[10rem] rounded-full bg-gray-100 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              fill
              alt="profile image"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <UserRoundCog size={36} color="gray" strokeWidth={"1px"} />
            </div>
          )}
        </div>
        <label
          className="h-[45px] aspect-square absolute bottom-2 right-2 rounded-full bg-gray-100 flex items-center justify-center "
          htmlFor="image-upload"
        >
          <Camera size={36} color="gray" strokeWidth={"1px"} />
          <input
            type="file"
            id="image-upload"
            className="hidden"
            onChange={(e) =>
              e.target.files && setImageFileState(e.target.files[0])
            }
          />
        </label>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-2 p-4 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Display Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormDescription>This is your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="+233 123 456 789" {...field} />
                </FormControl>
                <FormDescription>This is your mobile number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.png"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your profile image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Accra, Ghana" {...field} />
                </FormControl>
                <FormDescription>This is your location.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Bio." {...field} />
                </FormControl>
                <FormDescription>This is your bio.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialMediaLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Media Links</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com" {...field} />
                </FormControl>
                <FormDescription>
                  These are your social media links.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
