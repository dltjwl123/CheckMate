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
import { Annotation, ReviewDetailResponse, ReviewLayer } from "@/api/reviewApi";
import { ReviewPage } from "@/app/problems/[id]/solutions/[solutionId]/page";

interface ReviewEditorProps {
  initialSolutionImageUrls: string[];
  initialReviewDetail?: ReviewDetailResponse;
  onSubmitReview: (reviewData: ReviewPage[]) => void;
}

interface EditableAnnotation extends Annotation {
  id: string;
}

interface EditableLayer extends ReviewLayer {
  id: string;
}

interface EditablePage {
  annotations: EditableAnnotation[];
  reviewLayer: EditableLayer;
  pageNumber: number;
}

type EditorMode = "select" | "draw" | "text" | "background";
type DrawingTool = "pen" | "eraser";
type Color = string;
type Point = { x: number; y: number };

// canvas constants(px)
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;
const COLLAPSED_SIZE = 24;
const DRAG_CLICK_THRESHOLD = 3;
const SAFE_MARGIN = 12;
const DEFAULT_ANNOTATION_WIDTH = 200;
const DEFAULT_ANNOTATION_HEIGHT = 50;

export default function ReviewEditor({
  initialSolutionImageUrls,
  initialReviewDetail,
  onSubmitReview,
}: ReviewEditorProps) {
  const [reviewPages, setReviewPages] = useState<EditablePage[]>(() =>
    initialSolutionImageUrls.map((imgUrl, index) => ({
      pageNumber: index,
      annotations: [],
      reviewLayer: {
        id: crypto.randomUUID(),
        pageNumber: index,
        backgroundImgUrl: imgUrl,
        imgUrl: createBlankImageDataUrl(600, 800, "transparent"),
      },
    }))
  );
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);
  const [mode, setMode] = useState<EditorMode>("select");
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("pen");
  const [penColor, setPenColor] = useState<Color>("#FF0000");
  const [penThickness, setPenThickness] = useState<number>(5);

  const activePage = reviewPages[activePageIndex];
  const imageContainRef = useRef<HTMLDivElement>(null);

  // annotation states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [collapsedDragId, setCollapsedDragId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const annotationsRef = useRef<Record<string, HTMLDivElement | null>>({});
  // const [resizeOffset, setResizeOffset] = useState<Point>({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const placeCaretAtEnd = (element: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const selectAllText = (element: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(element);

    const select = window.getSelection();
    select?.removeAllRanges();
    select?.addRange(range);
  };

  const handleTextBoxContentChange = useCallback(
    (id: string, content: string) => {
      setReviewPages((prevPages) =>
        prevPages.map((page, pIdx) =>
          pIdx === activePageIndex
            ? {
                ...page,
                annotations: page.annotations.map((annotation) =>
                  annotation.id === id
                    ? {
                        ...annotation,
                        content,
                      }
                    : annotation
                ),
              }
            : page
        )
      );
    },
    [activePageIndex]
  );

  useEffect(() => {
    if (!selectedAnnotationId) {
      return;
    }

    const element = annotationsRef.current[selectedAnnotationId];
    if (!element) {
      return;
    }

    element.focus();
    placeCaretAtEnd(element);

    if (element.innerText.trim() === "새 텍스트") {
      selectAllText(element);
    }
  }, [selectedAnnotationId]);

  useEffect(() => {
    if (initialReviewDetail) {
      const reviewPages: EditablePage[] = initialReviewDetail.layers.map(
        (layer) => ({
          pageNumber: layer.pageNumber,
          reviewLayer: {
            ...layer,
            id: crypto.randomUUID(),
          },
          annotations: initialReviewDetail.annotations
            .filter((annotation) => annotation.pageNumber === layer.pageNumber)
            .map((annotation) => ({
              ...annotation,
              id: crypto.randomUUID(),
            })),
        })
      );
      reviewPages.sort((a: EditablePage, b: EditablePage) => {
        return a.pageNumber - b.pageNumber;
      });
      setReviewPages(reviewPages);
    }
  }, [initialReviewDetail]);

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    type: "drag" | "resize",
    handle?: string
  ) => {
    if (mode !== "select") {
      return;
    }

    e.stopPropagation();
    setSelectedAnnotationId(id);

    const targetAnnotation = activePage.annotations.find(
      (annotation) => annotation.id === id
    );

    if (!targetAnnotation) {
      return;
    }

    if (type === "drag") {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - targetAnnotation.position.x,
        y: e.clientY - targetAnnotation.position.y,
      });
    } else if (type === "resize" && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      // setResizeOffset({
      //   x: e.clientX - (textBox.x + textBox.width),
      //   y: e.clientY - (textBox.y + textBox.height),
      // });
    }
  };

  const commitFocusedAnnotation = useCallback(() => {
    if (!selectedAnnotationId) {
      return;
    }

    const element = annotationsRef.current[selectedAnnotationId];
    if (!element) {
      return;
    }
    handleTextBoxContentChange(selectedAnnotationId, element.innerText);
  }, [selectedAnnotationId, handleTextBoxContentChange]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!imageContainRef.current) {
        return;
      }

      const containerRect = imageContainRef.current.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / containerRect.width;
      const scaleY = CANVAS_HEIGHT / containerRect.height;
      const movingId = collapsedDragId ?? selectedAnnotationId;

      if (!movingId) {
        return;
      }

      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.hypot(dx, dy) > DRAG_CLICK_THRESHOLD) {
          hasMovedRef.current = true;
        }
      }

      setReviewPages((prevPages) =>
        prevPages.map((page, pIdx) => {
          if (pIdx === activePageIndex) {
            return {
              ...page,
              annotations: page.annotations.map((annotation) => {
                if (annotation.id !== movingId) {
                  return annotation;
                }

                if (isDragging) {
                  let newX = (e.clientX - dragOffset.x) * scaleX;
                  let newY = (e.clientY - dragOffset.y) * scaleY;
                  const minX = SAFE_MARGIN;
                  const minY = SAFE_MARGIN;
                  const maxX = CANVAS_WIDTH - annotation.width - SAFE_MARGIN;
                  const maxY = CANVAS_HEIGHT - annotation.height - SAFE_MARGIN;

                  newX = Math.max(minX, Math.min(newX, maxX));
                  newY = Math.max(minY, Math.min(newY, maxY));
                  return {
                    ...annotation,
                    position: {
                      x: newX,
                      y: newY,
                    },
                  };
                } else if (isResizing && resizeHandle) {
                  const currentX = (e.clientX - containerRect.left) * scaleX;
                  const currentY = (e.clientY - containerRect.top) * scaleY;
                  const maxPossibleWidth =
                    CANVAS_WIDTH - annotation.position.x - SAFE_MARGIN;
                  const maxPossibleHeight =
                    CANVAS_HEIGHT - annotation.position.y - SAFE_MARGIN;
                  const MIN_W = 50;
                  const MIN_H = 30;

                  let newWidth = annotation.width;
                  let newHeight = annotation.height;

                  switch (resizeHandle) {
                    case "br":
                      const proposedWidth: number =
                        currentX - annotation.position.x;
                      const proposedHeight: number =
                        currentY - annotation.position.y;

                      newWidth = Math.min(
                        Math.max(MIN_W, proposedWidth),
                        maxPossibleWidth
                      );
                      newHeight = Math.min(
                        Math.max(MIN_H, proposedHeight),
                        maxPossibleHeight
                      );

                      break;
                  }
                  newWidth = Math.max(50, newWidth);
                  newHeight = Math.max(30, newHeight);
                  return {
                    ...annotation,
                    width: newWidth,
                    height: newHeight,
                  };
                }
                return annotation;
              }),
            };
          }
          return page;
        })
      );
    },
    [
      activePageIndex,
      selectedAnnotationId,
      isDragging,
      isResizing,
      dragOffset,
      resizeHandle,
      collapsedDragId,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (collapsedDragId) {
      if (!hasMovedRef.current) {
        setSelectedAnnotationId(collapsedDragId);
        setMode("select");
      }
      setCollapsedDragId(null);
      dragStartRef.current = null;
      hasMovedRef.current = false;
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, [collapsedDragId]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const addAnnotation = (x: number, y: number) => {
    const newId: string = crypto.randomUUID();
    const maxWidth = CANVAS_WIDTH - DEFAULT_ANNOTATION_WIDTH - SAFE_MARGIN;
    const maxHeight = CANVAS_HEIGHT - DEFAULT_ANNOTATION_HEIGHT - SAFE_MARGIN;
    const safeX = Math.max(SAFE_MARGIN, Math.min(x, maxWidth));
    const safeY = Math.max(SAFE_MARGIN, Math.min(y, maxHeight));
    const newAnnotation: EditableAnnotation = {
      id: newId,
      position: {
        x: safeX,
        y: safeY,
      },
      width: DEFAULT_ANNOTATION_WIDTH,
      height: DEFAULT_ANNOTATION_HEIGHT,
      content: "새 텍스트",
      imageUrl: "",
      pageNumber: activePageIndex,
    };

    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              annotations: [...page.annotations, newAnnotation],
            }
          : page
      )
    );
    setSelectedAnnotationId(newId);
    setMode("select");
  };

  const deleteAnnotation = (id: string) => {
    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              annotations: page.annotations.filter(
                (annotation) => annotation.id !== id
              ),
            }
          : page
      )
    );

    if (selectedAnnotationId === id) {
      setSelectedAnnotationId(null);
    }
  };

  const handleDrawingChange = (dataUrl: string) => {
    setReviewPages((prevPages) =>
      prevPages.map((page, pIdx) =>
        pIdx === activePageIndex
          ? {
              ...page,
              reviewLayer: {
                ...page.reviewLayer,
                imgUrl: dataUrl,
              },
            }
          : page
      )
    );
  };

  const addNewBlankPage = () => {
    const newPage: EditablePage = {
      reviewLayer: {
        id: crypto.randomUUID(),
        backgroundImgUrl: createBlankImageDataUrl(600, 800),
        imgUrl: "",
        pageNumber: reviewPages.length,
      },
      annotations: [],
      pageNumber: reviewPages.length,
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
                  reviewLayer: {
                    ...page.reviewLayer,
                    backgroundImgUrl: event.target?.result as string,
                  },
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
      const scaleX = CANVAS_WIDTH / containerRect.width;
      const scaleY = CANVAS_HEIGHT / containerRect.height;
      const x = (e.clientX - containerRect.left) * scaleX;
      const y = (e.clientY - containerRect.top) * scaleY;

      addAnnotation(x, y);
    } else if (mode === "select") {
      if (e.target === e.currentTarget) {
        setSelectedAnnotationId(null);
      }
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
          pIdx === activePageIndex
            ? {
                ...page,
                reviewLayer: {
                  ...page.reviewLayer,
                  imgUrl: createBlankImageDataUrl(600, 800, "transparent"),
                },
              }
            : page
        )
      );
    }
  };

  // Annotation collapse
  useEffect(() => {
    const handleOutsideDown = (e: MouseEvent) => {
      if (
        mode !== "select" ||
        !selectedAnnotationId ||
        isDragging ||
        isResizing
      ) {
        return;
      }

      const container = imageContainRef.current;
      if (!container) {
        return;
      }

      const target = e.target as HTMLElement;
      // Click outside of the container
      if (!container.contains(target)) {
        commitFocusedAnnotation();
        setSelectedAnnotationId(null);
        return;
      }

      // Click inside of the container but outside of the annotation
      const focusedWrapper = container.querySelector<HTMLElement>(
        `[data-annotation-id="${selectedAnnotationId}"]`
      );
      if (focusedWrapper && !focusedWrapper.contains(target)) {
        commitFocusedAnnotation();
        setSelectedAnnotationId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideDown);
    return () => document.removeEventListener("mousedown", handleOutsideDown);
  }, [
    mode,
    selectedAnnotationId,
    isDragging,
    isResizing,
    commitFocusedAnnotation,
  ]);

  // Prevent background dragging
  useEffect(() => {
    if (isDragging || isResizing) {
      const prev = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      return () => {
        document.body.style.userSelect = prev;
      };
    }
  }, [isDragging, isResizing]);

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
                key={page.pageNumber}
                className={`relative w-24 h-32 border rounded-md overflow-hidden cursor-pointer
                  group ${
                    activePageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }`}
                onClick={() => {
                  commitFocusedAnnotation();
                  setActivePageIndex(index);
                  setMode("select");
                }}
              >
                <Image
                  src={page.reviewLayer.backgroundImgUrl || "/placeholder.svg"}
                  alt={`리뷰 페이지 ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                {page.reviewLayer.imgUrl && (
                  <Image
                    src={page.reviewLayer.imgUrl || "/placeholder.svg"}
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
                  onClick={() => {
                    setMode("background");
                    document.getElementById("background-upload")?.click();
                  }}
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
                className={`flex items-center gap-1`}
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
            style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
            onClick={handleImageContainerClick}
          >
            <Image
              src={
                activePage.reviewLayer.backgroundImgUrl || "/placeholder.svg"
              }
              alt={`Review Background ${activePageIndex + 1}`}
              layout="fill"
              objectFit="contain"
              className="z-0"
            />
            <DrawingCanvas
              initialDrawingData={activePage.reviewLayer.imgUrl}
              onDrawingChange={handleDrawingChange}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              isActive={mode === "draw"}
              drawingTool={drawingTool}
              penColor={penColor}
              penThickness={penThickness}
            />

            {/* Text Box */}
            {activePage.annotations.map((annotation) => {
              const isFocused = selectedAnnotationId === annotation.id;
              return (
                <div
                  key={annotation.id}
                  data-annotation-id={annotation.id}
                  className={`absolute
                      ${
                        // Background
                        isFocused
                          ? "bg-yellow-100 opacity-70 border rounded p-2 text-sm text-gray-800 overflow-visible"
                          : "flex items-center justify-center rounded-full bg-yellow-200/90 shadow-sm hover:ring-2 hover:ring-blue-400"
                      }
                    ${
                      // Cursor
                      isFocused
                        ? mode === "select" && isDragging
                          ? "cursor-grabbing"
                          : mode === "select"
                          ? "cursor-grab"
                          : "cursor-default"
                        : "cursor-pointer"
                    }
                    ${
                      // Border
                      isFocused
                        ? mode === "select"
                          ? "border-blue-500 ring-2 ring-blue-500"
                          : "border-yellow-400"
                        : ""
                    }`}
                  style={{
                    left: annotation.position.x,
                    top: annotation.position.y,
                    width: isFocused ? annotation.width : COLLAPSED_SIZE,
                    height: isFocused ? annotation.height : COLLAPSED_SIZE,
                    cursor:
                      mode === "select" && isDragging
                        ? "grabbing"
                        : mode === "select"
                        ? "grab"
                        : "default",
                  }}
                  onMouseDown={(e) => {
                    if (mode !== "select") {
                      return;
                    }
                    if (isFocused) {
                      handleMouseDown(e, annotation.id, "drag");
                      return;
                    }

                    // Drag without selection
                    const target = activePage.annotations.find(
                      (a: EditableAnnotation) => a.id === annotation.id
                    );
                    if (!target) {
                      return;
                    }

                    setIsDragging(true);
                    setCollapsedDragId(annotation.id);
                    dragStartRef.current = {
                      x: e.clientX,
                      y: e.clientY,
                    };
                    hasMovedRef.current = false;
                    setDragOffset({
                      x: e.clientX - target.position.x,
                      y: e.clientY - target.position.y,
                    });
                  }}
                  onClick={(e) => {
                    if (collapsedDragId) {
                      return;
                    }
                    if (!isFocused) {
                      e.stopPropagation();
                      setSelectedAnnotationId(annotation.id);
                      setMode("select");
                    }
                  }}
                  title={
                    !isFocused
                      ? annotation.content?.slice(0, 20) || "메모"
                      : undefined
                  }
                  aria-label={!isFocused ? "메모 열기" : "메모 편집"}
                >
                  {isFocused ? (
                    <>
                      <div
                        ref={(node: HTMLDivElement) => {
                          annotationsRef.current[annotation.id] = node;
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full h-full outline-none"
                        onBlur={(e) =>
                          handleTextBoxContentChange(
                            annotation.id,
                            e.currentTarget.innerText
                          )
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mode !== "select") {
                            setSelectedAnnotationId(annotation.id);
                            setMode("select");
                          }
                        }}
                      >
                        {annotation.content}
                      </div>
                      {selectedAnnotationId === annotation.id &&
                        mode === "select" && (
                          <>
                            {/* Resize handle */}
                            <div
                              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-300
                      rounded-full cursor-nwse-resize z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(
                                  e,
                                  annotation.id,
                                  "resize",
                                  "br"
                                )
                              }
                            />

                            {/* Delete Button */}
                            <button
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAnnotation(annotation.id);
                              }}
                              aria-label="텍스트 박스 삭제"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                    </>
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </div>
              );
            })}
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
