import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ZoomControlsProps {
  transform: { scale: number };
  setTransform: (transform: { x: number; y: number; scale: number }) => void;
}

export function ZoomControls({ transform, setTransform }: ZoomControlsProps) {
  const resetZoom = () => {
    setTransform((prev) => ({ ...prev, scale: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute bottom-2 left-2 z-10 bg-background rounded-md shadow-md p-1 flex items-center space-x-1"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setTransform((prev) => ({ ...prev, scale: prev.scale * 1.1 }))
        }
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetZoom}
        className="text-sm font-medium w-16 text-center bg-secondary hover:bg-secondary-hover rounded-md px-2 py-1"
      >
        {Math.round(transform.scale * 100)}%
      </motion.button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setTransform((prev) => ({ ...prev, scale: prev.scale * 0.9 }))
        }
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
