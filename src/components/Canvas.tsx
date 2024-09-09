import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Grid } from "lucide-react";
import { DrawingMode } from "@/types/DrawingMode";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tempCanvasRef: React.RefObject<HTMLCanvasElement>;
  gridCanvasRef: React.RefObject<HTMLCanvasElement>;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  drawingMode: DrawingMode;
  showGrid: boolean;
  selection: { x: number; y: number; width: number; height: number } | null;
  setSelection: (
    selection: { x: number; y: number; width: number; height: number } | null,
  ) => void;
  clipboard: ImageData | null;
  setClipboard: (data: ImageData | null) => void;
}

export default function Canvas({
  canvasRef,
  tempCanvasRef,
  gridCanvasRef,
  primaryColor,
  secondaryColor,
  brushSize,
  drawingMode,
  showGrid,
  selection,
  setSelection,
  clipboard,
  setClipboard,
}: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60; // Subtracting toolbar height

      // Create temporary canvas
      tempCanvasRef.current = document.createElement("canvas");
      tempCanvasRef.current.width = canvas.width;
      tempCanvasRef.current.height = canvas.height;

      // Create grid canvas
      gridCanvasRef.current = document.createElement("canvas");
      gridCanvasRef.current.width = canvas.width;
      gridCanvasRef.current.height = canvas.height;
      gridCanvasRef.current.style.position = "absolute";
      gridCanvasRef.current.style.pointerEvents = "none";
      canvas.parentElement?.appendChild(gridCanvasRef.current);

      drawGrid();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    drawGrid();
  }, [showGrid]);

  // ... (implement the canvas drawing logic)
  // const drawGrid = () => {
    const gridCanvas = gridCanvasRef.current;
    const context = gridCanvas?.getContext("2d");
    if (context && gridCanvas) {
      context.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      if (showGrid) {
        context.strokeStyle = "#ddd";
        context.lineWidth = 1;
        const gridSize = 20;
        for (let x = 0; x <= gridCanvas.width; x += gridSize) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, gridCanvas.height);
          context.stroke();
        }
        for (let y = 0; y <= gridCanvas.height; y += gridSize) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(gridCanvas.width, y);
          context.stroke();
        }
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (drawingMode === "select" || drawingMode === "move") {
        if (selection && isPointInSelection(x, y, selection)) {
          setIsMoving(true);
          setMoveStart({ x, y });
        } else if (drawingMode === "select") {
          setSelection({ x, y, width: 0, height: 0 });
        }
      } else if (drawingMode === "brush" || drawingMode === "eraser") {
        context.beginPath();
        context.moveTo(x, y);
      } else {
        setShapeStart({ x, y });
      }
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const tempCanvas = tempCanvasRef.current;
    const tempContext = tempCanvas?.getContext("2d");
    if (context && tempContext && canvas && tempCanvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (drawingMode === "select" || drawingMode === "move") {
        if (isMoving && selection && moveStart) {
          const dx = x - moveStart.x;
          const dy = y - moveStart.y;
          moveSelection(dx, dy);
          setMoveStart({ x, y });
        } else if (drawingMode === "select" && selection) {
          setSelection((prev) =>
            prev ? { ...prev, width: x - prev.x, height: y - prev.y } : null,
          );
        }
      } else if (drawingMode === "brush" || drawingMode === "eraser") {
        context.lineTo(x, y);
        context.strokeStyle =
          drawingMode === "eraser"
            ? "#FFFFFF"
            : e.buttons === 1
              ? primaryColor
              : secondaryColor;
        context.lineWidth = brushSize;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
      } else if (shapeStart) {
        const width = x - shapeStart.x;
        const height = y - shapeStart.y;

        // Clear the temporary canvas
        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Copy the main canvas content to the temporary canvas
        tempContext.drawImage(canvas, 0, 0);

        // Draw the shape preview on the temporary canvas
        tempContext.beginPath();
        tempContext.strokeStyle =
          e.buttons === 1 ? primaryColor : secondaryColor;
        tempContext.lineWidth = brushSize;

        switch (drawingMode) {
          case "circle":
            const radius = Math.sqrt(width * width + height * height) / 2;
            tempContext.arc(
              shapeStart.x + width / 2,
              shapeStart.y + height / 2,
              radius,
              0,
              2 * Math.PI,
            );
            break;
          case "square":
            tempContext.rect(shapeStart.x, shapeStart.y, width, height);
            break;
          case "triangle":
            tempContext.moveTo(shapeStart.x, shapeStart.y + height);
            tempContext.lineTo(shapeStart.x + width / 2, shapeStart.y);
            tempContext.lineTo(shapeStart.x + width, shapeStart.y + height);
            tempContext.closePath();
            break;
          case "arrow":
            const headlen = 10;
            const angle = Math.atan2(height, width);
            tempContext.moveTo(shapeStart.x, shapeStart.y);
            tempContext.lineTo(x, y);
            tempContext.moveTo(x, y);
            tempContext.lineTo(
              x - headlen * Math.cos(angle - Math.PI / 6),
              y - headlen * Math.sin(angle - Math.PI / 6),
            );
            tempContext.moveTo(x, y);
            tempContext.lineTo(
              x - headlen * Math.cos(angle + Math.PI / 6),
              y - headlen * Math.sin(angle + Math.PI / 6),
            );
            break;
        }

        tempContext.stroke();

        // Clear the main canvas and draw the temporary canvas content
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(tempCanvas, 0, 0);
      }
    }
    drawSelection();
  };

  const stopDrawing = () => {
    if (isDrawing && shapeStart) {
      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      if (canvas && tempCanvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(tempCanvas, 0, 0);
        }
      }
    }
    setIsDrawing(false);
    setShapeStart(null);
    setIsMoving(false);
    setMoveStart(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas!.width, canvas!.height);
    }
    setSelection(null);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "webpaint.png";
      link.href = dataURL;
      link.click();
    }
  };

  const isPointInSelection = (
    x: number,
    y: number,
    sel: { x: number; y: number; width: number; height: number },
  ) => {
    return (
      x >= sel.x &&
      x <= sel.x + sel.width &&
      y >= sel.y &&
      y <= sel.y + sel.height
    );
  };

  // const handleBackgroundColorChange = (color: string) => {
  //   setBackgroundColor(color);
  // };

  const drawSelection = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context && selection) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas!.width;
      tempCanvas.height = canvas!.height;
      const tempContext = tempCanvas.getContext("2d");

      if (tempContext) {
        tempContext.drawImage(canvas!, 0, 0);
        tempContext.setLineDash([5, 5]);
        tempContext.strokeStyle = "blue";
        tempContext.lineWidth = 1;
        tempContext.strokeRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        );

        context.clearRect(0, 0, canvas!.width, canvas!.height);
        context.drawImage(tempCanvas, 0, 0);
      }
    }
  };

  const copySelection = () => {
    if (selection) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        const imageData = context.getImageData(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        );
        setClipboard(imageData);
      }
    }
  };

  const cutSelection = () => {
    copySelection();
    if (selection) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        context.clearRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        );
      }
    }
  };

  const pasteSelection = () => {
    if (clipboard && selection) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        context.putImageData(clipboard, selection.x, selection.y);
      }
    }
  };

  const moveSelection = (dx: number, dy: number) => {
    if (selection) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        const imageData = context.getImageData(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        );
        context.clearRect(
          selection.x,
          selection.y,
          selection.width,
          selection.height,
        );
        context.putImageData(imageData, selection.x + dx, selection.y + dy);
        setSelection((prev) =>
          prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null,
        );
      }
    }
  };

  return (
    <div className="relative flex-grow">
      <div className="absolute bottom-2 right-2 z-10 p-2">
        <Button
          variant={showGrid ? "secondary" : "outline"}
          onClick={() => setShowGrid(!showGrid)}
          className="p-2"
        >
          <Grid className="w-4 h-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute top-0 left-0 cursor-crosshair"
      />
    </div>
  );
}
