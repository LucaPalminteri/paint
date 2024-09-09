import { useState, useEffect, useRef } from "react";
import { DrawingMode } from "@/types/DrawingMode";

export function useCanvasState() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(5);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("brush");
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [showGrid, setShowGrid] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isVisible, setIsVisible] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    setIsVisible(true);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      tempCanvasRef.current = document.createElement("canvas");
      tempCanvasRef.current.width = canvas.width;
      tempCanvasRef.current.height = canvas.height;

      gridCanvasRef.current = document.createElement("canvas");
      gridCanvasRef.current.width = canvas.width;
      gridCanvasRef.current.height = canvas.height;
      gridCanvasRef.current.style.position = "absolute";
      gridCanvasRef.current.style.pointerEvents = "none";
      canvas.parentElement?.appendChild(gridCanvasRef.current);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  const handleResize = () => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const gridCanvas = gridCanvasRef.current;
    if (canvas && tempCanvas && gridCanvas) {
      const imageData = canvas
        .getContext("2d")
        ?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      gridCanvas.width = canvas.width;
      gridCanvas.height = canvas.height;
      canvas.getContext("2d")?.putImageData(imageData!, 0, 0);
    }
  };

  return {
    canvasRef,
    tempCanvasRef,
    gridCanvasRef,
    isDrawing,
    setIsDrawing,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    brushSize,
    setBrushSize,
    drawingMode,
    setDrawingMode,
    shapeStart,
    setShapeStart,
    selection,
    setSelection,
    isMoving,
    setIsMoving,
    moveStart,
    setMoveStart,
    showGrid,
    setShowGrid,
    backgroundColor,
    setBackgroundColor,
    isVisible,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    transform,
    setTransform,
  };
}
