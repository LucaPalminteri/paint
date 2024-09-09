import { useCallback } from "react";
import { useCanvasState } from "./useCanvasState";

export function useDrawingOperations(
  canvasState: ReturnType<typeof useCanvasState>,
) {
  const {
    canvasRef,
    tempCanvasRef,
    isDrawing,
    setIsDrawing,
    primaryColor,
    secondaryColor,
    brushSize,
    drawingMode,
    shapeStart,
    setShapeStart,
    selection,
    setSelection,
    isMoving,
    setIsMoving,
    moveStart,
    setMoveStart,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    transform,
    setTransform,
  } = canvasState;

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context) {
        const rect = canvas!.getBoundingClientRect();
        const x = (e.clientX - rect.left - transform.x) / transform.scale;
        const y = (e.clientY - rect.top - transform.y) / transform.scale;

        if (e.buttons === 4) {
          setIsPanning(true);
          setPanStart({ x: e.clientX, y: e.clientY });
        } else if (drawingMode === "select" || drawingMode === "move") {
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
    },
    [
      canvasRef,
      drawingMode,
      selection,
      transform,
      setIsPanning,
      setPanStart,
      setIsMoving,
      setMoveStart,
      setSelection,
      setShapeStart,
      setIsDrawing,
    ],
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isPanning) {
        if (panStart) {
          const dx = e.clientX - panStart.x;
          const dy = e.clientY - panStart.y;
          setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
          setPanStart({ x: e.clientX, y: e.clientY });
        }
        return;
      }

      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const tempCanvas = tempCanvasRef.current;
      const tempContext = tempCanvas?.getContext("2d");
      if (context && tempContext && canvas && tempCanvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - transform.x) / transform.scale;
        const y = (e.clientY - rect.top - transform.y) / transform.scale;

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
          context.lineWidth = brushSize / transform.scale;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.stroke();
        } else if (shapeStart) {
          drawShape(x, y, e.buttons, tempContext, canvas, context);
        }
      }
      drawSelection();
    },
    [
      isPanning,
      panStart,
      isDrawing,
      canvasRef,
      tempCanvasRef,
      drawingMode,
      selection,
      isMoving,
      moveStart,
      primaryColor,
      secondaryColor,
      brushSize,
      transform,
      shapeStart,
      setTransform,
      setPanStart,
      setMoveStart,
      setSelection,
    ],
  );

  const stopDrawing = useCallback(() => {
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
    setIsPanning(false);
    setPanStart(null);
  }, [
    isDrawing,
    shapeStart,
    canvasRef,
    tempCanvasRef,
    setIsDrawing,
    setShapeStart,
    setIsMoving,
    setMoveStart,
    setIsPanning,
    setPanStart,
  ]);

  const drawShape = useCallback(
    (
      x: number,
      y: number,
      buttons: number,
      tempContext: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
    ) => {
      const width = x - shapeStart!.x;
      const height = y - shapeStart!.y;

      tempContext.clearRect(0, 0, canvas.width, canvas.height);
      tempContext.drawImage(canvas, 0, 0);

      tempContext.beginPath();
      tempContext.strokeStyle = buttons === 1 ? primaryColor : secondaryColor;
      tempContext.lineWidth = brushSize / transform.scale;

      switch (drawingMode) {
        case "circle":
          const radius = Math.sqrt(width * width + height * height) / 2;
          tempContext.arc(
            shapeStart!.x + width / 2,
            shapeStart!.y + height / 2,
            radius,
            0,
            2 * Math.PI,
          );
          break;
        case "square":
          tempContext.rect(shapeStart!.x, shapeStart!.y, width, height);
          break;
        case "triangle":
          tempContext.moveTo(shapeStart!.x, shapeStart!.y + height);
          tempContext.lineTo(shapeStart!.x + width / 2, shapeStart!.y);
          tempContext.lineTo(shapeStart!.x + width, shapeStart!.y + height);
          tempContext.closePath();
          break;
        case "arrow":
          const headlen = 10 / transform.scale;
          const angle = Math.atan2(height, width);
          tempContext.moveTo(shapeStart!.x, shapeStart!.y);
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

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(canvas, 0, 0);
    },
    [
      shapeStart,
      primaryColor,
      secondaryColor,
      brushSize,
      transform.scale,
      drawingMode,
    ],
  );

  const drawSelection = useCallback(() => {
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
  }, [canvasRef, selection]);

  const moveSelection = useCallback(
    (dx: number, dy: number) => {
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
    },
    [canvasRef, selection, setSelection],
  );

  return {
    startDrawing,
    draw,
    stopDrawing,
    drawSelection,
    moveSelection,
  };
}

function isPointInSelection(
  x: number,
  y: number,
  sel: { x: number; y: number; width: number; height: number },
) {
  return (
    x >= sel.x &&
    x <= sel.x + sel.width &&
    y >= sel.y &&
    y <= sel.y + sel.height
  );
}
