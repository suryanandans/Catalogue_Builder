import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookProject, BookPage } from "@/types/book";
import { getTemplateById } from "@/lib/templates";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookViewerProps {
  project: BookProject;
  onPageChange?: (pageIndex: number) => void;
}

export default function BookViewer({ project, onPageChange }: BookViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const totalPages = project.pages.length;
  const currentPage = project.pages[currentPageIndex];

  const flipPage = async (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    let newIndex = currentPageIndex;
    
    if (direction === 'next' && currentPageIndex < totalPages - 1) {
      newIndex = currentPageIndex + 1;
    } else if (direction === 'prev' && currentPageIndex > 0) {
      newIndex = currentPageIndex - 1;
    } else {
      return;
    }

    setFlipDirection(direction);
    setIsFlipping(true);
    
    // More realistic page flip timing with staged animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setCurrentPageIndex(newIndex);
    onPageChange?.(newIndex);
    
    // Complete the flip animation
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsFlipping(false);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isFlipping) return;
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isFlipping) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const progress = Math.max(0, Math.min(1, Math.abs(clientX - centerX) / (rect.width / 2)));
    
    setDragProgress(progress);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (dragProgress > 0.3) {
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      
      if (clientX > centerX) {
        flipPage('next');
      } else {
        flipPage('prev');
      }
    }
    
    setDragProgress(0);
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
              Page <span data-testid="text-current-page">{currentPageIndex + 1}</span> of{" "}
              <span data-testid="text-total-pages">{totalPages}</span>
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

      {/* Book Viewer */}
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
            {/* Book Base (Always visible) */}
            <div className="flex relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Back/Left Page (static) */}
              <div className="book-page-static bg-white w-96 h-96 p-8 relative border-r border-gray-200 shadow-xl"
                   style={{ 
                     borderTopLeftRadius: "12px",
                     borderBottomLeftRadius: "12px",
                     boxShadow: "inset 3px 0 10px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.2)"
                   }}>
                {renderPageContent(currentPage?.left, 'left')}
              </div>

              {/* Realistic Page Flip Animation */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    className={`absolute top-0 w-96 h-96 ${
                      flipDirection === 'next' ? 'left-0' : 'right-0'
                    }`}
                    style={{ 
                      transformStyle: "preserve-3d",
                      zIndex: 15,
                      perspective: "1200px"
                    }}
                  >
                    {/* Flipping Page with Realistic Curl */}
                    <motion.div
                      className="page-flip-container absolute inset-0"
                      style={{
                        transformOrigin: flipDirection === 'next' ? "right center" : "left center",
                        transformStyle: "preserve-3d"
                      }}
                      initial={{ 
                        rotateY: 0,
                        scale: 1
                      }}
                      animate={{
                        rotateY: flipDirection === 'next' ? [-10, -45, -90, -135, -170, -180] : [10, 45, 90, 135, 170, 180],
                        scale: [1, 1.01, 1.03, 1.02, 1.01, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      {/* Page Front Side */}
                      <div 
                        className="absolute inset-0 page-surface bg-white p-8 shadow-2xl"
                        style={{ 
                          backfaceVisibility: "hidden",
                          borderRadius: flipDirection === 'next' ? "12px 0 0 12px" : "0 12px 12px 0",
                          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)"
                        }}
                      >
                        {flipDirection === 'next' 
                          ? renderPageContent(currentPage?.left, 'left')
                          : renderPageContent(currentPage?.right, 'right')
                        }

                        {/* Page curl shadow */}
                        <motion.div
                          className={`absolute inset-0 pointer-events-none ${
                            flipDirection === 'next' ? 'curl-shadow-right' : 'curl-shadow-left'
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.3, 0.6, 0.4, 0.2, 0] }}
                          transition={{ 
                            duration: 0.8,
                            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                          }}
                        />
                      </div>

                      {/* Page Back Side */}
                      <div 
                        className="absolute inset-0 page-surface bg-white p-8 shadow-2xl"
                        style={{ 
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          borderRadius: flipDirection === 'next' ? "0 12px 12px 0" : "12px 0 0 12px",
                          background: "linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)"
                        }}
                      >
                        <div className="transform scale-x-[-1]">
                          {flipDirection === 'next' && currentPageIndex < totalPages - 1 
                            ? renderPageContent(project.pages[currentPageIndex + 1]?.left, 'left')
                            : flipDirection === 'prev' && currentPageIndex > 0
                            ? renderPageContent(project.pages[currentPageIndex - 1]?.right, 'right')
                            : null
                          }
                        </div>
                      </div>

                      {/* Dynamic Page Curl Corner */}
                      <motion.div
                        className={`absolute w-12 h-12 ${
                          flipDirection === 'next' ? 'top-0 right-0' : 'top-0 left-0'
                        }`}
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)",
                          clipPath: flipDirection === 'next' 
                            ? "polygon(0 0, 100% 0, 0 100%)"
                            : "polygon(100% 0, 100% 100%, 0 0)",
                          borderRadius: flipDirection === 'next' ? "0 12px 0 0" : "12px 0 0 0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                          zIndex: 1
                        }}
                        animate={{
                          scale: [1, 1.2, 1.4, 1.2, 1.1, 1],
                          rotate: flipDirection === 'next' ? [0, -5, -10, -8, -3, 0] : [0, 5, 10, 8, 3, 0]
                        }}
                        transition={{
                          duration: 0.8,
                          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                          ease: "easeInOut"
                        }}
                      />

                      {/* Page Bend Highlight */}
                      <motion.div
                        className={`absolute top-0 bottom-0 w-1 ${
                          flipDirection === 'next' ? 'right-0' : 'left-0'
                        }`}
                        style={{
                          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 80%, transparent 100%)",
                          zIndex: 2
                        }}
                        animate={{
                          scaleY: [0.8, 1.1, 1.3, 1.1, 0.9, 0.8],
                          opacity: [0.3, 0.7, 1, 0.8, 0.5, 0.3]
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>

                    {/* Cast Shadow on Opposite Page */}
                    <motion.div
                      className={`absolute inset-0 pointer-events-none ${
                        flipDirection === 'next' ? 'shadow-cast-left' : 'shadow-cast-right'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.1, 0.3, 0.2, 0.1, 0] }}
                      transition={{
                        duration: 0.8,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right Page (static) */}
              <div className="book-page-static bg-white w-96 h-96 p-8 relative shadow-xl"
                   style={{ 
                     borderTopRightRadius: "12px",
                     borderBottomRightRadius: "12px",
                     boxShadow: "inset -3px 0 10px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.2)"
                   }}>
                {renderPageContent(currentPage?.right, 'right')}
              </div>
            </div>

            {/* Book spine shadow */}
            <div 
              className="absolute top-0 left-1/2 w-2 h-96 bg-gradient-to-r from-black/20 to-transparent"
              style={{ 
                transform: "translateX(-50%) translateZ(-1px)",
                borderRadius: "1px"
              }}
            />
          </div>

          {/* Page Turn Controls */}
          {currentPageIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={() => flipPage('prev')}
              disabled={isFlipping}
              data-testid="button-prev-page"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          
          {currentPageIndex < totalPages - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              onClick={() => flipPage('next')}
              disabled={isFlipping}
              data-testid="button-next-page"
            >
              <ChevronRight size={24} />
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          {project.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentPageIndex ? "bg-white" : "bg-white/50 hover:bg-white"
              }`}
              data-testid={`page-indicator-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
