import React, { useState, useRef } from "react";
import { Eye, ExternalLink } from "lucide-react";
import { MediaLink } from "@/types/book";

interface DraggableEyeIconProps {
  id: string;
  position: { x: number; y: number };
  mediaLink: MediaLink;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export default function DraggableEyeIcon({
  id,
  position,
  mediaLink,
  onPositionChange,
  onRemove,
  containerRef
}: DraggableEyeIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.button === 2) { // Right click to remove
      onRemove(id);
      return;
    }

    setIsDragging(true);
    const rect = eyeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef?.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // Constrain to container bounds
    const maxX = containerRect.width - 32; // 32px is eye icon width
    const maxY = containerRect.height - 32; // 32px is eye icon height
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    onPositionChange(id, { x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global mouse events when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, containerRef]);

  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging && mediaLink.url) {
      window.open(mediaLink.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div
        ref={eyeRef}
        className={`absolute w-8 h-8 bg-white/90 hover:bg-white border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 z-20 ${
          isDragging ? 'scale-110 shadow-lg' : 'shadow-md hover:shadow-lg'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onClick={handleEyeClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onContextMenu={(e) => e.preventDefault()}
        title="Left click to open link, right click to remove, drag to move"
      >
        <Eye size={16} className="text-blue-600" />
      </div>

      {/* Tooltip */}
      {showTooltip && !isDragging && (
        <div 
          className="absolute bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-30 max-w-xs"
          style={{
            left: `${position.x + 40}px`,
            top: `${position.y}px`,
            transform: position.x > 200 ? 'translateX(-100%)' : 'none',
            marginLeft: position.x > 200 ? '-40px' : '0'
          }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <ExternalLink size={12} />
            <span className="font-medium">
              {mediaLink.title || 'Link'}
            </span>
          </div>
          <div className="text-gray-300 text-xs truncate max-w-48">
            {mediaLink.url}
          </div>
          {/* Tooltip arrow */}
          <div 
            className={`absolute top-2 w-0 h-0 ${
              position.x > 200 
                ? 'right-0 border-l-4 border-l-black/90 border-t-2 border-t-transparent border-b-2 border-b-transparent' 
                : '-left-1 border-r-4 border-r-black/90 border-t-2 border-t-transparent border-b-2 border-b-transparent'
            }`}
          />
        </div>
      )}
    </>
  );
}