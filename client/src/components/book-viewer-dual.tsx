import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { BookProject, BookPage } from "@/types/book";
import { getTemplateById } from "@/lib/templates";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookViewerProps {
  project: BookProject;
  onPageChange?: (pageIndex: number) => void;
}

export default function BookViewer({ project, onPageChange }: BookViewerProps) {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [-200, 0, 200], [1, 0, 1]);

  const totalPages = project.pages.length;
  const totalSpreads = totalPages; // Each page is a spread with left and right content
  
  const getCurrentSpread = () => {
    const currentPage = project.pages[currentSpreadIndex];
    
    console.log("Viewer: getCurrentSpread - spread index:", currentSpreadIndex, "current page:", currentPage);
    
    if (!currentPage) {
      return { left: null, right: null };
    }
    
    return { 
      left: currentPage.left, 
      right: currentPage.right
    };
  };
  
  const getNextSpread = () => {
    const nextPageIndex = currentSpreadIndex + 1;
    if (nextPageIndex >= totalPages) return { left: null, right: null };
    const nextPage = project.pages[nextPageIndex];
    return { 
      left: nextPage?.left || null, 
      right: nextPage?.right || null 
    };
  };
  
  const getPrevSpread = () => {
    const prevPageIndex = currentSpreadIndex - 1;
    if (prevPageIndex < 0) return { left: null, right: null };
    const prevPage = project.pages[prevPageIndex];
    return { 
      left: prevPage?.left || null, 
      right: prevPage?.right || null 
    };
  };

  const currentSpread = getCurrentSpread();
  const nextSpread = getNextSpread();
  const prevSpread = getPrevSpread();

  const flipSpread = async (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    let newSpreadIndex = currentSpreadIndex;
    
    if (direction === 'next' && currentSpreadIndex < totalPages - 1) {
      newSpreadIndex = currentSpreadIndex + 1;
    } else if (direction === 'prev' && currentSpreadIndex > 0) {
      newSpreadIndex = currentSpreadIndex - 1;
    } else {
      return;
    }

    setFlipDirection(direction);
    setIsFlipping(true);
    
    // Natural page flip timing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentSpreadIndex(newSpreadIndex);
    onPageChange?.(newSpreadIndex);
    
    // Complete the flip animation
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsFlipping(false);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isFlipping) return;
    setIsDragging(true);
    dragX.set(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isFlipping) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = clientX - centerX;
    
    dragX.set(Math.max(-300, Math.min(300, deltaX)));
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const currentDragValue = dragX.get();
    
    if (Math.abs(currentDragValue) > 80) {
      if (currentDragValue > 0 && currentSpreadIndex < totalPages - 1) {
        flipSpread('next');
      } else if (currentDragValue < 0 && currentSpreadIndex > 0) {
        flipSpread('prev');
      }
    }
    
    dragX.set(0);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderPageContent = (content: any, position: 'left' | 'right') => {
    // Handle completely empty or null content
    if (!content || !content.template) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-8">
            <div className="text-gray-300 mb-2">📄</div>
            <span className="text-sm">Empty page</span>
          </div>
        </div>
      );
    }

    console.log("Viewer: Rendering content:", { template: content.template, content: content.content });
    
    const template = getTemplateById(content.template);
    if (!template) {
      console.error("Viewer: Template not found:", content.template);
      return (
        <div className="flex items-center justify-center h-full text-red-500 text-sm bg-white rounded-lg border">
          <div className="text-center p-4">
            <p>Template not found: {content.template}</p>
            <p className="text-xs mt-1 text-gray-500">Available templates: photo-grid, text-article, hero-image, quote-block, mixed-media</p>
          </div>
        </div>
      );
    }

    try {
      const contentData = content.content || template.defaultProps;
      console.log("Viewer: Rendering template content with data:", contentData);
      // Create read-only version of template content
      const readOnlyContent = React.cloneElement(
        template.content(contentData) as React.ReactElement,
        {
          style: { pointerEvents: 'none', userSelect: 'none' },
          contentEditable: false,
          suppressContentEditableWarning: true
        }
      );
      
      return (
        <div className="bg-white h-full w-full overflow-hidden" style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div className="h-full w-full p-6" style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {readOnlyContent}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Viewer: Error rendering template:", error, content);
      return (
        <div className="flex items-center justify-center h-full text-red-500 text-sm bg-white rounded-lg border">
          <div className="text-center p-4">
            <p>Error rendering template</p>
            <p className="text-xs mt-1">{String(error)}</p>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-bookcraft-gray-900">
      {/* Viewer Controls */}
      <div className="bg-black/50 backdrop-blur-sm text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold" data-testid="text-book-title">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/80" data-testid="text-page-info">
              Page <span data-testid="text-current-spread">{currentSpreadIndex + 1}</span> of{" "}
              <span data-testid="text-total-spreads">{totalPages}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white hover:bg-white/10"
              data-testid="button-fullscreen"
            >
              <Maximize size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Dual-Page Book Viewer */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative" style={{ perspective: "2000px", perspectiveOrigin: "center center" }}>
          {/* Book Container */}
          <div 
            className="relative book-container cursor-grab active:cursor-grabbing" 
            style={{ transformStyle: "preserve-3d" }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Base Book (Always visible - current spread) */}
            <div className="flex relative">
              {/* Left Page */}
              <div className="book-page-static bg-white relative shadow-2xl pointer-events-none select-none"
                   style={{ 
                     width: "400px",
                     height: "500px",
                     borderRadius: "8px 0 0 8px",
                     boxShadow: "0 4px 20px rgba(0,0,0,0.15), inset 2px 0 8px rgba(0,0,0,0.1)"
                   }}>
                {renderPageContent(currentSpread.left, 'left')}
              </div>

              {/* Minimal Center Binding */}
              <div style={{ width: "2px", backgroundColor: "#e0e0e0", height: "500px" }} />

              {/* Right Page */}
              <div className="book-page-static bg-white relative shadow-2xl pointer-events-none select-none"
                   style={{ 
                     width: "400px",
                     height: "500px",
                     borderRadius: "0 8px 8px 0",
                     boxShadow: "0 4px 20px rgba(0,0,0,0.15), inset -2px 0 8px rgba(0,0,0,0.1)"
                   }}>
                {renderPageContent(currentSpread.right, 'right')}
              </div>
            </div>

            {/* Realistic Page Flip Animation */}
            <AnimatePresence>
              {isFlipping && (
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ 
                    transformStyle: "preserve-3d",
                    zIndex: 20,
                    perspective: "1500px"
                  }}
                >
                  {/* Right Page Flip (flips from right to left) */}
                  {flipDirection === 'next' && (
                    <motion.div
                      className="absolute top-0 right-0"
                      style={{ 
                        width: "400px",
                        height: "500px",
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d"
                      }}
                      initial={{ 
                        rotateY: 0,
                        z: 0
                      }}
                      animate={{
                        rotateY: [0, -15, -45, -75, -105, -135, -165, -180],
                        z: [0, 10, 25, 40, 45, 35, 15, 0],
                        x: [0, -5, -15, -25, -20, -10, -3, 0]
                      }}
                      transition={{
                        duration: 1.0,
                        times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
                        ease: [0.25, 0.1, 0.25, 1.0]
                      }}
                    >
                      {/* Front Side of Right Page */}
                      <div 
                        className="absolute inset-0 bg-white"
                        style={{ 
                          backfaceVisibility: "hidden",
                          borderRadius: "0 8px 8px 0",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset -4px 0 12px rgba(0,0,0,0.1)",
                          background: "linear-gradient(90deg, rgba(248,249,250,0.8) 0%, #ffffff 10%, #ffffff 100%)"
                        }}
                      >
                        <div className="h-full w-full pointer-events-none select-none">
                          {renderPageContent(currentSpread.right, 'right')}
                        </div>
                        
                        {/* Page curl shadow effect */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.05) 60%, transparent 100%)",
                            borderRadius: "0 8px 8px 0"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.3, 0.6, 0.8, 0.6, 0.3, 0] }}
                          transition={{ 
                            duration: 1.0,
                            times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
                          }}
                        />
                      </div>

                      {/* Back Side of Right Page */}
                      <div 
                        className="absolute inset-0 bg-white"
                        style={{ 
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          borderRadius: "8px 0 0 8px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 4px 0 12px rgba(0,0,0,0.1)",
                          background: "linear-gradient(90deg, #ffffff 0%, #ffffff 90%, rgba(248,249,250,0.8) 100%)"
                        }}
                      >
                        <div className="h-full w-full pointer-events-none select-none transform scale-x-[-1]">
                          {renderPageContent(nextSpread.left, 'left')}
                        </div>
                      </div>

                      {/* Realistic page curl corner */}
                      <motion.div
                        className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.9) 50%, rgba(235,235,235,0.8) 100%)",
                          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                          borderRadius: "0 0 0 8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          zIndex: 1
                        }}
                        animate={{
                          scale: [1, 1.1, 1.3, 1.4, 1.3, 1.1, 1],
                          rotate: [0, 2, 5, 8, 5, 2, 0],
                          opacity: [0.8, 0.9, 1, 1, 0.9, 0.8, 0.6]
                        }}
                        transition={{
                          duration: 1.0,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Left Page Flip (flips from left to right) */}
                  {flipDirection === 'prev' && (
                    <motion.div
                      className="absolute top-0 left-0"
                      style={{ 
                        width: "400px",
                        height: "500px",
                        transformOrigin: "right center",
                        transformStyle: "preserve-3d"
                      }}
                      initial={{ 
                        rotateY: 0,
                        z: 0
                      }}
                      animate={{
                        rotateY: [0, 15, 45, 75, 105, 135, 165, 180],
                        z: [0, 10, 25, 40, 45, 35, 15, 0],
                        x: [0, 5, 15, 25, 20, 10, 3, 0]
                      }}
                      transition={{
                        duration: 1.0,
                        times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
                        ease: [0.25, 0.1, 0.25, 1.0]
                      }}
                    >
                      {/* Front Side of Left Page */}
                      <div 
                        className="absolute inset-0 bg-white"
                        style={{ 
                          backfaceVisibility: "hidden",
                          borderRadius: "8px 0 0 8px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 4px 0 12px rgba(0,0,0,0.1)",
                          background: "linear-gradient(90deg, #ffffff 0%, #ffffff 90%, rgba(248,249,250,0.8) 100%)"
                        }}
                      >
                        <div className="h-full w-full pointer-events-none select-none">
                          {renderPageContent(currentSpread.left, 'left')}
                        </div>
                        
                        {/* Page curl shadow effect */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.05) 80%, transparent 100%)",
                            borderRadius: "8px 0 0 8px"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.3, 0.6, 0.8, 0.6, 0.3, 0] }}
                          transition={{ 
                            duration: 1.0,
                            times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
                          }}
                        />
                      </div>

                      {/* Back Side of Left Page */}
                      <div 
                        className="absolute inset-0 bg-white"
                        style={{ 
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          borderRadius: "0 8px 8px 0",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset -4px 0 12px rgba(0,0,0,0.1)",
                          background: "linear-gradient(90deg, rgba(248,249,250,0.8) 0%, #ffffff 10%, #ffffff 100%)"
                        }}
                      >
                        <div className="h-full w-full pointer-events-none select-none transform scale-x-[-1]">
                          {renderPageContent(prevSpread.right, 'right')}
                        </div>
                      </div>

                      {/* Realistic page curl corner */}
                      <motion.div
                        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                        style={{
                          background: "linear-gradient(45deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.9) 50%, rgba(235,235,235,0.8) 100%)",
                          clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                          borderRadius: "0 0 8px 0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          zIndex: 1
                        }}
                        animate={{
                          scale: [1, 1.1, 1.3, 1.4, 1.3, 1.1, 1],
                          rotate: [0, -2, -5, -8, -5, -2, 0],
                          opacity: [0.8, 0.9, 1, 1, 0.9, 0.8, 0.6]
                        }}
                        transition={{
                          duration: 1.0,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Cast shadow on the base pages during flip */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: flipDirection === 'next' 
                        ? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
                        : "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                      zIndex: 10
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.2, 0.4, 0.3, 0.2, 0.1, 0] }}
                    transition={{
                      duration: 1.0,
                      times: [0, 0.15, 0.4, 0.6, 0.75, 0.9, 1]
                    }}
                  />
                </div>
              )}
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center -ml-16">
              <Button
                variant="ghost" 
                size="lg"
                onClick={() => flipSpread('prev')}
                disabled={currentSpreadIndex <= 0 || isFlipping}
                className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid="button-prev-spread"
              >
                <ChevronLeft size={24} />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center -mr-16">
              <Button
                variant="ghost" 
                size="lg"
                onClick={() => flipSpread('next')}
                disabled={currentSpreadIndex >= totalPages - 1 || isFlipping}
                className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid="button-next-spread"
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}