import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookProject } from "@/types/book";
import BookViewer from "@/components/book-viewer-dual";

// Static demo content that showcases BookCraft features
const createDemoProject = (): BookProject => {
  // Create sample images as SVG data URLs for demo purposes
  const sampleImage1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4cHgiPkJvb2tDcmFmdCBEZW1vPC90ZXh0Pgo8L3N2Zz4K";
  const sampleImage2 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTBCOTgxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkdhbGxlcnkgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";
  const sampleImage3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjU5RTBCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPlBob3RvZ3JhcGh5PC90ZXh0Pgo8L3N2Zz4K";
  const sampleImage4 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRUY0NDQ0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkFydCAmIERlc2lnbjwvdGV4dD4KICA8L3N2Zz4K";

  return {
    id: "demo-project",
    title: "BookCraft Demo Showcase",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: [
      {
        id: "demo-page-1",
        left: {
          id: "demo-left-1",
          template: "text-article",
          content: {
            title: "Welcome to BookCraft",
            content: "Experience the power of digital book creation with BookCraft. This demo showcases our drag-and-drop editor, professional templates, and realistic page-turning animations. Create beautiful catalogs, stories, and albums with ease."
          },
          position: "left"
        },
        right: {
          id: "demo-right-1",
          template: "hero-image",
          content: {
            title: "Professional & Beautiful",
            image: sampleImage1
          },
          position: "right"
        }
      },
      {
        id: "demo-page-2",
        left: {
          id: "demo-left-2",
          template: "quote-block",
          content: {
            quote: "Design is not just what it looks like and feels like. Design is how it works.",
            author: "Steve Jobs"
          },
          position: "left"
        },
        right: {
          id: "demo-right-2",
          template: "mixed-media",
          content: {
            title: "Interactive Features",
            content: "Combine text, images, and multimedia to create engaging experiences. Our templates are designed for professional results with minimal effort.",
            image: sampleImage2
          },
          position: "right"
        }
      },
      {
        id: "demo-page-3",
        left: {
          id: "demo-left-3",
          template: "photo-grid",
          content: {
            images: [sampleImage2, sampleImage3, sampleImage4, sampleImage1]
          },
          position: "left"
        },
        right: {
          id: "demo-right-3",
          template: "text-article",
          content: {
            title: "Getting Started is Easy",
            content: "1. Choose a template<br/>2. Add your content<br/>3. Customize the design<br/>4. Preview your book<br/>5. Share with the world<br/><br/>No technical skills required – just creativity!"
          },
          position: "right"
        }
      },
      {
        id: "demo-page-4",
        left: {
          id: "demo-left-4",
          template: "text-article",
          content: {
            title: "Ready to Begin?",
            content: "Start creating your own digital masterpiece today. With BookCraft, you have everything you need to bring your ideas to life in beautiful, interactive format."
          },
          position: "left"
        },
        right: {
          id: "demo-right-4",
          template: "hero-image",
          content: {
            title: "Start Creating Today",
            image: sampleImage4
          },
          position: "right"
        }
      }
    ]
  };
};

export default function DemoViewerPage() {
  const [, navigate] = useLocation();
  const [demoProject, setDemoProject] = useState<BookProject | null>(null);

  useEffect(() => {
    setDemoProject(createDemoProject());
  }, []);

  if (!demoProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bookcraft-gray-900">
        <div className="text-white">Loading demo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookcraft-gray-900">
      {/* Header with back button */}
      <div className="bg-black/50 backdrop-blur-sm text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white/80 hover:text-white"
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-2">
              <BookOpen className="text-blue-400" size={20} />
              <span className="font-medium">Demo Book</span>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/editor?new=true")}
            className="bg-bookcraft-primary hover:bg-blue-700"
            data-testid="button-start-creating"
          >
            Start Creating Your Own
          </Button>
        </div>
      </div>

      {/* Book Viewer Component */}
      <BookViewer 
        project={demoProject}
        onPageChange={(spreadIndex) => console.log("Demo spread changed to:", spreadIndex)}
      />
    </div>
  );
}