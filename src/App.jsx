import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import HistoryPanel from "./components/HistoryPanel";
import TitleBar from "./components/TitleBar";
import WelcomePanel from "./components/WelcomePanel"; // Import the new component
import UrlInput from "./components/UrlInput";
import MethodSelector from "./components/MethodSelector";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

function App() {
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false); // 新增发送状态
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "", isCustom: true, showSuggestions: false, showValueSuggestions: false }]);
  const [body, setBody] = useState("");


  useEffect(() => {
    const loadHistory = async () => {
      const loadedHistory = await window.electronAPI.loadHistory();
      setHistory(loadedHistory || []);
    };
    loadHistory();
  }, []);

  const sendRequest = async (requestData) => {
    try {
      const result = await window.electronAPI.sendRequest(requestData);
      if (result.success) {
        setResponse(result.data);
  
        if (selectedRequest) {
          setHistory((prevHistory) => {
            let newHistory = prevHistory.map((item) => {
              if (item.id === selectedRequest?.id && !item.requests) {
                return {
                  ...item,
                  ...requestData, // Sync method, url, headers, body
                  response: result.data,
                  timestamp: new Date().toLocaleString(),
                };
              }
              if (item.requests) {
                return {
                  ...item,
                  requests: item.requests.map((req) =>
                    req.id === selectedRequest?.id
                      ? {
                          ...req,
                          ...requestData, // Sync method, url, headers, body
                          response: result.data,
                          timestamp: new Date().toLocaleString(),
                        }
                      : req
                  ),
                };
              }
              return item;
            });
            window.electronAPI.saveHistory(newHistory);
            return newHistory;
          });
          setSelectedRequest((prev) => ({
            ...prev,
            ...requestData, // Sync method, url, headers, body
            response: result.data,
            timestamp: new Date().toLocaleString(),
          }));
        }
      } else {
        setResponse(`Error: ${result.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  const handleSelectHistory = (req) => {
    setSelectedRequest(req);
    setResponse(req.response);
  };

  const handleAddFolder = async (newFolder) => {
    const newHistory = [...history, newFolder];
    setHistory(newHistory);
    await window.electronAPI.saveHistory(newHistory);
  };

  const handleAddRequest = async (folderId, newRequest) => {
    let newHistory;
    if (folderId) {
      newHistory = history.map((item) =>
        item.id === folderId && item.requests
          ? { ...item, requests: [newRequest, ...item.requests] }
          : item
      );
    } else {
      newHistory = [newRequest, ...history];
    }
    setHistory(newHistory);
    setSelectedRequest(newRequest);
    await window.electronAPI.saveHistory(newHistory);
  };

  const handleSaveRequest = async (requestData) => {
    // console.log("Saving request:", requestData);
    setHistory((prevHistory) => {
      let newHistory = prevHistory.map((item) => {
        if (item.id === selectedRequest?.id && !item.requests) {
          return { ...item, ...requestData };
        }
        if (item.requests) {
          return {
            ...item,
            requests: item.requests.map((req) =>
              req.id === selectedRequest?.id ? { ...req, ...requestData } : req
            ),
          };
        }
        return item;
      });
      window.electronAPI.saveHistory(newHistory);
      return newHistory;
    });
  };

  const handleUpdateHistory = async (newHistory) => {
    setHistory(newHistory);
    await window.electronAPI.saveHistory(newHistory);
  };


  const handleSend1 = async () => {
    const requestData = {
      method,
      url,
      headers: headers
        .filter((h) => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
      body: method !== "GET" && body ? body : undefined,
    };
    console.log("send", requestData);
  
    setIsSending(true); // 开始发送，触发动画
  
    try {
      // 模拟发送请求并返回 SOAP 响应
      const mockResponse = await new Promise((resolve) => {
        setTimeout(() => {
          const soapResponse = `<?xml version="1.0" encoding="UTF-8"?><soap:Envelope 
      xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
      xmlns:ns="http://example.com/user-service">
      <soap:Body> <ns:GetUserDetailsResponse> <ns:User><ns:UserId>12345</ns:UserId><ns:FirstName>John</ns:FirstName><ns:LastName>Doe</ns:LastName>
                  <ns:Email>john.doe@example.com</ns:Email></ns:User></ns:GetUserDetailsResponse><ns:GetUserDetailsResponse> <ns:User><ns:UserId>12345</ns:UserId><ns:FirstName>John</ns:FirstName><ns:LastName>Doe</ns:LastName>
                  <ns:Email>john.doe@example.com</ns:Email></ns:User></ns:GetUserDetailsResponse><ns:GetUserDetailsResponse> <ns:User><ns:UserId>12345</ns:UserId><ns:FirstName>John</ns:FirstName><ns:LastName>Doe</ns:LastName>
                  <ns:Email>john.doe@example.com</ns:Email></ns:User></ns:GetUserDetailsResponse><ns:GetUserDetailsResponse> <ns:User><ns:UserId>12345</ns:UserId><ns:FirstName>John</ns:FirstName><ns:LastName>Doe</ns:LastName>
                  <ns:Email>john.doe@example.com</ns:Email></ns:User></ns:GetUserDetailsResponse></soap:Body></soap:Envelope>`;
          resolve({ data: soapResponse }); // 模拟返回的数据结构
          setResponse(soapResponse);
        }, 1000); // 模拟 1 秒的延迟
      });
  
      // 调用 onSendRequest（假设它处理返回的数据）
      // await onSendRequest({ ...requestData, response: mockResponse.data });
    } catch (error) {
      console.error("Mock request failed:", error);
    } finally {
      setIsSending(false); // 请求完成，结束动画
    }
  };

  const handleSend = async () => {
    const requestData = {
      method,
      url,
      headers: headers
        .filter((h) => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
      body: method !== "GET" && body ? body : undefined,
    };
    console.log("send", requestData);

    setIsSending(true); // 开始发送，触发动画
    try {
      await sendRequest(requestData); // 假设 onSendRequest 返回 Promise
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsSending(false); // 请求完成，结束动画
    }
  };

  const handleMinimize = () => window.electronAPI.minimizeWindow();
  const handleMaximize = () => window.electronAPI.maximizeWindow();
  const handleClose = () => window.electronAPI.closeWindow();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-melad-100 overflow-hidden"
    >
      <TitleBar
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
      />
      <motion.button
        whileHover={{ scale: 1.2 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="rounded-full shadow-lg w-8 h-8 absolute bottom-2 left-2 text-melad-500 hover:text-melad-700 z-50 flex items-center justify-center"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </motion.button>
      <div className="flex-1 flex p-2 space-x-6 overflow-hidden relative">
        <HistoryPanel
          history={history}
          onSelectRequest={handleSelectHistory}
          onAddFolder={handleAddFolder}
          onAddRequest={handleAddRequest}
          onUpdateHistory={handleUpdateHistory}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          selectedRequest={selectedRequest}
        />
        <div className="flex-1 h-full overflow-hidden">
          {selectedRequest ? (
            <div className="h-full w-full">
              <div className="flex flex-row space-x-1 px-4">
                <MethodSelector method={method} setMethod={setMethod} />
                <UrlInput url={url} setUrl={setUrl} handleSend={handleSend} isSending={isSending} />
              </div>
              <div className="grid grid-cols-2 gap-1 h-full">
              <div className="flex flex-col h-full">
                <RequestForm
                  onSendRequest={sendRequest}
                  initialData={selectedRequest}
                  onSaveRequest={handleSaveRequest}
                  url={url}
                  setUrl={setUrl}
                  headers={headers}
                  setHeaders={setHeaders}
                  body={body}
                  setBody={setBody}
                  method={method}
                  setMethod={setMethod}
                />
              </div>
              <div className="flex flex-col h-full overflow-y-auto">
                <ResponseViewer response={response} />
              </div>
            </div>
            </div>
          ) : (
            <WelcomePanel />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default App;