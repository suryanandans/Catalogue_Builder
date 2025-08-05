import React, { useRef, useState } from "react";
import { EyeIconInstance, MediaLink } from "@/types/book";
import DraggableEyeIcon from "@/components/draggable-eye-icon";

interface MediaWithDraggableIconsProps {
  children: React.ReactNode;
  eyeIcons?: EyeIconInstance[];
  onEyeIconsUpdate: (eyeIcons: EyeIconInstance[]) => void;
  className?: string;
  isPreview?: boolean;
}

export default function MediaWithDraggableIcons({
  children,
  eyeIcons = [],
  onEyeIconsUpdate,
  className = "",
  isPreview = false
}: MediaWithDraggableIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreview) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "eye-icon") {
        setIsDragOver(true);
      }
    } catch {
      // Not an eye icon drag
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isPreview) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "eye-icon" && data.mediaLink) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left - 16; // Center the 32px icon
          const y = e.clientY - rect.top - 16;
          
          // Constrain to container bounds
          const maxX = rect.width - 32;
          const maxY = rect.height - 32;
          const constrainedX = Math.max(0, Math.min(x, maxX));
          const constrainedY = Math.max(0, Math.min(y, maxY));

          const newEyeIcon: EyeIconInstance = {
            id: crypto.randomUUID(),
            position: { x: constrainedX, y: constrainedY },
            mediaLink: data.mediaLink,
            size: 32
          };

          onEyeIconsUpdate([...eyeIcons, newEyeIcon]);
        }
      }
    } catch (error) {
      console.error("Failed to parse drop data:", error);
    }
  };

  const handleEyeIconPositionChange = (id: string, position: { x: number; y: number }) => {
    const updatedIcons = eyeIcons.map(icon =>
      icon.id === id ? { ...icon, position } : icon
    );
    onEyeIconsUpdate(updatedIcons);
  };

  const handleEyeIconSizeChange = (id: string, size: number) => {
    const updatedIcons = eyeIcons.map(icon =>
      icon.id === id ? { ...icon, size } : icon
    );
    onEyeIconsUpdate(updatedIcons);
  };

  const handleEyeIconRemove = (id: string) => {
    const updatedIcons = eyeIcons.filter(icon => icon.id !== id);
    onEyeIconsUpdate(updatedIcons);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className} ${isDragOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Render eye icons */}
      {eyeIcons.map((eyeIcon) => (
        <DraggableEyeIcon
          key={eyeIcon.id}
          id={eyeIcon.id}
          position={eyeIcon.position}
          mediaLink={eyeIcon.mediaLink}
          size={eyeIcon.size || 32}
          onPositionChange={handleEyeIconPositionChange}
          onSizeChange={handleEyeIconSizeChange}
          onRemove={handleEyeIconRemove}
          containerRef={containerRef}
          isPreview={isPreview}
        />
      ))}

      {/* Drop zone indicator */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white px-3 py-2 rounded shadow-lg text-blue-700 text-sm font-medium">
            Drop eye icon here
          </div>
        </div>
      )}
    </div>
  );
}