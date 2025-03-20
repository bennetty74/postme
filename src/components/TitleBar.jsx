import { motion } from "framer-motion";
import { FaWindowMinimize, FaWindowMaximize, FaTimes } from "react-icons/fa";
import Lottie from "lottie-react";
import titleBarAnimation from "../assets/json/title-bar-annimation.json";

const TitleBar = ({ onMinimize, onMaximize, onClose }) => {
  const buttonVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  return (
    <div
      className="h-10 bg-melad-100 flex justify-between items-center px-4 select-none"
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="flex flex-row items-center">
        {/* App Title */}
        <div className="text-melad-700 font-semibold">Postme</div>

        {/* Lottie Animation in the Middle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-12 h-12 flex items-center justify-center"
        >
          <Lottie animationData={titleBarAnimation} loop={true} />
        </motion.div>
      </div>

      {/* Traffic Lights */}
      <div className="flex space-x-2" style={{ WebkitAppRegion: "no-drag" }}>
        

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onMaximize}
          className="relative w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none"
          title="最大"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-melad-700 text-white text-[6px] rounded px-1 py-0.5"
          >
            <FaWindowMaximize className="inline mr-1" /> 最大
          </motion.span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onMinimize}
          className="relative w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
          title="最小"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-melad-700 text-white text-[6px] rounded px-1 py-0.5"
          >
            <FaWindowMinimize className="inline mr-1" /> 最小
          </motion.span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onClose}
          className="relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none"
          title="关闭"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-melad-700 text-white text-[6px] rounded px-1 py-0.5"
          >
            <FaTimes className="inline mr-1" /> 关闭
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default TitleBar;
