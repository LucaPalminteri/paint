import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface ToolButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  isActive,
  onClick,
  children,
}) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <Button
      variant={isActive ? "default" : "secondary"}
      onClick={onClick}
      size="icon"
      className={`w-8 h-8 transition-all duration-200 ease-in-out ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary-hover"
      }`}
    >
      {children}
    </Button>
  </motion.div>
);

export default ToolButton;
