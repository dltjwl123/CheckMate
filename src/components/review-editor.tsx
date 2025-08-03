"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import {
  Eraser,
  ImageIcon,
  Pencil,
  Plus,
  Save,
  TextCursorInput,
  Trash2,
  XCircle,
} from "lucide-react";
import Button from "./ui/button";
import { DrawingCanvas } from "./drawing-canvas";
import { createBlankImageDataUrl } from "@/utils/createBlankPage";

export interface ReviewTextBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

export interface ReviewPageData {
  id: string;
  backgroundImageUrl: string;
  drawingData: string; // Base64 string of the transparent drawing layer
  textBoxes: ReviewTextBox[];
}

interface ReviewEditorProps {
  initialSolutionImageUrls: string[];
  onSubmitReview: (reviewData: ReviewPageData[]) => void;
}

type EditorMode = "select" | "draw" | "text" | "background";
type DrawingTool = "pen" | "eraser";
type Color = string;
type Point = { x: number; y: number };

const DRAWING_WIDTH = 600;
const DRAWING_HEIGHT = 800;

export default function ReviewEditor({
  initialSolutionImageUrls,
  onSubmitReview,
}: ReviewEditorProps) {
  const [reviewPages, setReviewPages] = useState<ReviewPageData[]>(() =>
    initialSolutionImageUrls.map((url, index) => ({
      id: `page-${index + 1}`,
      backgroundImageUrl: url,
      drawingData: createBlankImageDataUrl(600, 800, "transparent"),
      textBoxes: [],
    }))
  );
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(
    null
  );
  const [mode, setMode] = useState<EditorMode>("select");
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("pen");
  const [penColor, setPenColor] = useState<Color>("#FF0000");
  const [penThickness, setPenThickness] = useState<number>(5);

  const activePage = reviewPages[activePageIndex];
  const imageContainRef = useRef<HTMLDivElement>(null);

  // Textbox states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  // const [resizeOffset, setResizeOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    textBoxId: string,
    type: "drag" | "resize",
    handle?: string
  ) => {
    if (mode !== "select") {
      return;
    }

    e.stopPropagation();
    setSelectedTextBoxId(textBoxId);

    const textBox = activePage.textBoxes.find((tb) => tb.id === textBoxId);
    if (!textBox) {
      return;
    }

    if (type === "drag") {
      setIsDragging(true);
      setDragOffset({ x: e.clientX - textBox.x, y: e.clientY - textBox.y });
    } else if (type === "resize" && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      // setResizeOffset({
      //   x: e.clientX - (textBox.x + textBox.width),
      //   y: e.clientY - (textBox.y + textBox.height),
      // });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!imageContainRef.current) {
        return;
      }

      const containerRect = imageContainRef.current.getBoundingClientRect();
      const scaleX = DRAWING_WIDTH / containerRect.width;
      const scaleY = DRAWING_HEIGHT / containerRect.height;

      setReviewPages((prevPages) =>
        prevPages.map((page, pIdx) => {
          if (pIdx === activePageIndex) {
            return {
              ...page,
              textBoxes: page.textBoxes.map((tb) => {
                if (tb.id === selectedTextBoxId) {
                  if (isDragging) {
                    let newX = (e.clientX - dragOffset.x) * scaleX;
                    let newY = (e.clientY - dragOffset.y) * scaleY;

                    newX = Math.max(
                      0,
                      Math.min(newX, DRAWING_WIDTH - tb.width)
                    );
                    newY = Math.max(
                      0,
                      Math.min(newY, DRAWING_HEIGHT - tb.height)
                    );
                    return {
                      ...tb,
                      x: newX,
                      y: newY,
                    };
                  } else if (isResizing && resizeHandle) {
                    let newWidth = tb.width;
                    let newHeight = tb.height;
                    const currentX = (e.clientX - containerRect.left) * scaleX;
                    const currentY = (e.clientY - containerRect.top) * scaleY;

                    switch (resizeHandle) {
                      case "br":
                        newWidth = currentX - tb.x;
                        newHeight = currentY - tb.y;
                        break;
                    }
                    newWidth = Math.max(50, newWidth);
                    newHeight = Math.max(30, newHeight);
                    return {
                      ...tb,
                      width: newWidth,
                      height: newHeight,
                    };
                  }
                }
                return tb;
              }),
            };
          }
          return page;
        })
      );
    },
    [
      activePageIndex,
      selectedTextBoxId,
      isDragging,
      isResizing,
      dragOffset,
      resizeHandle,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleTextBoxContentChange = (id: string, content: string) => {
    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              textBoxes: page.textBoxes.map((tb) =>
                tb.id === id
                  ? {
                      ...tb,
                      content,
                    }
                  : tb
              ),
            }
          : page
      )
    );
  };

  const addTextBox = (x: number, y: number) => {
    const newTextBox: ReviewTextBox = {
      id: `textbox-${Date.now()}`,
      x: x,
      y: y,
      width: 200,
      height: 50,
      content: "새 텍스트",
    };

    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              textBoxes: [...page.textBoxes, newTextBox],
            }
          : page
      )
    );
    setSelectedTextBoxId(newTextBox.id);
    setMode("select");
  };

  const deleteTextBox = (id: string) => {
    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              textBoxes: page.textBoxes.filter((tb) => tb.id !== id),
            }
          : page
      )
    );

    if (selectedTextBoxId === id) {
      setSelectedTextBoxId(null);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              drawingData: dataUrl,
            }
          : page
      )
    );
  };

  const addNewBlankPage = () => {
    const newPage: ReviewPageData = {
      id: `page-${Date.now()}`,
      backgroundImageUrl: createBlankImageDataUrl(600, 800),
      drawingData: "",
      textBoxes: [],
    };

    setReviewPages((prev) => [...prev, newPage]);
    setActivePageIndex(reviewPages.length);
    setMode("select");
  };

  const deletePage = (indexToDelete: number) => {
    if (reviewPages.length === 1) {
      alert("삭제 가능한 페이지가 없습니다.");
      return;
    }

    setReviewPages((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );

    if (activePageIndex === indexToDelete) {
      setActivePageIndex(Math.max(0, indexToDelete - 1));
    } else if (activePageIndex > indexToDelete) {
      setActivePageIndex(activePageIndex - 1);
    }
    setMode("select");
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReviewPages((prevPages) =>
          prevPages.map((page, pIdx) =>
            pIdx === activePageIndex
              ? {
                  ...page,
                  backgroundImageUrl: event.target?.result as string,
                }
              : page
          )
        );
      };
      reader.readAsDataURL(file);
    }
    setMode("select");
  };

  const handleImageContainerClick = (e: React.MouseEvent) => {
    if (mode === "text") {
      const containerRect = imageContainRef.current!.getBoundingClientRect();
      const scaleX = DRAWING_WIDTH / containerRect.width;
      const scaleY = DRAWING_HEIGHT / containerRect.height;
      const x = (e.clientX - containerRect.left) * scaleX;
      const y = (e.clientY - containerRect.top) * scaleY;

      addTextBox(x, y);
    } else if (mode === "select") {
      setSelectedTextBoxId(null);
    }
  };

  const handleDrawButtonClick = () => {
    if (mode === "draw" && drawingTool === "pen") {
      setMode("select");
    } else {
      setMode("draw");
      setDrawingTool("pen");
    }
  };

  const handleEraserButtonClick = () => {
    if (mode === "draw" && drawingTool === "eraser") {
      setMode("select");
    } else {
      setMode("draw");
      setDrawingTool("eraser");
    }
  };

  const handleClearDrawing = () => {
    const confirmClear = window.confirm(
      "현재 페이지의 모든 그림을 지우시겠습니까?"
    );

    if (confirmClear) {
      setReviewPages((prevPages) =>
        prevPages.map((page, pIdx) =>
          pIdx === activePageIndex ? { ...page, drawingData: "" } : page
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>리뷰 페이지 미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {reviewPages.map((page, index) => (
              <div
                key={page.id}
                className={`relative w-24 h-32 border rounded-md overflow-hidden cursor-pointer
                  group ${
                    activePageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }`}
                onClick={() => {
                  setActivePageIndex(index);
                  setMode("select");
                }}
              >
                <Image
                  src={page.backgroundImageUrl || "/placeholder.svg"}
                  alt={`리뷰 페이지 ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                {page.drawingData && (
                  <Image
                    src={page.drawingData || "/placeholder.svg"}
                    alt="drawing preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md opacity-70"
                  />
                )}
                <span className="absolute bottom-0 right-0 bg-blue-400 text-white text-xs px-1 rounded-tl-md">
                  {index + 1}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full
                    p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`페이지 ${index + 1} 삭제`}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="default"
              onClick={addNewBlankPage}
              className="h-32 w-24 flex flex-col items-center justify-center text-gray-500
              hover:text-gray-700 bg-transparent"
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs">새 페이지</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              페이지 {activePageIndex + 1}
              {reviewPages.length > 1 && ` / ${reviewPages.length}`}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {" "}
              <label htmlFor="background-upload" className="cursor-pointer">
                <Button
                  variant={mode === "background" ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-1 ${
                    mode === "background" ? "" : "bg-transparent"
                  }`}
                  onClick={() => setMode("background")}
                >
                  <ImageIcon className="h-4 w-4" />
                  배경 변경
                </Button>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleBackgroundChange}
                />
              </label>
              <Button
                variant={
                  mode === "draw" && drawingTool === "pen"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={handleDrawButtonClick}
                className={`flex items-center gap-1 ${
                  mode === "draw" && drawingTool === "pen"
                    ? ""
                    : "bg-transparent"
                }`}
              >
                <Pencil className="h-4 w-4" />
                그리기
              </Button>
              <Button
                variant={
                  mode === "draw" && drawingTool === "eraser"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={handleEraserButtonClick}
                className={`flex items-center gap-1 ${
                  mode === "draw" && drawingTool === "eraser"
                    ? ""
                    : "bg-transparent"
                }`}
              >
                <Eraser className="h-4 w-4" />
                지우개
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDrawing}
                className="flex items-center gap-1 bg-transparent text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                전부 지우기
              </Button>
              <Button
                value={mode === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("text")}
                className={`flex items-center gap-1 ${
                  mode === "text" ? "" : "bg-transparent"
                }`}
              >
                <TextCursorInput className="h-4 w-4" />
                텍스트 추가
              </Button>
              {/* Pen Options */}
              {mode === "draw" && (
                <>
                  <div className="flex items-center gap-1 ml-2">
                    <label htmlFor="pen-color" className="sr-only">
                      펜 색상
                    </label>
                    <input
                      id="pen-color"
                      type="color"
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                      title="펜 색상"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="pen-thickness" className="sr-only">
                      펜 굵기
                    </label>
                    <input
                      id="pen-thickness"
                      type="range"
                      min={"1"}
                      max={"20"}
                      value={penThickness}
                      onChange={(e) => setPenThickness(Number(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      title={`펜 굵기: ${penThickness}`}
                    />
                    <span className="text-sm text-gray-600">
                      {penThickness}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={imageContainRef}
            className="relative w-full max-w-[600px] mx-auto border border-gray-200 rounded-md overflow-hidden shadow-sm"
            style={{ aspectRatio: `${DRAWING_WIDTH} / ${DRAWING_HEIGHT}` }}
            onClick={handleImageContainerClick}
          >
            <Image
              src={activePage.backgroundImageUrl || "/placeholder.svg"}
              alt={`Review Background ${activePageIndex + 1}`}
              layout="fill"
              objectFit="contain"
              className="z-0"
            />
            <DrawingCanvas
              initialDrawingData={activePage.drawingData}
              onDrawingChange={handleDrawingChange}
              width={DRAWING_WIDTH}
              height={DRAWING_HEIGHT}
              isActive={mode === "draw"}
              drawingTool={drawingTool}
              penColor={penColor}
              penThickness={penThickness}
            />

            {/* Text Box */}
            {activePage.textBoxes.map((textBox) => (
              <div
                key={textBox.id}
                className={`absolute bg-yellow-100 opacity-70 border rounded p-2
                  text-sm text-gray-800 resize overflow-hidden ${
                    selectedTextBoxId === textBox.id
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-yellow-400"
                  }`}
                style={{
                  left: textBox.x,
                  top: textBox.y,
                  width: textBox.width,
                  height: textBox.height,
                  cursor:
                    mode === "select" && isDragging
                      ? "grabbing"
                      : mode === "select"
                      ? "grab"
                      : "default",
                }}
                onMouseDown={(e) => handleMouseDown(e, textBox.id, "drag")}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full h-full outline-none"
                  onBlur={(e) =>
                    handleTextBoxContentChange(
                      textBox.id,
                      e.currentTarget.innerText
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode !== "select") {
                      setSelectedTextBoxId(textBox.id);
                      setMode("select");
                    }
                  }}
                >
                  {textBox.content}
                </div>
                {selectedTextBoxId === textBox.id && mode === "select" && (
                  <>
                    {/* Resize handle */}
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-300
                      rounded-full cursor-nwse-resize z-20"
                      onMouseDown={(e) =>
                        handleMouseDown(e, textBox.id, "resize", "br")
                      }
                    />

                    {/* Delete Button */}
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTextBox(textBox.id);
                      }}
                      aria-label="텍스트 박스 삭제"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Submit Button */}
      <div className="flex justify-end">
        <Button
          className="flext items-center gap-2"
          onClick={() => onSubmitReview(reviewPages)}
        >
          <Save className="h-4 w-4" />
          리뷰 제출
        </Button>
      </div>
    </div>
  );
}
