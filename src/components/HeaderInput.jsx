import { motion } from "framer-motion";

const HeaderInput = ({
  index,
  header,
  updateHeader,
  removeHeader,
  selectSuggestion,
  selectValueSuggestion,
  getKeySuggestions,
  getValueSuggestions,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex space-x-2 mb-2 relative"
  >
    {/* Key Input with Suggestions */}
    <div className="flex-1 relative">
      <input
        type="text"
        value={header.key}
        onChange={(e) => updateHeader(index, "key", e.target.value)}
        placeholder="Key"
        className="w-full p-2 bg-melad-100 border border-melad-200 text-melad-700 rounded-md focus:outline-none"
      />
      {header.showSuggestions && getKeySuggestions(header.key).length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-melad-100 border border-melad-300 rounded-md shadow-lg p-1 z-10">
          {getKeySuggestions(header.key).map((suggestion) => (
            <div
              key={suggestion}
              onClick={() => selectSuggestion(index, suggestion)}
              className="p-2 text-melad-700 bg-melad-100 hover:bg-melad-200 cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Value Input with Suggestions */}
    <div className="flex-1 relative">
      <input
        type="text"
        value={header.value}
        onChange={(e) => updateHeader(index, "value", e.target.value)}
        placeholder="Value"
        className="w-full p-2 bg-melad-100 border border-melad-200 text-melad-700 rounded-md focus:outline-none"
      />
      {header.showValueSuggestions && getValueSuggestions(header.key, header.value).length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-melad-100 border border-melad-300 rounded-md shadow-lg p-1 z-10">
          {getValueSuggestions(header.key, header.value).map((suggestion) => (
            <div
              key={suggestion}
              onClick={() => selectValueSuggestion(index, suggestion)}
              className="p-2 text-melad-700 bg-melad-100 hover:bg-melad-200 cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>

    <motion.button
      whileHover={{ scale: 1.2 }}
      onClick={() => removeHeader(index)}
      className="p-2 text-melad-700 hover:text-red-600"
    >
      ✕
    </motion.button>
  </motion.div>
);

export default HeaderInput;