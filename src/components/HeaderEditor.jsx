import { motion } from "framer-motion";
import HeaderInput from "./HeaderInput";
import { FaPlus } from "react-icons/fa"; // Import FaPlus from react-icons

const HeaderEditor = ({
  headers,
  method,
  addHeader,
  updateHeader,
  removeHeader,
  selectSuggestion,
  selectValueSuggestion,
  getKeySuggestions,
  getValueSuggestions,
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-melad-700">请求头</h3>
      <motion.button
        whileHover={{ scale: 1.2 }}
        onClick={addHeader}
        className="text-melad-500 hover:text-melad-700"
      >
        <FaPlus /> 
      </motion.button>
    </div>
    {headers.map((header, index) => (
      <HeaderInput
        key={index}
        index={index}
        header={header}
        method={method}
        updateHeader={updateHeader}
        removeHeader={removeHeader}
        selectSuggestion={selectSuggestion}
        selectValueSuggestion={selectValueSuggestion}
        getKeySuggestions={getKeySuggestions}
        getValueSuggestions={getValueSuggestions}
      />
    ))}
  </div>
);

export default HeaderEditor;