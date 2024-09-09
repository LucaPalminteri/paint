import {
  Brush,
  Eraser,
  Circle,
  Square,
  Triangle,
  MousePointer,
  Move,
  MoveRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { DrawingMode } from "@/types/DrawingMode";
import ToolButton from "./ToolButton";
import { BRUSH_SIZES, COLOR_PALETTE } from "@/data/constants";

interface ToolbarProps {
  isVisible: boolean;
  drawingMode: DrawingMode;
  setDrawingMode: (mode: DrawingMode) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export function Toolbar({
  isVisible,
  drawingMode,
  setDrawingMode,
  brushSize,
  setBrushSize,
  primaryColor,
  setPrimaryColor,
  setSecondaryColor,
}: ToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background z-10 top-0 left-0 right-0 absolute mt-2 shadow-md w-fit m-auto rounded-md px-3 p-2 flex justify-center items-center space-x-2 overflow-x-auto"
    >
      <div className="flex items-center space-x-1 bg-secondary rounded-md p-1">
        <ToolButton
          isActive={drawingMode === "select"}
          onClick={() => setDrawingMode("select")}
        >
          <MousePointer className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "move"}
          onClick={() => setDrawingMode("move")}
        >
          <Move className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "brush"}
          onClick={() => setDrawingMode("brush")}
        >
          <Brush className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "eraser"}
          onClick={() => setDrawingMode("eraser")}
        >
          <Eraser className="w-4 h-4" />
        </ToolButton>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center space-x-1 bg-secondary rounded-md p-1">
        <ToolButton
          isActive={drawingMode === "circle"}
          onClick={() => setDrawingMode("circle")}
        >
          <Circle className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "square"}
          onClick={() => setDrawingMode("square")}
        >
          <Square className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "triangle"}
          onClick={() => setDrawingMode("triangle")}
        >
          <Triangle className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          isActive={drawingMode === "arrow"}
          onClick={() => setDrawingMode("arrow")}
        >
          <MoveRight className="w-4 h-4" />
        </ToolButton>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center space-x-1 bg-secondary rounded-md p-1">
        {BRUSH_SIZES.map((size) => (
          <ToolButton
            key={size}
            onClick={() => setBrushSize(size)}
            isActive={brushSize === size}
          >
            <span
              className="bg-foreground"
              style={{
                width: `${size * 2}px`,
                height: `${size}px`,
                borderRadius: `${size / 2}px`,
                backgroundColor: brushSize === size ? "#ffffff" : "#000",
              }}
            ></span>
          </ToolButton>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center space-x-1 bg-secondary rounded-md p-1 h-full">
        <div className="flex space-x-1 gap-1 px-2 h-full ">
          {COLOR_PALETTE.map((paletteColor) => (
            <motion.button
              key={paletteColor}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-5 h-5 rounded-md m-1 ${
                primaryColor === paletteColor
                  ? "ring-2 ring-offset-2 ring-primary"
                  : ""
              }`}
              style={{ backgroundColor: paletteColor }}
              onClick={() => setPrimaryColor(paletteColor)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(paletteColor);
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
