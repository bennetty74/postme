import { useEffect } from "react";
import { motion } from "framer-motion";
import HeaderEditor from "./HeaderEditor";
import BodyEditor from "./BodyEditor";

// Common headers and their value suggestions
const commonHeaders = {
  "Content-Type": ["application/json", "application/xml", "application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
  "Authorization": ["Bearer <token>", "Basic <credentials>"],
  "Accept": ["application/json", "application/xml", "text/html", "*/*"],
  "User-Agent": ["Mozilla/5.0", "Custom"],
  "Cache-Control": ["no-cache", "no-store", "max-age=0"],
};

const RequestForm = ({ onSendRequest, onSaveRequest, initialData, method, setMethod, url, setUrl, headers, setHeaders, body, setBody }) => {

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setMethod(initialData.method || "GET");
      setUrl(initialData.url || "");
      setHeaders(
        initialData.headers && Object.keys(initialData.headers).length > 0
          ? Object.entries(initialData.headers).map(([key, value]) => ({
              key,
              value,
              isCustom: !Object.keys(commonHeaders).includes(key),
              showSuggestions: false,
              showValueSuggestions: false,
            }))
          : [{ key: "", value: "", isCustom: true, showSuggestions: false, showValueSuggestions: false }]
      );
      setBody(initialData.body || "");
    }
  }, [initialData]);

  // Throttle save request data
  useEffect(() => {
    const requestData = {
      method,
      url,
      headers: headers
        .filter((h) => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
      body: method !== "GET" && body ? body : undefined,
    };

    const saveTimer = setTimeout(() => {
      if (onSaveRequest) {
        onSaveRequest(requestData);
      }
    }, 100);

    return () => clearTimeout(saveTimer);
  }, [method, url, headers, body, onSaveRequest]);

  const addHeader = () => {
    if (headers.length === 0) {
      setHeaders([
        {
          key: "Content-Type",
          value: "application/xml",
          isCustom: false,
          showSuggestions: false,
          showValueSuggestions: false,
        },
      ]);
    } else {
      setHeaders([
        ...headers,
        {
          key: "",
          value: "",
          isCustom: true,
          showSuggestions: false,
          showValueSuggestions: false,
        },
      ]);
    }
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    if (field === "key") {
      newHeaders[index].key = value;
      newHeaders[index].isCustom = !Object.keys(commonHeaders).includes(value);
      newHeaders[index].showSuggestions = value.length > 0;
      if (!newHeaders[index].isCustom && commonHeaders[value]?.length > 0) {
        newHeaders[index].value =
          method === "POST" && value === "Content-Type" ? "application/xml" : commonHeaders[value][0];
      } else if (!newHeaders[index].value) {
        newHeaders[index].value = "";
      }
    } else if (field === "value") {
      newHeaders[index].value = value;
      newHeaders[index].showValueSuggestions = value.length > 0 && !newHeaders[index].isCustom;
    }
    setHeaders(newHeaders);
  };

  const selectSuggestion = (index, selectedKey) => {
    const newHeaders = [...headers];
    newHeaders[index].key = selectedKey;
    newHeaders[index].isCustom = false;
    newHeaders[index].showSuggestions = false;
    newHeaders[index].value =
      method === "POST" && selectedKey === "Content-Type" ? "application/xml" : commonHeaders[selectedKey][0];
    newHeaders[index].showValueSuggestions = false;
    setHeaders(newHeaders);
  };

  const selectValueSuggestion = (index, selectedValue) => {
    const newHeaders = [...headers];
    newHeaders[index].value = selectedValue;
    newHeaders[index].showValueSuggestions = false;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => setHeaders(headers.filter((_, i) => i !== index));

  const getKeySuggestions = (input) => {
    if (!input) return [];
    return Object.keys(commonHeaders).filter((key) =>
      key.toLowerCase().includes(input.toLowerCase())
    );
  };

  const getValueSuggestions = (key, input) => {
    if (!input || !commonHeaders[key]) return [];
    return commonHeaders[key].filter((val) =>
      val.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 rounded-lg h-full flex flex-col"
    >
      <HeaderEditor
        headers={headers}
        method={method}
        addHeader={addHeader}
        updateHeader={updateHeader}
        removeHeader={removeHeader}
        selectSuggestion={selectSuggestion}
        selectValueSuggestion={selectValueSuggestion}
        getKeySuggestions={getKeySuggestions}
        getValueSuggestions={getValueSuggestions}
      />
      <BodyEditor method={method} body={body} setBody={setBody} />
    </motion.div>
  );
};

export default RequestForm;