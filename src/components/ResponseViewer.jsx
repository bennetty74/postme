import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AceEditor from "react-ace";

// 导入所需的模式和主题
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-monokai";

const ResponseViewer = ({ response }) => {
  const editorRef = useRef(null);

  // 检测响应内容的格式
  const detectMode = () => {
    if (response && response.trim()) {
      if (response.trim().startsWith("<?xml") || response.includes("<")) {
        return "xml";
      }
      try {
        JSON.parse(response); // 尝试解析 JSON
        return "json";
      } catch {
        return "text"; // 如果不是 JSON 或 XML，当作纯文本
      }
    }
    return "text"; // 默认纯文本
  };

  // 美化响应内容（可选）
  const formatResponse = () => {
    if (!response || !response.trim()) return response || "";
    const mode = detectMode();
    if (mode === "json") {
      try {
        return JSON.stringify(JSON.parse(response), null, 2); // 美化 JSON
      } catch {
        return response; // 解析失败，返回原始内容
      }
    }
    return response; // XML 或文本保持不变
  };

  // 初始化编辑器为只读模式
  useEffect(() => {
    if (editorRef.current) {
      const aceEditor = editorRef.current.editor;
      aceEditor.setReadOnly(true); // 设置为只读
    }
  }, [response]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg shadow-md h-full flex flex-col p-4"
    >
      <div className="flex-1 bg-melad-100 rounded-md">
        <AceEditor
          mode={detectMode()} // 动态检测模式
          theme="github" // 可替换为其他主题
          value={formatResponse()} // 美化后的内容
          name="response-viewer"
          width="100%"
          height="100%" // 充满容器
          fontSize={14}
          showPrintMargin={false}
          showGutter={false} // 显示行号
          highlightActiveLine={false} // 不高亮当前行（只读模式）
          setOptions={{
            readOnly: false, // 只读
            useWorker: false, // 禁用 Worker，避免加载问题
            tabSize: 2,
            wrap: true, // 自动换行
            showLineNumbers: true,
          }}
          className="h-full w-full text-melad-700 bg-melad-100 rounded-md"
          editorProps={{ $blockScrolling: true }}
          ref={editorRef}
        />
      </div>
    </motion.div>
  );
};

export default ResponseViewer;