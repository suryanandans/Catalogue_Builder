import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Plus, Edit, Eye, Trash2, Book, Calendar, FileText, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";
import { BookProject } from "@/types/book";
import { useSidebar } from "@/App";

export default function MyBooksPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isOpen } = useSidebar();
  const [projects, setProjects] = useState<BookProject[]>([]);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingThumbnail, setEditingThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = LocalStorage.getProjects();
    // Filter out demo projects for cleaner display
    const userProjects = allProjects.filter(p => !p.title.includes("Demo"));
    setProjects(userProjects.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));
  };

  const handleCreateBook = () => {
    if (!newBookTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your book.",
        variant: "destructive"
      });
      return;
    }

    const newProject = LocalStorage.createNewProject(newBookTitle.trim());
    toast({
      title: "Book Created",
      description: `"${newBookTitle}" has been created successfully.`
    });
    
    setNewBookTitle("");
    setIsCreateDialogOpen(false);
    loadProjects();
    
    // Navigate to editor with the new project
    navigate(`/editor?projectId=${newProject.id}`);
  };

  const handleDeleteBook = (projectId: string) => {
    LocalStorage.deleteProject(projectId);
    toast({
      title: "Book Deleted",
      description: "Your book has been permanently deleted."
    });
    loadProjects();
    setDeleteProjectId(null);
  };

  const handleEditBook = (projectId: string) => {
    navigate(`/editor?projectId=${projectId}`);
  };

  const handleViewBook = (projectId: string) => {
    navigate(`/viewer?projectId=${projectId}&from=books`);
  };

  const handleThumbnailUpload = (projectId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const project = LocalStorage.getProject(projectId);
        if (project) {
          (project as any).customThumbnail = result;
          LocalStorage.updateProject(project);
          loadProjects();
          toast({
            title: "Thumbnail Updated",
            description: "Your book thumbnail has been updated successfully."
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailClick = (projectId: string) => {
    setEditingThumbnail(projectId);
    fileInputRef.current?.click();
  };

  const getFirstPageThumbnail = (project: BookProject): string => {
    // Try to get the first page with content
    for (const page of project.pages) {
      if (page.left?.content?.image) {
        return page.left.content.image;
      }
      if (page.right?.content?.image) {
        return page.right.content.image;
      }
    }
    return '';
  };

  const getPageCount = (project: BookProject) => {
    return project.pages.length * 2; // Each spread has 2 pages
  };

  const getContentCount = (project: BookProject) => {
    let count = 0;
    project.pages.forEach(page => {
      if (page.left) count++;
      if (page.right) count++;
    });
    return count;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookThumbnail = (project: BookProject) => {
    // Return custom thumbnail if available
    if ((project as any).customThumbnail) {
      return (project as any).customThumbnail;
    }
    
    // Try to get first page image
    const firstPageImage = getFirstPageThumbnail(project);
    if (firstPageImage) {
      return firstPageImage;
    }
    
    // Generate a random gradient for each book based on its ID
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-teal-400 to-teal-600'
    ];
    
    const colorIndex = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
        !isOpen ? 'ml-80' : ''
      }`}>
      
      {/* Hidden file input for thumbnail upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editingThumbnail) {
            handleThumbnailUpload(editingThumbnail, file);
            setEditingThumbnail(null);
          }
        }}
      />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-bookcraft-secondary" data-testid="text-page-title">
              My Books
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and organize your digital book projects
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-bookcraft-primary hover:bg-blue-700"
                data-testid="button-create-new-book"
              >
                <Plus className="mr-2" size={16} />
                Create New Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Book</DialogTitle>
                <DialogDescription>
                  Give your new digital book a title to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Enter book title..."
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBook()}
                  data-testid="input-book-title"
                />
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel-create"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBook}
                  data-testid="button-confirm-create"
                >
                  Create Book
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Books Grid */}
        {projects.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Book className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No books yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start creating your first digital book and bring your stories to life with our interactive editor.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="bg-bookcraft-primary hover:bg-blue-700"
              data-testid="button-create-first-book"
            >
              <Plus className="mr-2" size={20} />
              Create Your First Book
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 overflow-hidden">
                  {/* 3D Book Thumbnail with Enhanced Appearance */}
                  <div className="relative p-4 bg-transparent">
                    <div className="relative group-hover:transform group-hover:-rotate-1 transition-transform duration-300">
                      {/* Book Shadow */}
                      <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-400/30 rounded transform rotate-1"></div>
                      
                      {/* Book Spine */}
                      <div className="absolute -right-3 top-2 w-4 h-[calc(100%-16px)] bg-gradient-to-b from-gray-400 to-gray-600 rounded-r-sm transform skew-y-1 shadow-md"></div>
                      
                      {/* Book Cover */}
                      <div className="relative h-56 bg-white border-2 border-gray-200 rounded-sm shadow-xl overflow-hidden aspect-[3/4] transform transition-all duration-300 group-hover:scale-105">
                        {/* Thumbnail content */}
                        {(() => {
                          const thumbnail = getBookThumbnail(project);
                          const isImage = thumbnail && (!thumbnail.startsWith('from-') && !thumbnail.includes('gradient'));
                          
                          if (isImage) {
                            return (
                              <div className="h-full relative">
                                <img 
                                  src={thumbnail} 
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 right-2 text-white">
                                  <div className="font-medium text-sm leading-tight line-clamp-2 drop-shadow-lg">
                                    {project.title}
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className={`h-full bg-gradient-to-br ${thumbnail} flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative z-10 text-center">
                                  <Book className="text-white/80 mx-auto mb-2" size={32} />
                                  <div className="text-white/90 font-medium text-sm px-2 leading-tight line-clamp-2">
                                    {project.title}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })()}
                        
                        {/* Thumbnail upload button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleThumbnailClick(project.id);
                            }}
                            className="w-8 h-8 p-1.5 bg-white/90 hover:bg-white"
                          >
                            <Upload size={12} />
                          </Button>
                        </div>
                        
                        {/* Hover overlay with quick actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleViewBook(project.id)}
                            className="opacity-90 hover:opacity-100"
                            data-testid={`button-quick-view-${project.id}`}
                          >
                            <Eye className="mr-1" size={14} />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditBook(project.id)}
                            className="opacity-90 hover:opacity-100"
                            data-testid={`button-quick-edit-${project.id}`}
                          >
                            <Edit className="mr-1" size={14} />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Book Title */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">
                        {project.title}
                      </h3>
                      
                      {/* Project Statistics */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FileText className="mr-1" size={12} />
                          <span>{getPageCount(project)} pages</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1" size={12} />
                          <span>{formatDate(project.updatedAt)}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBook(project.id)}
                          className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit className="mr-1" size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBook(project.id)}
                          className="flex-1 hover:bg-green-50 hover:border-green-200"
                          data-testid={`button-view-${project.id}`}
                        >
                          <Eye className="mr-1" size={14} />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleThumbnailClick(project.id)}
                          className="hover:bg-orange-50 hover:border-orange-200"
                          data-testid={`button-thumbnail-${project.id}`}
                        >
                          <Image size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteProjectId(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteProjectId(null)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteProjectId && handleDeleteBook(deleteProjectId)}
              data-testid="button-confirm-delete"
            >
              Delete Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}