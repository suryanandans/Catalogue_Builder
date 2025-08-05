import { useState } from "react";
import { Eye, ExternalLink } from "lucide-react";
import { MediaLink } from "@/types/book";

interface MediaWithEyeIconProps {
  mediaId: string;
  mediaLink?: MediaLink;
  children: React.ReactNode;
  className?: string;
}

export default function MediaWithEyeIcon({ 
  mediaId, 
  mediaLink, 
  children, 
  className = "" 
}: MediaWithEyeIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaLink?.url) {
      window.open(mediaLink.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!mediaLink) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      
      {/* Eye Icon Overlay */}
      <div 
        className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
        onClick={handleEyeClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={mediaLink.title || "Click to open link"}
      >
        <Eye size={16} className="text-white" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-0 right-12 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 max-w-xs">
          <div className="flex items-center space-x-1">
            <ExternalLink size={10} />
            <span className="truncate">
              {mediaLink.title || mediaLink.url}
            </span>
          </div>
          {mediaLink.title && (
            <div className="text-gray-300 text-xs truncate mt-1">
              {mediaLink.url}
            </div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/90 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}