import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEllipsisV } from "react-icons/fa";
import Folder from "./Folder";
import RequestItem from "./RequestItem";
import ActionMenu from "./ActionMenu";

const HistoryPanel = ({ history, onSelectRequest, onAddFolder, onAddRequest, onUpdateHistory, isCollapsed, selectedRequest }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [inputState, setInputState] = useState({ show: false, type: null, targetId: null, value: "" });

  const handleMenuAction = (type) => {
    setInputState({ show: true, type, targetId: null, value: "" });
    setShowMenu(false);
  };

  const handleFolderAddRequest = (folderId) => {
    setInputState({ show: true, type: "request", targetId: folderId, value: "" });
  };

  const handleRenameFolder = (folderId) => {
    const folder = history.find((item) => item.id === folderId);
    setInputState({ show: true, type: "renameFolder", targetId: folderId, value: folder ? folder.name : "" });
  };

  const handleDeleteFolder = (folderId) => {
    const newHistory = history.filter((item) => item.id !== folderId);
    onUpdateHistory(newHistory);
  };

  const handleRenameRequest = (requestId) => {
    const request = findRequestById(history, requestId);
    setInputState({ 
      show: true, 
      type: "renameRequest", 
      targetId: requestId, // 请求的 ID
      value: request ? request.name || request.url : "",
      requestId: requestId // 添加 requestId 以保持一致性（可选）
    });
  };

  const handleDuplicateRequest = (requestId) => {
    const request = findRequestById(history, requestId);
    if (request) {
      const newRequest = { ...request, id: Date.now().toString(), timestamp: new Date().toLocaleString() };
      const newHistory = [...history];
      const parentFolder = findParentFolder(history, requestId);
      if (parentFolder) {
        const folderIndex = newHistory.findIndex((item) => item.id === parentFolder.id);
        newHistory[folderIndex] = {
          ...parentFolder,
          requests: [newRequest, ...parentFolder.requests],
        };
      } else {
        newHistory.unshift(newRequest);
      }
      onUpdateHistory(newHistory);
    }
  };

  const handleDeleteRequest = (requestId) => {
    const newHistory = history
      .map((item) =>
        item.requests
          ? { ...item, requests: item.requests.filter((req) => req.id !== requestId) }
          : item
      )
      .filter((item) => item.id !== requestId || item.requests);
    onUpdateHistory(newHistory);
  };

  const handleMoveItem = (itemId, direction) => {
    const newHistory = [...history];
    const itemIndex = newHistory.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      for (let i = 0; i < newHistory.length; i++) {
        if (newHistory[i].requests) {
          const requestIndex = newHistory[i].requests.findIndex((req) => req.id === itemId);
          if (requestIndex !== -1) {
            const requests = [...newHistory[i].requests];
            if (direction === "up" && requestIndex > 0) {
              [requests[requestIndex - 1], requests[requestIndex]] = [requests[requestIndex], requests[requestIndex - 1]];
            } else if (direction === "down" && requestIndex < requests.length - 1) {
              [requests[requestIndex], requests[requestIndex + 1]] = [requests[requestIndex + 1], requests[requestIndex]];
            }
            newHistory[i] = { ...newHistory[i], requests };
            onUpdateHistory(newHistory);
            return;
          }
        }
      }
      return;
    }
    if (direction === "up" && itemIndex > 0) {
      [newHistory[itemIndex - 1], newHistory[itemIndex]] = [newHistory[itemIndex], newHistory[itemIndex - 1]];
    } else if (direction === "down" && itemIndex < newHistory.length - 1) {
      [newHistory[itemIndex], newHistory[itemIndex + 1]] = [newHistory[itemIndex + 1], newHistory[itemIndex]];
    }
    onUpdateHistory(newHistory);
  };

  const findRequestById = (history, requestId) => {
    for (const item of history) {
      if (item.id === requestId && !item.requests) return item;
      if (item.requests) {
        const req = item.requests.find((r) => r.id === requestId);
        if (req) return req;
      }
    }
    return null;
  };

  const findParentFolder = (history, requestId) => {
    for (const item of history) {
      if (item.requests && item.requests.some((req) => req.id === requestId)) {
        return item;
      }
    }
    return null;
  };

  const handleInputConfirm = (e) => {
    if (e.key === "Enter" && inputState.value.trim()) {
      if (inputState.type === "folder") {
        onAddFolder({
          id: Date.now().toString(),
          name: inputState.value,
          requests: [],
          isNew: true,
        });
      } else if (inputState.type === "request" && !inputState.targetId) {
        onAddRequest(null, {
          id: Date.now().toString(),
          name: inputState.value,
          method: "GET",
          url: "",
          headers: {},
          body: "",
          response: "",
          timestamp: new Date().toLocaleString(),
        });
      } else if (inputState.type === "renameRequest" && inputState.targetId) {
        const newHistory = history.map((item) => {
          if (item.id === inputState.targetId && !item.requests) {
            return { ...item, name: inputState.value };
          }
          if (item.requests) {
            return {
              ...item,
              requests: item.requests.map((req) =>
                req.id === inputState.targetId ? { ...req, name: inputState.value } : req
              ),
            };
          }
          return item;
        });
        onUpdateHistory(newHistory);
      }
      setInputState({ show: false, type: null, targetId: null, value: "" });
    }
  };

  const renderInput = (type) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full p-2 mb-2"
    >
      <input
        type="text"
        value={inputState.value}
        onChange={(e) => setInputState({ ...inputState, value: e.target.value })}
        onKeyDown={handleInputConfirm}
        placeholder={
          type === "folder"
            ? "请输入名称"
            : type === "request"
            ? "请输入名称"
            : "请输入名称"
        }
        className="w-full p-2 bg-melad-100 border border-melad-200 text-melad-700 rounded-md focus:outline-none"
        autoFocus
      />
    </motion.div>
  );

  return (
    <motion.div
      animate={{ width: isCollapsed ? 0 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="rounded-lg h-full overflow-hidden"
    >
      <div className="p-1 flex justify-between items-center relative">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold text-melad-700"
            >
              请求列表
            </motion.h3>
          )}
        </AnimatePresence>
        <div className="flex space-x-2">
          {!isCollapsed && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-melad-500 hover:text-melad-700"
              >
                <FaEllipsisV />
              </motion.button>
              <ActionMenu
                show={showMenu}
                onAction={handleMenuAction}
                onClose={() => setShowMenu(false)}
              />
            </div>
          )}
        </div>
      </div>
      <motion.div
        animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "100%" }}
        transition={{ duration: 0.3 }}
        className="max-h-[calc(100%-4rem)] overflow-y-auto"
      >
        {!isCollapsed && (
          <>
            <AnimatePresence>
              {inputState.show && !inputState.targetId && (inputState.type === "folder" || inputState.type === "request") && renderInput(inputState.type)}
            </AnimatePresence>
            {history.length === 0 && !inputState.show ? (
              <p className="text-melad-700">列表空空如也</p>
            ) : (
              history.map((item, index) => {
                const isFolder = "requests" in item;
                return isFolder ? (
                  <Folder
                    key={item.id}
                    folder={item}
                    history={history}
                    onSelectRequest={onSelectRequest}
                    onAddRequest={handleFolderAddRequest}
                    onRenameFolder={handleRenameFolder}
                    onDeleteFolder={handleDeleteFolder}
                    onRenameRequest={handleRenameRequest}
                    onDuplicateRequest={handleDuplicateRequest}
                    onDeleteRequest={handleDeleteRequest}
                    onMoveItem={handleMoveItem}
                    selectedRequest={selectedRequest}
                    inputState={inputState}
                    setInputState={setInputState}
                    onUpdateHistory={onUpdateHistory}
                  />
                ) : inputState.show && inputState.type === "renameRequest" && inputState.targetId === item.id ? (
                  <div key={item.id}>
                    {renderInput("renameRequest")}
                  </div>
                ) : (
                  <div key={item.id}>
                    <RequestItem
                      request={item}
                      index={index}
                      onSelect={onSelectRequest}
                      onRenameRequest={handleRenameRequest}
                      onDuplicateRequest={handleDuplicateRequest}
                      onDeleteRequest={handleDeleteRequest}
                      onMoveItem={handleMoveItem}
                      selectedRequest={selectedRequest}
                    />
                  </div>
                );
              })
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HistoryPanel;