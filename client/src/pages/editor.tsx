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
import EyeIconPalette from "@/components/eye-icon-palette";
import { useSidebar } from "@/App";

export default function EditorPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isOpen } = useSidebar();
  const [currentProject, setCurrentProject] = useState<BookProject | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedContent, setSelectedContent] = useState<PageContent | undefined>();
  const [activePanel, setActivePanel] = useState<'templates' | 'eyeicons'>('templates');
  const [saveTimeoutId, setSaveTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    // Force cleanup storage on component mount to prevent quota issues
    try {
      LocalStorage.forceCleanup();
    } catch (error) {
      console.error('Initial storage cleanup failed:', error);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const shouldCreateNew = urlParams.get('new') === 'true';
    const projectId = urlParams.get('projectId');
    
    if (shouldCreateNew) {
      // Create a brand new project
      const newProject = LocalStorage.createNewProject("My New Book");
      setCurrentProject(newProject);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (projectId) {
      // Load specific project by ID
      const project = LocalStorage.getProject(projectId);
      if (project) {
        setCurrentProject(project);
      } else {
        // Project not found, redirect to My Books
        navigate("/my-books");
        return;
      }
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      // Load the most recent project or create new one
      const projects = LocalStorage.getProjects();
      const userProjects = projects.filter(p => !p.title.includes("Demo"));
      
      if (userProjects.length > 0) {
        // Load the most recently updated user project
        const sortedProjects = userProjects.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setCurrentProject(sortedProjects[0]);
      } else {
        // No user projects exist, redirect to My Books to create one
        navigate("/my-books");
        return;
      }
    }
  }, [navigate]);

  const handleTemplateApply = (template: Template, position: 'left' | 'right') => {
    if (!currentProject) return;

    const newContent: PageContent = {
      id: crypto.randomUUID(),
      template: template.id,
      content: { ...template.defaultProps }, // Deep copy to avoid reference issues
      position
    };

    console.log("Editor: Applying template:", template.id, "with default props:", template.defaultProps);

    const updatedPages = [...currentProject.pages];
    const currentPage = updatedPages[currentPageIndex];
    
    if (position === 'left') {
      currentPage.left = newContent;
    } else {
      currentPage.right = newContent;
    }

    const updatedProject = {
      ...currentProject,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    LocalStorage.saveProject(updatedProject);
    setSelectedContent(newContent);

    console.log("Editor: Saved project with new content:", updatedProject);

    toast({
      title: "Template Applied",
      description: `${template.name} template added to ${position} page.`
    });
  };

  const handleContentDelete = (contentId: string) => {
    if (!currentProject) return;

    const updatedPages = [...currentProject.pages];
    const currentPage = updatedPages[currentPageIndex];
    
    if (currentPage.left?.id === contentId) {
      currentPage.left = undefined;
    } else if (currentPage.right?.id === contentId) {
      currentPage.right = undefined;
    }

    const updatedProject = {
      ...currentProject,
      pages: updatedPages
    };

    setCurrentProject(updatedProject);
    LocalStorage.saveProject(updatedProject);
    setSelectedContent(undefined);

    toast({
      title: "Layout Removed",
      description: "The selected layout has been deleted."
    });
  };

  const handleContentUpdate = (content: PageContent, immediate: boolean = false) => {
    if (!currentProject) return;

    console.log("Editor: Updating content:", content);

    const updatedPages = [...currentProject.pages];
    const currentPage = updatedPages[currentPageIndex];
    
    if (content.position === 'left') {
      currentPage.left = content;
    } else {
      currentPage.right = content;
    }

    const updatedProject = {
      ...currentProject,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProject);
    setSelectedContent(content);

    // Debounce saves during dragging to prevent quota exceeded errors
    if (immediate) {
      // Save immediately for important updates
      LocalStorage.saveProject(updatedProject);
    } else {
      // Debounce for frequent updates (like dragging)
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
      
      const newTimeoutId = window.setTimeout(() => {
        LocalStorage.saveProject(updatedProject);
        setSaveTimeoutId(null);
      }, 1000); // Save after 1 second of no updates
      
      setSaveTimeoutId(newTimeoutId);
    }
  };

  const handleSave = () => {
    if (currentProject) {
      try {
        LocalStorage.saveProject(currentProject);
        toast({
          title: "Project Saved",
          description: "Your digital book has been saved successfully."
        });
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Storage full. Try removing some images or old projects.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePreview = () => {
    if (currentProject) {
      LocalStorage.saveProject(currentProject);
      navigate(`/viewer?projectId=${currentProject.id}`);
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
    <div className={`flex h-screen transition-all duration-300 ${
      isOpen ? 'ml-80' : ''
    }`}>
      {/* Left Sidebar - Templates & Eye Icons */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActivePanel('templates')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activePanel === 'templates'
                ? 'bg-bookcraft-primary text-white'
                : 'text-gray-600 hover:text-bookcraft-primary hover:bg-gray-50'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActivePanel('eyeicons')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activePanel === 'eyeicons'
                ? 'bg-bookcraft-primary text-white'
                : 'text-gray-600 hover:text-bookcraft-primary hover:bg-gray-50'
            }`}
          >
            Eye Icons
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activePanel === 'templates' ? (
            <TemplateGrid onTemplateSelect={(template) => {
              console.log("Template selected:", template);
              // Template can be applied by drag and drop to canvas
            }} />
          ) : (
            <EyeIconPalette onStartDrag={(mediaLink) => {
              console.log("Eye icon drag started:", mediaLink);
              // Eye icon can be dragged to any media
            }} />
          )}
        </div>
      </div>

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
              
              <Button 
                variant="outline" 
                onClick={() => {
                  const newProject = LocalStorage.createNewProject("Untitled Book");
                  setCurrentProject(newProject);
                  setCurrentPageIndex(0);
                  setSelectedContent(undefined);
                  toast({
                    title: "New Project Created",
                    description: "Started a fresh book project."
                  });
                }} 
                data-testid="button-new-project"
              >
                New Project
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  try {
                    LocalStorage.forceCleanup();
                    toast({
                      title: "Storage Cleaned",
                      description: "Old projects removed to free up space."
                    });
                  } catch (error) {
                    toast({
                      title: "Cleanup Failed",
                      description: "Could not clean storage.",
                      variant: "destructive"
                    });
                  }
                }}
                className="text-xs"
              >
                Free Space
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/my-books")} 
                data-testid="button-back-to-books"
              >
                My Books
              </Button>
              
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
                onContentDelete={handleContentDelete}
              />
              <PageCanvas
                pageContent={currentPage.right}
                position="right"
                onContentUpdate={handleContentUpdate}
                onTemplateApply={handleTemplateApply}
                onContentSelect={setSelectedContent}
                onContentDelete={handleContentDelete}
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
      {selectedContent && (
        <div className="w-80 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
          <PropertiesPanel
            selectedContent={selectedContent}
            onContentUpdate={handleContentUpdate}
          />
        </div>
      )}
    </div>
  );
}
