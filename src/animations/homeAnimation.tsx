import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {} from "@/images/svg/verified";
import Image from "next/image";
import PartyComponent from "@/images/svg/party";
import WineGlassSVG from "@/images/svg/wineGlass";
import {ColoredLocation} from "@/images/svg/location";
import { ColoredTicket } from "@/images/svg/ticket";
import { ColoredSearch } from "@/images/svg/search";
// import { PartyComponent } from "@/images/svg/party";

const StackedCarousel = () => {
  const [cards, setCards] = useState([
    // { id: 1, title: "Card 1", link: "https://img.icons8.com/color/48/confetti.png" },
    { id: 1, title: "Card 1", color: "bg-blue-500", element: <ColoredSearch/> },
    { id: 2, title: "Card 5", color: "bg-yellow-500", element: <ColoredTicket/> },
    { id: 3, title: "Card 4", color: "bg-purple-500", element: <ColoredLocation/> },
    { id: 4, title: "Card 2", color: "bg-green-500", element: <PartyComponent/> },
    // { id: 5, title: "Card 3", color: "bg-red-500", element: <WineGlassSVG/> },
  ]);
  

  const greysMap = {
    0: "white",
    1: "bg-gray-100",
    2: "bg-gray-200",
    3: "bg-gray-300",
    4: "bg-gray-400",
    5: "bg-gray-500",
    6: "bg-gray-600",
    7: "bg-gray-700",
    8: "bg-gray-800",
  }

  useEffect(() => {
    const interval = setInterval(() => {
      rotateCards();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const rotateCards = () => {
    setCards((prevCards) => {
      const [firstCard, ...rest] = prevCards;
      return [...rest, firstCard];
    });
  };

  return (
    <div className="relative flex items-center justify-center h-[25rem] sm:h-[20rem] w-full">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`
              absolute w-[6rem] h-[6rem] rounded-3xl p-4 shadow-lg flex items-center justify-center
              ${index == 0 ? "bg-white" : "bg-gray-100"} 
            / #text-white
            `}
            style={{
              zIndex: cards.length - index,

            }}

            initial={{
              opacity: 1 - index * 0.3,
              scale: 0.9,
              translateY: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1 - index * 0.09,
              translateY: -index * 10,
              rotateX: -index * 2,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              translateY: -20,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            {/* <Image src={<PartyComponent/>} alt="icon" fill/> */}
            {/* <PartyComponent/> */}
            {/* <WineGlassSVG/> */}
            {card.element}
            {/* {index} */}
            {/* <div className="text-md ">{card.title}</div> */}
            {/* <div className="mt-4">Content for {card.title}</div> */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StackedCarousel;
