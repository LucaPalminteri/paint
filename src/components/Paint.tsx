"use client";
import Menu from "./Menu";
import { ZoomControls } from "./ZoomControls";
import { Toolbar } from "./Toolbar";
import GridCanvas from "./GridCanvas";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useDrawingOperations } from "@/hooks/useDrawingOperations";

export default function WebPaint() {
  const canvasState = useCanvasState();
  const {
    canvasRef,
    isVisible,
    drawingMode,
    setDrawingMode,
    brushSize,
    setBrushSize,
    primaryColor,
    setPrimaryColor,
    setBackgroundColor,
    setSecondaryColor,
    setShowGrid,
    showGrid,
    backgroundColor,
    transform,
    setTransform,
  } = canvasState;

  const { startDrawing, draw, stopDrawing } = useDrawingOperations(canvasState);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas!.width, canvas!.height);
    }
    canvasState.setSelection(null);
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

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoom = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = transform.scale * zoom;

      const newX = transform.x - (mouseX - transform.x) * (zoom - 1);
      const newY = transform.y - (mouseY - transform.y) * (zoom - 1);

      setTransform({ x: newX, y: newY, scale: newScale });
    }
  };

  return (
    <div className="relative h-screen flex flex-col select-none">
      <Toolbar
        isVisible={isVisible}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        setSecondaryColor={setSecondaryColor}
      />
      <div className="relative flex-grow">
        <Menu
          clearCanvas={clearCanvas}
          saveCanvas={saveCanvas}
          setCanvasBackground={setBackgroundColor}
        />
        <GridCanvas setShowGrid={setShowGrid} showGrid={showGrid} />
        <ZoomControls transform={transform} setTransform={setTransform} />
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute top-0 left-0 cursor-crosshair"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
}
