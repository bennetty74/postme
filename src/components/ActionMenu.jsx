// src/components/ActionMenu.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaFileAlt } from "react-icons/fa";

const ActionMenu = ({ show, onAction, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-40 bg-melad-100  border border-melad-300 rounded-md shadow-lg z-10"
        >
          <button
            onClick={() => {
              onAction("folder");
              onClose();
            }}
            className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
          >
            <FaFolder className="mr-2" /> 创建目录
          </button>
          <button
            onClick={() => {
              onAction("request");
              onClose();
            }}
            className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
          >
            <FaFileAlt className="mr-2" /> 创建请求
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionMenu;