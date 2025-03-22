import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaEllipsisV } from "react-icons/fa";
import RequestItem from "./RequestItem";

const Folder = ({
  folder,
  history,
  onSelectRequest,
  onAddRequest,
  onRenameFolder,
  onDeleteFolder,
  onRenameRequest,
  onDuplicateRequest,
  onDeleteRequest,
  onMoveItem,
  selectedRequest,
  inputState,
  setInputState,
  onUpdateHistory,
}) => {
  const [isExpanded, setIsExpanded] = useState(folder.isNew || false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Clean up isNew flag and ensure expansion
  useEffect(() => {
    if (folder.isNew) {
      setIsExpanded(true);
      const updatedFolder = { ...folder, isNew: false };
      const newHistory = history.map((item) => (item.id === folder.id ? updatedFolder : item));
      onUpdateHistory(newHistory);
    }
  }, [folder.isNew, folder.id, history, onUpdateHistory]);

  // Handle click outside to close menu
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
    if (action === "newRequest") {
      onAddRequest(folder.id);
      setIsExpanded(true); // Ensure folder expands when adding a new request
    } else if (action === "rename") {
      onRenameFolder(folder.id);
    } else if (action === "delete") {
      onDeleteFolder(folder.id);
    } else if (action === "moveUp") {
      onMoveItem(folder.id, "up");
    } else if (action === "moveDown") {
      onMoveItem(folder.id, "down");
    }
  };

  const handleInputConfirm = (e) => {
    console.log(inputState);
    if (e.key === "Enter" && inputState.value.trim()) {
      if (inputState.type === "request" && inputState.targetId === folder.id) {
        const newRequest = {
          id: Date.now().toString(),
          name: inputState.value,
          method: "GET",
          url: "",
          headers: {},
          body: "",
          response: "",
          timestamp: new Date().toLocaleString(),
        };
        const newHistory = history.map((item) =>
          item.id === folder.id ? { ...item, requests: [newRequest, ...item.requests] } : item
        );
        onUpdateHistory(newHistory);
        setIsExpanded(true); // Ensure folder remains expanded
      } else if (inputState.type === "renameFolder" && inputState.targetId === folder.id) {
        const newHistory = history.map((item) =>
          item.id === folder.id ? { ...item, name: inputState.value } : item
        );
        onUpdateHistory(newHistory);
      } else if (inputState.type === "renameRequest" && inputState.targetId) { // 修改条件
        const newHistory = history.map((item) =>
          item.id === folder.id
            ? {
                ...item,
                requests: item.requests.map((req) =>
                  req.id === inputState.targetId ? { ...req, name: inputState.value } : req // 使用 targetId
                ),
              }
            : item
        );
        onUpdateHistory(newHistory);
      }
      setInputState({ show: false, type: null, targetId: null, value: "", requestId: null });
    }
  };


  const renderInput = (type) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full p-2"
    >
      <input
        type="text"
        value={inputState.value}
        onChange={(e) => setInputState({ ...inputState, value: e.target.value })}
        onKeyDown={handleInputConfirm}
        placeholder={type === "request" ? "请求名称" : "新名称"}
        className="w-full p-2 bg-melad-100 border border-melad-200 text-melad-700 rounded-md focus:outline-none"
        autoFocus
      />
    </motion.div>
  );

  return (
    <div>
      {inputState.show && inputState.type === "renameFolder" && inputState.targetId === folder.id ? (
        renderInput("renameFolder")
      ) : (
        <motion.div
          className="flex items-center p-2 mb-2 bg-melad-100 text-melad-700 rounded-md hover:bg-melad-200 transition"
        >
          <div
            className="flex-1 flex items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FaFolder className="mr-2" />
            <span className="font-semibold">{folder.name}</span>
          </div>
          <div className="flex items-center relative" ref={menuRef}>
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
                  className="absolute right-0 top-full mt-2 w-40 bg-melad-100  border border-melad-300 rounded-md shadow-lg z-10"
                >
                     <button
                    onClick={() => handleMenuAction("rename")}
                    className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
                  >
                    重命名
                  </button>
                  <button
                    onClick={() => handleMenuAction("newRequest")}
                    className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
                  >
                    创建请求
                  </button>
                 
                  <button
                    onClick={() => handleMenuAction("moveUp")}
                    className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
                  >
                    向上移动
                  </button>
                  <button
                    onClick={() => handleMenuAction("moveDown")}
                    className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
                  >
                    向下移动
                  </button>
                  <button
                    onClick={() => handleMenuAction("delete")}
                    className="flex items-center w-full p-2 text-melad-700 hover:bg-melad-200"
                  >
                    删除文件
                  </button>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4"
          >
            {inputState.show && inputState.type === "request" && inputState.targetId === folder.id && renderInput("request")}
            {folder.requests.length === 0 && !inputState.show ? (
              <p className="text-melad-500 text-sm">列表空空如也</p>
            ) : (
              folder.requests.map((req, index) => (
                <div key={req.id}>
                  {inputState.show && inputState.type === "renameRequest" && inputState.targetId === req.id ? (
                    renderInput("renameRequest")
                  ) : (
                    <RequestItem
                      request={req}
                      index={index}
                      onSelect={onSelectRequest}
                      onRenameRequest={onRenameRequest}
                      onDuplicateRequest={onDuplicateRequest}
                      onDeleteRequest={onDeleteRequest}
                      onMoveItem={onMoveItem}
                      selectedRequest={selectedRequest}
                    />
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Folder;