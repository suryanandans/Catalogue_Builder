import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/lib/storage";
import { BookProject } from "@/types/book";
import BookViewer from "@/components/book-viewer-dual";

const createDemoContent = (demoProject: BookProject) => {
  // Create sample images as SVG data URLs for demo purposes
  const sampleImage1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4cHgiPkJvb2tDcmFmdCBEZW1vPC90ZXh0Pgo8L3N2Zz4K";
  const sampleImage2 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTBCOTgxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkltYWdlIDI8L3RleHQ+Cjwvc3ZnPgo=";
  const sampleImage3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjU5RTBCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkltYWdlIDM8L3RleHQ+Cjwvc3ZnPgo=";
  const sampleImage4 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRUY0NDQ0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkltYWdlIDQ8L3RleHQ+Cjwvc3ZnPgo=";

  demoProject.pages = [
    {
      id: "demo-page-1",
      left: {
        id: "demo-left-1",
        template: "text-article",
        content: {
          title: "Chapter 1: Welcome to BookCraft",
          content: "Welcome to your digital book! This is a demonstration of the flipbook viewer with realistic page-turning animations. BookCraft provides an intuitive drag-and-drop interface for creating beautiful digital publications."
        },
        position: "left"
      },
      right: {
        id: "demo-right-1",
        template: "hero-image",
        content: {
          title: "Beautiful Design & Functionality",
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
          title: "Interactive Content",
          text: "Combine text, images, and multimedia elements to create engaging digital experiences that captivate your readers.",
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
          title: "Getting Started",
          content: "Creating your first book is simple. Choose from our collection of professional templates, customize the content, and publish your digital masterpiece in minutes."
        },
        position: "right"
      }
    }
  ];
};

export default function ViewerPage() {
  const [, navigate] = useLocation();
  const [currentProject, setCurrentProject] = useState<BookProject | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    if (projectId) {
      // Load specific project by ID
      const project = LocalStorage.getProject(projectId);
      if (project) {
        console.log("Viewer: Loading specific project:", project.title, project);
        setCurrentProject(project);
      } else {
        // Project not found, redirect to My Books
        navigate("/my-books");
        return;
      }
    } else {
      // Load user projects, show the most recent non-demo project
      const projects = LocalStorage.getProjects();
      const userProjects = projects.filter(p => !p.title.includes("Demo"));
      console.log("Viewer: Found user projects:", userProjects.length, userProjects);
      
      if (userProjects.length > 0) {
        // Load the most recently updated user project
        const sortedProjects = userProjects.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        const project = sortedProjects[0];
        console.log("Viewer: Loading most recent project:", project.title, project);
        setCurrentProject(project);
      } else {
        // No user projects exist, redirect to My Books
        navigate("/my-books");
        return;
      }
    }
    
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  }, [navigate]);

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bookcraft-gray-900">
        <div className="text-white">Loading...</div>
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
              onClick={() => navigate(currentProject ? `/editor?projectId=${currentProject.id}` : "/my-books")}
              className="text-white/80 hover:text-white"
              data-testid="button-back-to-editor"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Editor
            </Button>
            
            <select
              onChange={(e) => {
                const projects = LocalStorage.getProjects();
                const userProjects = projects.filter(p => !p.title.includes("Demo"));
                const selectedProject = userProjects.find(p => p.id === e.target.value);
                if (selectedProject) {
                  console.log("Viewer: Switching to project:", selectedProject.title, selectedProject);
                  setCurrentProject(selectedProject);
                }
              }}
              value={currentProject?.id || ''}
              className="bg-black/30 text-white border border-white/20 rounded px-3 py-1 text-sm"
              data-testid="select-project"
            >
              {LocalStorage.getProjects().filter(p => !p.title.includes("Demo")).map(project => (
                <option key={project.id} value={project.id} className="text-black">
                  {project.title} ({project.pages.length} spreads)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book Viewer Component */}
      <BookViewer 
        project={currentProject}
        onPageChange={(spreadIndex) => console.log("Spread changed to:", spreadIndex)}
      />
    </div>
  );
}
