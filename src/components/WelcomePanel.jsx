import { motion } from "framer-motion";
import Lottie from "lottie-react";
import welcomeAnimation from "../assets/json/welcome.json"; 


const WelcomePanel = () => {
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center rounded-lg p-6 text-center">
      {/* Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-60 h-60 mb-10" 
      >
        <Lottie animationData={welcomeAnimation} loop={true} />
      </motion.div>

      {/* Animated Text */}
      <motion.h2
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl font-semibold text-melad-700 mb-4"
      >
        欢迎使用Postme
      </motion.h2>

      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }} // Slight delay for staggered effect
        className="text-melad-500 mb-4"
      >
       点击左边的历史记录发送请求或创建请求以开始探索
      </motion.p>
    </div>
  );
};

export default WelcomePanel;