import React, { useState, useRef } from "react";
import { Eye, X } from "lucide-react";
import { EyeIconInstance, MediaLink } from "@/types/book";

interface DraggableEyeIconProps {
  id: string;
  position: { x: number; y: number };
  mediaLink: MediaLink;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  size?: number;
  onSizeChange?: (id: string, size: number) => void;
  isPreview?: boolean;
}

export default function DraggableEyeIcon({
  id,
  position,
  mediaLink,
  onPositionChange,
  onRemove,
  containerRef,
  size = 32,
  onSizeChange,
  isPreview = false
}: DraggableEyeIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ size, clientY: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(e.clientX - startX - rect.left, rect.width - size));
      const newY = Math.max(0, Math.min(e.clientY - startY - rect.top, rect.height - size));

      onPositionChange(id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ size, clientY: e.clientY });

    const handleResizeMove = (e: MouseEvent) => {
      const deltaY = resizeStart.clientY - e.clientY; // Invert for intuitive resizing
      const newSize = Math.max(16, Math.min(64, resizeStart.size + deltaY));
      
      if (onSizeChange) {
        onSizeChange(id, newSize);
      }
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaLink.url && !isDragging && !isResizing) {
      window.open(mediaLink.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isPreview) return;
    
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div
      ref={dragRef}
      className={`absolute z-20 group ${isPreview ? 'cursor-pointer' : 'cursor-grab'} ${isDragging ? 'cursor-grabbing' : ''} ${isResizing ? 'cursor-ns-resize' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      title={mediaLink.title || mediaLink.url}
    >
      {/* Eye Icon */}
      <div
        className={`w-full h-full bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isDragging || isResizing ? 'scale-110' : 'hover:scale-105'
        } ${isPreview ? 'hover:border-blue-600' : ''}`}
      >
        <Eye 
          size={Math.max(12, size * 0.6)} 
          className="text-blue-600" 
        />
      </div>

      {/* Resize Handle - only show in edit mode */}
      {!isPreview && (
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeMouseDown}
          title="Drag to resize"
        />
      )}

      {/* Remove Button - only show in edit mode */}
      {!isPreview && (
        <button
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(id);
          }}
          title="Remove eye icon"
        >
          <X size={10} />
        </button>
      )}

      {/* Tooltip */}
      {mediaLink.title && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
          {mediaLink.title}
        </div>
      )}
    </div>
  );
}