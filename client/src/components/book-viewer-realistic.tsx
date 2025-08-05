import React, { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import { BookProject } from "@/types/book";
import { getTemplateById } from "@/lib/templates";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookViewerRealisticProps {
  project: BookProject;
  onPageChange?: (pageIndex: number) => void;
}

export default function BookViewerRealistic({ project, onPageChange }: BookViewerRealisticProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderPageContent = (content: any, position: 'left' | 'right', pageNumber: number) => {
    // Handle completely empty or null content
    if (!content || !content.template) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 bg-white">
          <div className="text-center p-8">
            <div className="text-gray-300 mb-2">📄</div>
            <span className="text-sm">Empty page {pageNumber}</span>
          </div>
        </div>
      );
    }

    const template = getTemplateById(content.template);
    if (!template) {
      return (
        <div className="flex items-center justify-center h-full text-red-500 text-sm bg-white">
          <div className="text-center p-4">
            <p>Template not found: {content.template}</p>
          </div>
        </div>
      );
    }

    try {
      const contentData = content.content || template.defaultProps;
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
        <div className="flex items-center justify-center h-full text-red-500 text-sm bg-white">
          <div className="text-center p-4">
            <p>Error rendering template</p>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (!bookRef.current || !project.pages.length) return;

    // Initialize PageFlip
    const pageFlip = new PageFlip(bookRef.current, {
      width: 400,
      height: 500,
      size: "stretch",
      minWidth: 400,
      maxWidth: 800,
      minHeight: 500,
      maxHeight: 600,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      clickEventForward: true,
      usePortrait: false,
      startZIndex: 0,
      autoSize: false,
      swipeDistance: 30,
      showPageCorners: true,
      disableFlipByClick: false,
    });

    // Create pages array - each spread becomes two pages
    const pages: string[] = [];
    
    // Add cover page
    pages.push(`
      <div class="page-content bg-gradient-to-br from-bookcraft-primary to-bookcraft-primary-dark text-white flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-4">${project.title}</h1>
          <p class="text-lg opacity-90">BookCraft Digital Book</p>
        </div>
      </div>
    `);

    // Add content pages
    project.pages.forEach((page, index) => {
      // Left page
      pages.push(`
        <div class="page-content bg-white">
          <div id="left-page-${index}" class="h-full w-full"></div>
        </div>
      `);
      
      // Right page
      pages.push(`
        <div class="page-content bg-white">
          <div id="right-page-${index}" class="h-full w-full"></div>
        </div>
      `);
    });

    // Add back cover
    pages.push(`
      <div class="page-content bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div class="text-center">
          <p class="text-lg">Created with</p>
          <h2 class="text-2xl font-bold">BookCraft</h2>
        </div>
      </div>
    `);

    // Load pages into PageFlip
    pageFlip.loadFromHTML(pages);
    
    setTotalPages(pages.length);
    pageFlipRef.current = pageFlip;

    // Event listeners
    pageFlip.on("flip", (e) => {
      setCurrentPage(e.data);
      onPageChange?.(Math.floor(e.data / 2));
    });

    pageFlip.on("changeOrientation", (e) => {
      pageFlip.updateState();
    });

    // Wait for DOM to be ready then render React content
    setTimeout(() => {
      project.pages.forEach((page, index) => {
        const leftElement = document.getElementById(`left-page-${index}`);
        const rightElement = document.getElementById(`right-page-${index}`);
        
        if (leftElement && page.left) {
          const leftContent = renderPageContent(page.left, 'left', index * 2 + 1);
          const leftContainer = document.createElement('div');
          leftContainer.className = 'h-full w-full';
          leftElement.appendChild(leftContainer);
          
          // Use React.render equivalent
          import('react-dom/client').then(({ createRoot }) => {
            const root = createRoot(leftContainer);
            root.render(leftContent);
          });
        }
        
        if (rightElement && page.right) {
          const rightContent = renderPageContent(page.right, 'right', index * 2 + 2);
          const rightContainer = document.createElement('div');
          rightContainer.className = 'h-full w-full';
          rightElement.appendChild(rightContainer);
          
          // Use React.render equivalent
          import('react-dom/client').then(({ createRoot }) => {
            const root = createRoot(rightContainer);
            root.render(rightContent);
          });
        }
      });
    }, 100);

    return () => {
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
      }
    };
  }, [project, onPageChange]);

  const flipToNext = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  };

  const flipToPrev = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
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
              Page <span data-testid="text-current-page">{currentPage + 1}</span> of{" "}
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

      {/* Realistic Book Viewer */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-0 flex items-center -ml-16 z-10">
            <Button
              variant="ghost" 
              size="lg"
              onClick={flipToPrev}
              disabled={currentPage <= 0}
              className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="button-prev-page"
            >
              <ChevronLeft size={24} />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center -mr-16 z-10">
            <Button
              variant="ghost" 
              size="lg"
              onClick={flipToNext}
              disabled={currentPage >= totalPages - 1}
              className="h-12 w-12 rounded-full bg-black/10 hover:bg-black/20 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="button-next-page"
            >
              <ChevronRight size={24} />
            </Button>
          </div>

          {/* PageFlip Book Container */}
          <div 
            ref={bookRef}
            className="book-container"
            style={{
              width: '800px',
              height: '500px',
              margin: '0 auto'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .page-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .book-container {
          perspective: 2000px;
          perspective-origin: center center;
        }
        
        /* PageFlip library styling overrides */
        :global(.stf__parent) {
          margin: 0 auto;
        }
        
        :global(.stf__block) {
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        
        :global(.stf__item) {
          border-radius: 8px;
        }
        
        :global(.stf__outerShadow) {
          background: linear-gradient(to right, rgba(0,0,0,0.3), transparent);
        }
        
        :global(.stf__innerShadow) {
          background: linear-gradient(to left, rgba(0,0,0,0.2), transparent);
        }
      `}</style>
    </div>
  );
}