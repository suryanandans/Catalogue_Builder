import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Undo, Redo, Save, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";
import { BookProject, BookPage, PageContent, Template } from "@/types/book";
import TemplateGrid from "@/components/template-grid";
import PageCanvas from "@/components/page-canvas";
import PropertiesPanel from "@/components/properties-panel";

export default function EditorPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentProject, setCurrentProject] = useState<BookProject | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedContent, setSelectedContent] = useState<PageContent | undefined>();

  useEffect(() => {
    // Load the most recent project
    const projects = LocalStorage.getProjects();
    if (projects.length > 0) {
      // Load the most recently updated project
      const sortedProjects = projects.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setCurrentProject(sortedProjects[0]);
    } else {
      // Create a new project if none exist
      const newProject = LocalStorage.createNewProject("My Digital Book");
      setCurrentProject(newProject);
    }
  }, []);

  const handleTemplateApply = (template: Template, position: 'left' | 'right') => {
    if (!currentProject) return;

    const newContent: PageContent = {
      id: crypto.randomUUID(),
      template: template.id,
      content: template.defaultProps,
      position
    };

    const updatedPages = [...currentProject.pages];
    const currentPage = updatedPages[currentPageIndex];
    
    if (position === 'left') {
      currentPage.left = newContent;
    } else {
      currentPage.right = newContent;
    }

    const updatedProject = {
      ...currentProject,
      pages: updatedPages
    };

    setCurrentProject(updatedProject);
    LocalStorage.saveProject(updatedProject);
    setSelectedContent(newContent);

    toast({
      title: "Template Applied",
      description: `${template.name} template added to ${position} page.`
    });
  };

  const handleContentUpdate = (content: PageContent) => {
    if (!currentProject) return;

    const updatedPages = [...currentProject.pages];
    const currentPage = updatedPages[currentPageIndex];
    
    if (content.position === 'left') {
      currentPage.left = content;
    } else {
      currentPage.right = content;
    }

    const updatedProject = {
      ...currentProject,
      pages: updatedPages
    };

    setCurrentProject(updatedProject);
    LocalStorage.saveProject(updatedProject);
    setSelectedContent(content);
  };

  const handleSave = () => {
    if (currentProject) {
      LocalStorage.saveProject(currentProject);
      toast({
        title: "Project Saved",
        description: "Your digital book has been saved successfully."
      });
    }
  };

  const handlePreview = () => {
    if (currentProject) {
      LocalStorage.saveProject(currentProject);
      navigate("/viewer");
    }
  };

  const addNewPage = () => {
    if (!currentProject) return;

    const newPage: BookPage = {
      id: crypto.randomUUID(),
      left: undefined,
      right: undefined
    };

    const updatedProject = {
      ...currentProject,
      pages: [...currentProject.pages, newPage]
    };

    setCurrentProject(updatedProject);
    LocalStorage.saveProject(updatedProject);
  };

  const navigatePage = (direction: 'prev' | 'next') => {
    if (!currentProject) return;

    if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (direction === 'next' && currentPageIndex < currentProject.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  if (!currentProject) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentPage = currentProject.pages[currentPageIndex];

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Templates */}
      <TemplateGrid onTemplateSelect={(template) => console.log("Template selected:", template)} />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-bookcraft-secondary" data-testid="text-project-title">
                {currentProject.title}
              </h3>
              <span className="text-sm text-gray-500" data-testid="text-page-counter">
                Page {currentPageIndex + 1}-{currentPageIndex + 2} of {currentProject.pages.length * 2}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" data-testid="button-undo">
                <Undo size={16} />
              </Button>
              <Button variant="ghost" size="sm" data-testid="button-redo">
                <Redo size={16} />
              </Button>
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <Button variant="outline" onClick={handleSave} data-testid="button-save">
                <Save className="mr-2" size={16} />
                Save
              </Button>
              <Button onClick={handlePreview} data-testid="button-preview">
                <Eye className="mr-2" size={16} />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Two-page spread */}
            <motion.div 
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PageCanvas
                pageContent={currentPage.left}
                position="left"
                onContentUpdate={handleContentUpdate}
                onTemplateApply={handleTemplateApply}
                onContentSelect={setSelectedContent}
              />
              <PageCanvas
                pageContent={currentPage.right}
                position="right"
                onContentUpdate={handleContentUpdate}
                onTemplateApply={handleTemplateApply}
                onContentSelect={setSelectedContent}
              />
            </motion.div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigatePage('prev')}
                disabled={currentPageIndex === 0}
                data-testid="button-prev-spread"
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="flex space-x-2">
                {currentProject.pages.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentPageIndex ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 text-xs"
                    onClick={() => setCurrentPageIndex(index)}
                    data-testid={`page-${index}`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 text-xs"
                  onClick={addNewPage}
                  data-testid="button-add-page"
                >
                  +
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigatePage('next')}
                disabled={currentPageIndex === currentProject.pages.length - 1}
                data-testid="button-next-spread"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <PropertiesPanel
        selectedContent={selectedContent}
        onContentUpdate={handleContentUpdate}
      />
    </div>
  );
}
