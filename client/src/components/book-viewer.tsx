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
    
    // Realistic page flip timing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setCurrentPageIndex(newIndex);
    onPageChange?.(newIndex);
    setIsFlipping(false);
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
          <div className="relative book-container" style={{ transformStyle: "preserve-3d" }}>
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

              {/* Flipping Page Overlay */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    className={`absolute top-0 book-page-flip bg-white w-96 h-96 p-8 ${
                      flipDirection === 'next' 
                        ? 'left-0 border-r border-gray-200' 
                        : 'right-0 border-l border-gray-200'
                    }`}
                    style={{ 
                      transformOrigin: flipDirection === 'next' ? "right center" : "left center",
                      transformStyle: "preserve-3d",
                      zIndex: 10,
                      borderTopLeftRadius: flipDirection === 'next' ? "12px" : "0px",
                      borderBottomLeftRadius: flipDirection === 'next' ? "12px" : "0px",
                      borderTopRightRadius: flipDirection === 'prev' ? "12px" : "0px",
                      borderBottomRightRadius: flipDirection === 'prev' ? "12px" : "0px",
                      boxShadow: "0 0 30px rgba(0,0,0,0.4)"
                    }}
                    initial={{ 
                      rotateY: 0,
                      scale: 1,
                      boxShadow: "0 0 20px rgba(0,0,0,0.2)"
                    }}
                    animate={{ 
                      rotateY: flipDirection === 'next' ? -180 : 180,
                      scale: 1.02,
                      boxShadow: flipDirection === 'next' 
                        ? "20px 20px 60px rgba(0,0,0,0.5)"
                        : "-20px 20px 60px rgba(0,0,0,0.5)"
                    }}
                    exit={{ 
                      rotateY: flipDirection === 'next' ? -180 : 180,
                      scale: 1,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      scale: { duration: 0.6 },
                      boxShadow: { duration: 0.8 }
                    }}
                  >
                    {/* Front side of flipping page */}
                    <div className="absolute inset-0 p-8" style={{ backfaceVisibility: "hidden" }}>
                      {flipDirection === 'next' 
                        ? renderPageContent(currentPage?.left, 'left')
                        : renderPageContent(currentPage?.right, 'right')
                      }
                    </div>
                    
                    {/* Back side of flipping page */}
                    <div 
                      className="absolute inset-0 p-8 bg-white" 
                      style={{ 
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        borderTopRightRadius: flipDirection === 'next' ? "12px" : "0px",
                        borderBottomRightRadius: flipDirection === 'next' ? "12px" : "0px",
                        borderTopLeftRadius: flipDirection === 'prev' ? "12px" : "0px",
                        borderBottomLeftRadius: flipDirection === 'prev' ? "12px" : "0px"
                      }}
                    >
                      {/* Next/Previous page content preview */}
                      <div className="opacity-90">
                        {flipDirection === 'next' && currentPageIndex < totalPages - 1 
                          ? renderPageContent(project.pages[currentPageIndex + 1]?.left, 'left')
                          : flipDirection === 'prev' && currentPageIndex > 0
                          ? renderPageContent(project.pages[currentPageIndex - 1]?.right, 'right')
                          : null
                        }
                      </div>
                    </div>

                    {/* Page fold highlight and shadow */}
                    <div 
                      className={`absolute top-0 w-1 h-full ${
                        flipDirection === 'next' 
                          ? 'right-0 bg-gradient-to-r from-transparent to-black/20' 
                          : 'left-0 bg-gradient-to-l from-transparent to-black/20'
                      }`}
                      style={{ 
                        transform: "translateZ(1px)",
                        borderTopRightRadius: flipDirection === 'next' ? "12px" : "0px",
                        borderBottomRightRadius: flipDirection === 'next' ? "12px" : "0px",
                        borderTopLeftRadius: flipDirection === 'prev' ? "12px" : "0px",
                        borderBottomLeftRadius: flipDirection === 'prev' ? "12px" : "0px"
                      }}
                    />

                    {/* Curling corner effect */}
                    <motion.div
                      className={`absolute ${
                        flipDirection === 'next' ? 'top-0 right-0' : 'top-0 left-0'
                      } w-8 h-8 bg-gradient-to-br from-white to-gray-100`}
                      style={{
                        clipPath: flipDirection === 'next' 
                          ? "polygon(0 0, 100% 0, 0 100%)"
                          : "polygon(100% 0, 100% 100%, 0 0)",
                        borderTopRightRadius: flipDirection === 'next' ? "12px" : "0px",
                        borderTopLeftRadius: flipDirection === 'prev' ? "12px" : "0px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: 0,
                        ease: "easeInOut"
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
