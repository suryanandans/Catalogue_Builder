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

    setIsFlipping(true);
    
    // Simulate page flip animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
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
        <div className="relative book-perspective">
          {/* Book Container */}
          <div className="relative flex" style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex"
              >
                {/* Left Page */}
                <motion.div
                  className="book-page bg-white rounded-l-xl shadow-2xl w-96 h-96 p-8 relative border-r border-gray-200"
                  animate={isFlipping ? { rotateY: -180 } : { rotateY: 0 }}
                  transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
                  style={{ transformOrigin: "right center" }}
                  data-testid="page-left"
                >
                  {renderPageContent(currentPage?.left, 'left')}
                </motion.div>

                {/* Right Page */}
                <motion.div
                  className="book-page bg-white rounded-r-xl shadow-2xl w-96 h-96 p-8 relative"
                  animate={isFlipping ? { rotateY: 180 } : { rotateY: 0 }}
                  transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
                  style={{ transformOrigin: "left center" }}
                  data-testid="page-right"
                >
                  {renderPageContent(currentPage?.right, 'right')}
                </motion.div>
              </motion.div>
            </AnimatePresence>
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
