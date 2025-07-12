"use client";

import React from "react";
import Button from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxWidth = "2xl",
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg ${maxWidthClasses[maxWidth]} w-full max-h-[80vh] overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">{children}</div>
        {showCloseButton && (
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <Button onClick={onClose}>확인</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
