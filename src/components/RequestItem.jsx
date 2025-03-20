import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaEllipsisV } from "react-icons/fa";

const RequestItem = ({
  request,
  index,
  onSelect,
  onRenameRequest,
  onDuplicateRequest,
  onDeleteRequest,
  onMoveItem,
  selectedRequest,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if (action === "rename") {
      onRenameRequest(request.id);
    } else if (action === "duplicate") {
      onDuplicateRequest(request.id);
    } else if (action === "delete") {
      onDeleteRequest(request.id);
    } else if (action === "moveUp") {
      onMoveItem(request.id, "up");
    } else if (action === "moveDown") {
      onMoveItem(request.id, "down");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex items-center p-2 mb-2 bg-melad-100 text-melad-700 rounded-md hover:bg-melad-200 transition relative  p-1
        ${selectedRequest?.id === request.id ? "bg-melad-200" : ""}`}
    >
      <div onClick={() => onSelect(request)} className="flex-1 cursor-pointer">
        <span className="font-semibold flex items-center">
          <FaFileAlt className="mr-2" /> {request.name || request.url}
        </span>
        {/* <p className="text-sm text-melad-500">{request.timestamp}</p> */}
      </div>
      <div className="relative" ref={menuRef}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="text-melad-500 hover:text-melad-700"
        >
          <FaEllipsisV />
        </motion.button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-40 bg-melad-100 border border-melad-300 rounded-md shadow-lg z-10"
            >
              <button
                onClick={() => handleMenuAction("rename")}
                className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
              >
                重命名
              </button>
              <button
                onClick={() => handleMenuAction("duplicate")}
                className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
              >
                复制请求
              </button>
              <button
                onClick={() => handleMenuAction("delete")}
                className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
              >
                删除文件
              </button>
              <button
                onClick={() => handleMenuAction("moveUp")}
                className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
              >
                向下移动
              </button>
              <button
                onClick={() => handleMenuAction("moveDown")}
                className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
              >
               向上移动
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RequestItem;