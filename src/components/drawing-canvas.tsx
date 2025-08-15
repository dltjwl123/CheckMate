"use clinet";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface DrawingCanvasProps {
  initialDrawingData?: string; // Base64 string
  onDrawingChange: (dataUrl: string) => void;
  width: number;
  height: number;
  isActive: boolean;
  drawingTool: "pen" | "eraser";
  penColor: string;
  penThickness: number;
}

export function DrawingCanvas({
  initialDrawingData,
  onDrawingChange,
  width,
  height,
  isActive,
  drawingTool,
  penColor,
  penThickness,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const currentDrawingDataRef = useRef<string | undefined>(initialDrawingData);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }
      setCtx(context);

      if (!initialDrawingData) {
        if (currentDrawingDataRef.current) {
          currentDrawingDataRef.current = undefined;
        }
        return;
      }
      let data: string = initialDrawingData;
      if (initialDrawingData.startsWith("https://")) {
        const url = new URL(initialDrawingData);
        const internalURL: string =
          window.location.origin + "/api/internal/s3/" + url.pathname;
        data = internalURL;
      }
      if (data !== currentDrawingDataRef.current) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.onload = () => {
          const originalCompositeOperation = context.globalCompositeOperation;

          context.globalCompositeOperation = "source-over";
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          context.globalCompositeOperation = originalCompositeOperation;
          currentDrawingDataRef.current = data;
        };
        img.src = data;
      }
    }
  }, [initialDrawingData, width, height]);

  const getMousePos = useCallback(
    (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent) => {
      if (!ctx || !canvasRef.current || !isActive) {
        return;
      }

      const { x, y } = getMousePos(canvasRef.current, e);

      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);

      if (drawingTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 20;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penThickness;
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [ctx, getMousePos, isActive, drawingTool, penColor, penThickness]
  );

  const draw = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !ctx || !canvasRef.current || !isActive) {
        return;
      }

      const { x, y } = getMousePos(canvasRef.current, e);

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [isDrawing, ctx, getMousePos, isActive]
  );

  const stopDrawing = useCallback(() => {
    if (!ctx || !canvasRef.current || !isActive) {
      return;
    }

    setIsDrawing(false);
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";

    const dataUrl = canvasRef.current.toDataURL("image/png");
    currentDrawingDataRef.current = dataUrl;
    onDrawingChange(dataUrl);
  }, [ctx, onDrawingChange, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute top-0 left-0 z-10 ${
        isActive ? "cursor-crosshair" : "cursor-default"
      }`}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ touchAction: "none", pointerEvents: isActive ? "auto" : "none" }}
    />
  );
}
