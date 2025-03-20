import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const MethodSelector = ({ method, setMethod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-20"> {/* Increased width */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-melad-200 text-melad-700 rounded-md focus:outline-none w-full text-left"
      >
        {method}
      </motion.button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-1 w-full bg-melad-200 border border-melad-300 rounded-md shadow-lg z-10"
        >
          {methods.map((m) => (
            <div
              key={m}
              onClick={() => {
                setMethod(m);
                setIsOpen(false);
              }}
              className="p-2 text-melad-700 hover:bg-melad-300 cursor-pointer"
            >
              {m}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MethodSelector;