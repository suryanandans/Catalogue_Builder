import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/lib/storage";
import { BookProject } from "@/types/book";
import BookViewer from "@/components/book-viewer";

export default function ViewerPage() {
  const [, navigate] = useLocation();
  const [currentProject, setCurrentProject] = useState<BookProject | null>(null);

  useEffect(() => {
    // Load the most recent project or create a demo project
    const projects = LocalStorage.getProjects();
    if (projects.length > 0) {
      setCurrentProject(projects[0]);
    } else {
      // Create a demo project for viewing
      const demoProject = LocalStorage.createNewProject("Demo Book");
      
      // Add some demo content
      demoProject.pages = [
        {
          id: "demo-page-1",
          left: {
            id: "demo-left-1",
            template: "text-article",
            content: {
              title: "Chapter 1: Welcome",
              content: "Welcome to your digital book! This is a demonstration of the flipbook viewer with realistic page-turning animations."
            },
            position: "left"
          },
          right: {
            id: "demo-right-1",
            template: "hero-image",
            content: {
              title: "Beautiful Design",
              image: null
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
            template: "photo-grid",
            content: {
              images: []
            },
            position: "right"
          }
        }
      ];
      
      LocalStorage.saveProject(demoProject);
      setCurrentProject(demoProject);
    }
  }, []);

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
              onClick={() => navigate("/editor")}
              className="text-white/80 hover:text-white"
              data-testid="button-back-to-editor"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Editor
            </Button>
          </div>
        </div>
      </div>

      {/* Book Viewer Component */}
      <BookViewer 
        project={currentProject}
        onPageChange={(pageIndex) => console.log("Page changed to:", pageIndex)}
      />
    </div>
  );
}
