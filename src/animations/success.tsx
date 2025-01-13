import React from "react";
import { motion } from "framer-motion";

export default function SuccessAnimation({
  size = 60,
  navTo,
}: {
  size?: number;
  navTo: string;
}) {
  setTimeout(() => {
    window.location.href = navTo;
  }, 1000);

  const circleVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center relative w-full h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative"
        style={{ width: size, height: size }}
      >
        <motion.div variants={circleVariants} className="">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-none stroke-green-500"
            strokeWidth="5"
          >
            <circle cx="50" cy="50" r="45" />
          </svg>
        </motion.div>

        <motion.div variants={checkVariants} className="absolute inset-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-none stroke-green-500"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path d="M30 50 L45 65 L70 35" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
