import React, { useRef, useEffect } from "react";
import AceEditor from "react-ace";

// 导入所需的模式和主题
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

// 配置 Worker 路径
ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");
ace.config.set("workerPath", "/node_modules/ace-builds/src-noconflict");

const BodyEditor = ({ method, body, setBody }) => {
  const editorRef = useRef(null);

  // 自定义补全
  const customCompleter = {
    getCompletions: (editor, session, pos, prefix, callback) => {
      const mode = editor.session.getMode().$id;
      let completions = [];

      if (mode === "ace/mode/xml") {
        completions = [
          { value: "<tag>", score: 1000, meta: "XML Tag" },
          { value: "</tag>", score: 900, meta: "Closing Tag" },
          { value: "attribute=", score: 800, meta: "Attribute" },
        ];
      } else if (mode === "ace/mode/json") {
        completions = [
          { value: '"key":', score: 1000, meta: "JSON Key" },
          { value: "true", score: 900, meta: "Boolean" },
          { value: "null", score: 800, meta: "Null" },
        ];
      }

      callback(null, completions);
    },
  };

  // 始终调用 useEffect，确保 Hook 顺序一致
  useEffect(() => {
    if (editorRef.current && method !== "GET") {
      const ace = editorRef.current.editor;
      ace.completers = [customCompleter, ...ace.completers];
    }
  }, [method]); // 添加 method 作为依赖项

  const detectMode = () => {
    if (body && body.trim()) { // 确保 body 非空
      if (body.trim().startsWith("<?xml") || body.includes("<")) {
        return "xml";
      }
      return "json";
    }
    return "json"; // 默认 JSON，避免空输入触发 XML 模式
  };

  // 如果是 GET，返回 null，但 Hook 已在上方调用
  if (method === "GET") return null;

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-lg font-semibold text-melad-700 mb-2">请求体</h3>
      <AceEditor
        mode={detectMode()}
        theme="github"
        value={body || ""}
        onChange={(newValue) => setBody(newValue)}
        name="body-editor"
        width="100%"
        height="100%"
        fontSize={14}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine={false}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          tabSize: 2,
          useSoftTabs: true,
          wrap: true,
          showLineNumbers: false,
        }}
        placeholder="输入请求体"
        className="border border-melad-200  rounded-md bg-melad-100 text-melad-700"
        editorProps={{ $blockScrolling: true }}
        ref={editorRef}
      />
    </div>
  );
};

export default BodyEditor;