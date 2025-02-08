// import { Copy } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import React from "react";

// export function SignInAlert({
//   isOpen,
//   setIsOpen,
//   continueCallback,
//   signInCallback,
// }: {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   continueCallback: () => void;
//   signInCallback: () => void;
// }) {
//   return (
//     <Dialog open={isOpen}>
//        <DialogTrigger asChild className={`${isOpen ? "" : "hidden"}`} hidden={!isOpen}>
//      <Button variant="outline">Share</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md w-[90%]">
//         <DialogHeader>
//           <DialogTitle>Sign In?</DialogTitle>
//           <DialogDescription>
//             Sign in to store purchase tickets
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2"></div>
//         <DialogFooter className="sm:justify-start">
//           <DialogClose asChild>
//             <Button
//               type="button"
//               className="w-full my-1"
//               variant="secondary"
//               onClick={() => {
//                 setIsOpen(false)
//                 continueCallback();
//               }}
//             >
//               Continue Without Sign In
//             </Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button
//               type="button"
//               className="w-full my-1"
//               variant="secondary"
//               onClick={() => {
//                 signInCallback();
//                 setIsOpen(false)
//               }}
//             >
//               Sign In
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";
// import { Dialog, Transition } from "@headlessui/react";
// import React, { Fragment, useState } from "react";

// export function SignInAlert({
//   isOpen,
//   setIsOpen,
//   headerText,
//   text,
// }: {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   text: string;
//   headerText: string;
// }) {
//   // let [isOpen, setIsOpen] = useState(true)

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function openModal() {
//     setIsOpen(true);
//   }

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center justify-center">
//         {/* <button
//           type="button"
//           onClick={openModal}
//           className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
//         >
//           Open dialog
//         </button> */}
//       </div>

//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black/25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-red-500"
//                   >
//                     {headerText}
//                   </Dialog.Title>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">{text}</p>
//                   </div>

//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                       onClick={closeModal}
//                     >
//                       {"Sgin In"}
//                     </button>
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                       onClick={closeModal}
//                     >
//                       {"Continue Without Sign In"}
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignInAlert({
  isOpen,
  setIsOpen,
  continueCallback,
  signInCallback,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  continueCallback: () => void;
  signInCallback: () => void;
}) {
  // let [isOpen, setIsOpen] = useState(true);

  function open() {
    setIsOpen(true);
  }

  function close(action: "continue" | "sign in" | undefined) {

    if (action === "continue") {
      continueCallback();
    } else {
      signInCallback();
    }
    setIsOpen(false);
  }

  function handleContinue() {
    continueCallback();
    setIsOpen(false);
  }

  function handleSignIn() {
    signInCallback();
    setIsOpen(false);
  }

  return (
    <>
      {/* <Button
        onClick={open}
        className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Open dialog
      </Button> */}

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpen(false)}
        __demoMode
        // onBlur={()=>console.log("blur")}
      >
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
              <DialogTitle as="h3" className="text-base/7 font-medium ">
                Continue Wtihout Sign In?
              </DialogTitle>
              <p className="mt-2 text-sm/6 ">
                <p>Sign in to keep track of purchases</p>
                <p>Receive notifications about upcoming events</p>
                <p>Retrive past purchases</p>
                <p>Create events</p>
              </p>
              <div className="mt-4 ">
                <Button
                  className="inline-flex items-center w-6/12 gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white "
                  onClick={()=>close("continue")}
                  variant={"outline"}
                >
                  Continue
                </Button>
                <Button
                  className="inline-flex items-center text-center w-5/12 border-box mx-2 gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white "
                  onClick={()=>close("sign in")}
                  variant={"default"}
                >
                  Sign In
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
