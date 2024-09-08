"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brush,
  Eraser,
  Circle,
  Square,
  Triangle,
  ArrowRight,
  Download,
  Trash2,
  MousePointer,
  Copy,
  Scissors,
  Move,
  Clipboard,
  Grid,
} from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";

const BRUSH_SIZES = [2, 5, 10, 20, 30];
const COLOR_PALETTE = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#C0C0C0",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
];

type DrawingMode = "brush" | "eraser" | "circle" | "square" | "triangle" | "arrow" | "select" | "move";

export default function WebPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(5);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("brush");
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<ImageData | null>(null);
  const [showGrid, setShowGrid] = useState(false);

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

  const handleResize = () => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const gridCanvas = gridCanvasRef.current;
    if (canvas && tempCanvas && gridCanvas) {
      const imageData = canvas.getContext("2d")?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60;
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      gridCanvas.width = canvas.width;
      gridCanvas.height = canvas.height;
      canvas.getContext("2d")?.putImageData(imageData!, 0, 0);
      drawGrid();
    }
  };

  const drawGrid = () => {
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
          setSelection((prev) => (prev ? { ...prev, width: x - prev.x, height: y - prev.y } : null));
        }
      } else if (drawingMode === "brush" || drawingMode === "eraser") {
        context.lineTo(x, y);
        context.strokeStyle = drawingMode === "eraser" ? "#FFFFFF" : e.buttons === 1 ? primaryColor : secondaryColor;
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
        tempContext.strokeStyle = e.buttons === 1 ? primaryColor : secondaryColor;
        tempContext.lineWidth = brushSize;

        switch (drawingMode) {
          case "circle":
            const radius = Math.sqrt(width * width + height * height) / 2;
            tempContext.arc(shapeStart.x + width / 2, shapeStart.y + height / 2, radius, 0, 2 * Math.PI);
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
              y - headlen * Math.sin(angle - Math.PI / 6)
            );
            tempContext.moveTo(x, y);
            tempContext.lineTo(
              x - headlen * Math.cos(angle + Math.PI / 6),
              y - headlen * Math.sin(angle + Math.PI / 6)
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

  const isPointInSelection = (x: number, y: number, sel: { x: number; y: number; width: number; height: number }) => {
    return x >= sel.x && x <= sel.x + sel.width && y >= sel.y && y <= sel.y + sel.height;
  };

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
        tempContext.strokeRect(selection.x, selection.y, selection.width, selection.height);

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
        const imageData = context.getImageData(selection.x, selection.y, selection.width, selection.height);
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
        context.clearRect(selection.x, selection.y, selection.width, selection.height);
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
        const imageData = context.getImageData(selection.x, selection.y, selection.width, selection.height);
        context.clearRect(selection.x, selection.y, selection.width, selection.height);
        context.putImageData(imageData, selection.x + dx, selection.y + dy);
        setSelection((prev) => (prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null));
      }
    }
  };

  return (
    <div className="h-screen flex flex-col select-none">
      <div className="bg-gray-100 p-2 flex justify-between items-center space-x-4 overflow-x-auto">
        <div className="flex items-center space-x-4">
          <Image
            src="/Microsoft_Paint.png"
            width={2048}
            height={2048}
            alt="Paint logo"
            priority
            className="h-10 w-10"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant={drawingMode === "select" ? "secondary" : "outline"} onClick={() => setDrawingMode("select")}>
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button variant={drawingMode === "move" ? "secondary" : "outline"} onClick={() => setDrawingMode("move")}>
            <Move className="w-4 h-4" />
          </Button>
          <Button variant={drawingMode === "brush" ? "secondary" : "outline"} onClick={() => setDrawingMode("brush")}>
            <Brush className="w-4 h-4 " />
          </Button>
          <Button variant={drawingMode === "eraser" ? "secondary" : "outline"} onClick={() => setDrawingMode("eraser")}>
            <Eraser className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-12" />

          <div className="flex items-center space-x-2">
            <Select onValueChange={(value) => setBrushSize(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue
                  placeholder={
                    <div className="flex justify-start items-center gap-2">
                      <div style={{ height: `${2}px`, width: "30px", backgroundColor: "black" }}></div>
                      <span>{2}px</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {BRUSH_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    <div className="flex justify-start items-center gap-2">
                      <div style={{ height: `${size}px`, width: "30px", backgroundColor: "black" }}></div>
                      <span>{size}px</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-12" />

          <div className="flex flex-col">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-6 h-6"
            />
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-6 h-6"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex space-x-1 gap-1">
              {COLOR_PALETTE.slice(0, Math.ceil(COLOR_PALETTE.length / 2)).map((paletteColor) => (
                <button
                  key={paletteColor}
                  className={`w-5 h-5 rounded-full ${
                    primaryColor === paletteColor ? "ring-1 ring-offset-1 ring-blue-500" : ""
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
            <div className="flex space-x-1 gap-1">
              {COLOR_PALETTE.slice(Math.ceil(COLOR_PALETTE.length / 2)).map((paletteColor) => (
                <button
                  key={paletteColor}
                  className={`w-5 h-5 rounded-full ${
                    primaryColor === paletteColor ? "ring-1 ring-offset-1 ring-blue-500" : ""
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
          <Separator orientation="vertical" className="h-12" />

          <Button variant={drawingMode === "circle" ? "secondary" : "outline"} onClick={() => setDrawingMode("circle")}>
            <Circle className="w-4 h-4" />
          </Button>
          <Button variant={drawingMode === "square" ? "secondary" : "outline"} onClick={() => setDrawingMode("square")}>
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={drawingMode === "triangle" ? "secondary" : "outline"}
            onClick={() => setDrawingMode("triangle")}
          >
            <Triangle className="w-4 h-4" />
          </Button>
          <Button variant={drawingMode === "arrow" ? "secondary" : "outline"} onClick={() => setDrawingMode("arrow")}>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-12" />

          <Button onClick={copySelection} disabled={!selection}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button onClick={cutSelection} disabled={!selection}>
            <Scissors className="w-4 h-4" />
          </Button>
          <Button onClick={pasteSelection} disabled={!clipboard || !selection}>
            <Clipboard className="w-4 h-4" />
          </Button>

          <Button variant={showGrid ? "secondary" : "outline"} onClick={() => setShowGrid(!showGrid)}>
            <Grid className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={clearCanvas} className="bg-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={saveCanvas} className="bg-green-500">
            <Download className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="relative flex-grow">
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
    </div>
  );
}
