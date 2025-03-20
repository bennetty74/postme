import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa"; // 引入旋转图标

const UrlInput = ({ url, setUrl, handleSend, isSending }) => (
  <div className="flex space-x-2 flex-1">
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="输入请求URL"
      className="flex-1 p-2 bg-melad-200 text-melad-700 rounded-md focus:outline-none"
      disabled={isSending} // 发送时禁用输入框
    />


    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSend}
      className={`p-2  px-4 rounded-md transition flex items-center justify-center ${
        isSending ? "bg-melad-300 cursor-not-allowed" : "bg-melad-500 text-white"
      }`}
      disabled={isSending} // 发送时禁用按钮
    >
      {isSending ? (
        <motion.span
          animate={{ rotate: 360 }} // 旋转动画
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner />
        </motion.span>
      ) : (
        "发送"
      )}
    </motion.button>
  </div>
);

export default UrlInput;