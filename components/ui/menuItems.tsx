import SearchSVG from "@/images/svg/search";
import TicketSVG from "@/images/svg/ticket";
import UserSVG from "@/images/svg/user";
import HomeSVG from "@/images/svg/home"
import EventsCompotent from "@/images/svg/events";
import {COLORSMAP} from "../../data/colors"



export const menuItems = [
    {
        text: "User",
        url: "/profile",
        icon: <UserSVG height="80px" width="80px" />,
    },
    {
        text: "Home",
        url: "/",
        icon: <HomeSVG/>,
    },

    {
        text: "Tickets",
        url: "/tickets",
        icon: <TicketSVG primaryColor="#ff8f00" />,
    },
    {
        text: "Search",
        url: "/search",
        icon: <SearchSVG fill="#2dfe64" height="35px"/>,
    },
    {
        text: "My Events",
        url: "/myEvents",
        icon: <EventsCompotent />,
    }
    ];