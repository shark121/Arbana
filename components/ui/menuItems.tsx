import SearchSVG from "@/images/svg/search";
import TicketSVG from "@/images/svg/ticket";
import UserSVG from "@/images/svg/user";
import HomeSVG from "@/images/svg/home";
import Logout from "@/images/svg/logout";
import { COLORSMAP } from "../../data/colors";
import { LucideLogOut, User, UserRoundCog, Tickets, CalendarCheck2 } from "lucide-react";
("lucide-react");
import { deleteCookie } from "@/lib/utils";
import Logo from "@/images/svg/logo";
import {auth } from "@/firebase.config"
import CustomerService from "@/images/svg/customerService";

export const menuItems = [
  {
    text: "User",
    url: "",
    icon: <Logo />,
    callback: () => {},
  },
  {
    text: "Home",
    url: "/",
    icon: <HomeSVG />,
    callback: () => {
      window.location.href = "/";
    },
  },

  {
    text: "My Tickets",
    url: "/tickets",
    icon: <Tickets size={20} color={"gray"} />,
    callback: () => {
      window.location.href = "/tickets";
    },
  },
  {
    text: "My Events",
    url: "/myEvents",
    icon: <CalendarCheck2 size={20} color="gray" />,
    callback: () => {
      window.location.href = "/myEvents";
    },
  },

  {
    text: "Account",
    url: "/account",
    icon: <UserRoundCog size={20} color={"gray"} />,
    callback: () => {
      // deleteCookie("user");
      window.location.href = "/account";
    },
  },
{
    text: "Contact",
    url: "/contact",
    icon: <CustomerService size={20} />,
    callback: () => {
      window.location.href = "/contact";
    },
},
  {
    text: "Logout | Login",
    url: "/home",
    icon: <Logout fill={"gray"}  height="20px" width="20px"/>,
    callback: () => {
      deleteCookie("user");
      auth.signOut();
      window.location.href = "/home";
    },
  },
];
