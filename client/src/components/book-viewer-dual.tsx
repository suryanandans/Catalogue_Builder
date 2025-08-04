import { useState, useEffect } from "react";
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
  const totalSpreads = Math.ceil(totalPages / 2);
  
  const getCurrentSpread = () => {
    const leftPage = project.pages[currentSpreadIndex * 2];
    const rightPage = project.pages[currentSpreadIndex * 2 + 1];
    return { left: leftPage, right: rightPage };
  };
  
  const getNextSpread = () => {
    if (currentSpreadIndex >= totalSpreads - 1) return { left: null, right: null };
    const leftPage = project.pages[(currentSpreadIndex + 1) * 2];
    const rightPage = project.pages[(currentSpreadIndex + 1) * 2 + 1];
    return { left: leftPage, right: rightPage };
  };
  
  const getPrevSpread = () => {
    if (currentSpreadIndex <= 0) return { left: null, right: null };
    const leftPage = project.pages[(currentSpreadIndex - 1) * 2];
    const rightPage = project.pages[(currentSpreadIndex - 1) * 2 + 1];
    return { left: leftPage, right: rightPage };
  };

  const currentSpread = getCurrentSpread();
  const nextSpread = getNextSpread();
  const prevSpread = getPrevSpread();

  const flipSpread = async (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    let newSpreadIndex = currentSpreadIndex;
    
    if (direction === 'next' && currentSpreadIndex < totalSpreads - 1) {
      newSpreadIndex = currentSpreadIndex + 1;
    } else if (direction === 'prev' && currentSpreadIndex > 0) {
      newSpreadIndex = currentSpreadIndex - 1;
    } else {
      return;
    }

    setFlipDirection(direction);
    setIsFlipping(true);
    
    // Enhanced page flip timing for dual-page spread
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setCurrentSpreadIndex(newSpreadIndex);
    onPageChange?.(newSpreadIndex * 2);
    
    // Complete the flip animation
    await new Promise(resolve => setTimeout(resolve, 600));
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
      if (currentDragValue > 0 && currentSpreadIndex < totalSpreads - 1) {
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
    if (!content) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <span>Empty page</span>
        </div>
      );
    }

    const template = getTemplateById(content.template);
    if (!template) {
      return <div className="text-red-500">Template not found</div>;
    }

    return template.content(content.content);
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
              Spread <span data-testid="text-current-spread">{currentSpreadIndex + 1}</span> of{" "}
              <span data-testid="text-total-spreads">{totalSpreads}</span>
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
              <div className="book-page-static bg-white w-96 h-96 p-8 relative border-r border-gray-200 shadow-xl"
                   style={{ 
                     borderTopLeftRadius: "12px",
                     borderBottomLeftRadius: "12px",
                     boxShadow: "inset 3px 0 10px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.2)"
                   }}>
                {renderPageContent(currentSpread.left, 'left')}
              </div>

              {/* Right Page */}
              <div className="book-page-static bg-white w-96 h-96 p-8 relative shadow-xl"
                   style={{ 
                     borderTopRightRadius: "12px",
                     borderBottomRightRadius: "12px",
                     boxShadow: "inset -3px 0 10px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.2)"
                   }}>
                {renderPageContent(currentSpread.right, 'right')}
              </div>
            </div>

            {/* Dual-Page Spread Flip Animation */}
            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  className="absolute top-0 left-0 w-full h-96"
                  style={{ 
                    transformStyle: "preserve-3d",
                    zIndex: 15,
                    perspective: "2000px"
                  }}
                >
                  {/* Flipping Spread Container */}
                  <motion.div
                    className="absolute inset-0 flex"
                    style={{
                      transformOrigin: flipDirection === 'next' ? "right center" : "left center",
                      transformStyle: "preserve-3d"
                    }}
                    initial={{ 
                      rotateY: 0,
                      scale: 1
                    }}
                    animate={{
                      rotateY: flipDirection === 'next' ? [0, -15, -45, -90, -135, -165, -180] : [0, 15, 45, 90, 135, 165, 180],
                      scale: [1, 1.02, 1.05, 1.08, 1.05, 1.02, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    {/* Front Side of Flipping Spread */}
                    <div 
                      className="flex w-full h-full"
                      style={{ 
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)"
                      }}
                    >
                      {/* Current Left Page */}
                      <div className="w-96 h-96 p-8 relative shadow-2xl page-surface"
                           style={{ 
                             borderTopLeftRadius: "12px",
                             borderBottomLeftRadius: "12px",
                             borderRight: "1px solid rgba(0,0,0,0.1)"
                           }}>
                        {renderPageContent(currentSpread.left, 'left')}
                      </div>
                      
                      {/* Current Right Page */}
                      <div className="w-96 h-96 p-8 relative shadow-2xl page-surface"
                           style={{ 
                             borderTopRightRadius: "12px",
                             borderBottomRightRadius: "12px"
                           }}>
                        {renderPageContent(currentSpread.right, 'right')}
                      </div>
                    </div>

                    {/* Back Side of Flipping Spread (next/prev spread) */}
                    <div 
                      className="absolute inset-0 flex w-full h-full"
                      style={{ 
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)"
                      }}
                    >
                      <div className="transform scale-x-[-1] flex w-full">
                        {/* Next/Prev Left Page */}
                        <div className="w-96 h-96 p-8 relative shadow-2xl page-surface"
                             style={{ 
                               borderTopLeftRadius: "12px",
                               borderBottomLeftRadius: "12px",
                               borderRight: "1px solid rgba(0,0,0,0.1)"
                             }}>
                          {flipDirection === 'next' 
                            ? renderPageContent(nextSpread.left, 'left')
                            : renderPageContent(prevSpread.left, 'left')
                          }
                        </div>
                        
                        {/* Next/Prev Right Page */}
                        <div className="w-96 h-96 p-8 relative shadow-2xl page-surface"
                             style={{ 
                               borderTopRightRadius: "12px",
                               borderBottomRightRadius: "12px"
                             }}>
                          {flipDirection === 'next' 
                            ? renderPageContent(nextSpread.right, 'right')
                            : renderPageContent(prevSpread.right, 'right')
                          }
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Curling Effects for Dual-Page */}
                    <motion.div
                      className={`absolute w-16 h-16 ${
                        flipDirection === 'next' ? 'top-0 right-0' : 'top-0 left-0'
                      }`}
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)",
                        clipPath: flipDirection === 'next' 
                          ? "polygon(0 0, 100% 0, 0 100%)"
                          : "polygon(100% 0, 100% 100%, 0 0)",
                        borderRadius: flipDirection === 'next' ? "0 12px 0 0" : "12px 0 0 0",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        zIndex: 1
                      }}
                      animate={{
                        scale: [1, 1.3, 1.6, 1.4, 1.2, 1],
                        rotate: flipDirection === 'next' ? [0, -8, -15, -12, -5, 0] : [0, 8, 15, 12, 5, 0]
                      }}
                      transition={{
                        duration: 1.2,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        ease: "easeInOut"
                      }}
                    />

                    {/* Spread Shadow Cast */}
                    <motion.div
                      className={`absolute inset-0 pointer-events-none ${
                        flipDirection === 'next' ? 'shadow-cast-left' : 'shadow-cast-right'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.15, 0.4, 0.3, 0.15, 0] }}
                      transition={{
                        duration: 1.2,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Book spine shadow */}
            <div 
              className="absolute top-0 left-1/2 w-2 h-96 bg-gradient-to-r from-black/20 to-transparent"
              style={{ 
                transform: "translateX(-50%) translateZ(-1px)",
                borderRadius: "1px"
              }}
            />
          </div>

          {/* Spread Navigation Controls */}
          {currentSpreadIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={() => flipSpread('prev')}
              disabled={isFlipping}
              data-testid="button-prev-spread"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          
          {currentSpreadIndex < totalSpreads - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={() => flipSpread('next')}
              disabled={isFlipping}
              data-testid="button-next-spread"
            >
              <ChevronRight size={24} />
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Spread Indicators */}
      <div className="bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          {Array.from({ length: totalSpreads }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSpreadIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSpreadIndex ? "bg-white" : "bg-white/50 hover:bg-white"
              }`}
              data-testid={`spread-indicator-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}