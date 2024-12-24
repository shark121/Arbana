import SearchSVG from "@/images/svg/search";
import TicketSVG from "@/images/svg/ticket";
import UserSVG from "@/images/svg/user";
import HomeSVG from "@/images/svg/home";
import EventsCompotent from "@/images/svg/events";
import { COLORSMAP } from "../../data/colors";
import { LucideLogOut } from "lucide-react";
("lucide-react");
import { deleteCookie } from "@/lib/utils";
import Logo from "@/images/svg/logo"

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
    icon: <HomeSVG/>,
    callback: () => {
      window.location.href = "/";
    },
  },

  {
    text: "Tickets",
    url: "/tickets",
    icon: <TicketSVG primaryColor="#ff8f00" />,
    callback: () => {
      window.location.href = "/tickets";
    },
  },
  // {
  //     text: "Search",
  //     url: "/search",
  //     icon: <SearchSVG fill="#2dfe64" height="35px"/>,
  // },
  {
    text: "My Events",
    url: "/myEvents",
    icon: <EventsCompotent />,
    callback: () => {
      window.location.href = "/myEvents";
    },
  },

  {
    text: "Logout | Login",
    url: "/home",
    icon: <LucideLogOut size={20} color={"gray"} />,
    callback: () => {
      deleteCookie("user");
      window.location.href = "/home";
    },
  },
];
