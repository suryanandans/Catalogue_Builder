import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Plus, Edit, Eye, Trash2, Book, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";
import { BookProject } from "@/types/book";

export default function MyBooksPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [projects, setProjects] = useState<BookProject[]>([]);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

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
    navigate(`/viewer?projectId=${projectId}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Book className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start creating your first digital book by clicking the "Create New Book" button above.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-bookcraft-primary hover:bg-blue-700"
              data-testid="button-create-first-book"
            >
              <Plus className="mr-2" size={16} />
              Create Your First Book
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-bookcraft-secondary line-clamp-2">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Project Statistics */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FileText className="mr-1" size={14} />
                          <span>{getPageCount(project)} pages</span>
                        </div>
                        <div className="flex items-center">
                          <Book className="mr-1" size={14} />
                          <span>{getContentCount(project)} layouts</span>
                        </div>
                      </div>
                      
                      {/* Last Modified */}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1" size={12} />
                        <span>Modified {formatDate(project.updatedAt)}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBook(project.id)}
                          className="flex-1"
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit className="mr-1" size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBook(project.id)}
                          className="flex-1"
                          data-testid={`button-view-${project.id}`}
                        >
                          <Eye className="mr-1" size={14} />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteProjectId(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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