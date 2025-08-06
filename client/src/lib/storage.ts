import { BookProject, BookPage } from "@/types/book";

const STORAGE_KEY = 'bookcraft_projects';

export class LocalStorage {
  static getProjects(): BookProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveProject(project: BookProject): void {
    try {
      const projects = this.getProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
      } else {
        projects.push(project);
      }
      
      // Check data size and cleanup if needed
      const serializedData = JSON.stringify(projects);
      if (serializedData.length > 4.5 * 1024 * 1024) { // 4.5MB threshold
        console.warn('Storage approaching limit, cleaning up old projects');
        this.cleanupOldProjects(projects);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded, attempting cleanup');
        this.handleQuotaExceeded(project);
      } else {
        console.error('Failed to save project:', error);
        // Don't throw error to prevent UI crashes
      }
    }
  }

  static handleQuotaExceeded(currentProject: BookProject): void {
    try {
      const projects = this.getProjects();
      
      // Remove old demo projects first
      let cleanedProjects = projects.filter(p => !p.title.toLowerCase().includes('demo'));
      
      // If still too large, keep only the most recent 3 projects plus current
      if (cleanedProjects.length > 3) {
        cleanedProjects = cleanedProjects
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3);
      }
      
      // Add current project
      const index = cleanedProjects.findIndex(p => p.id === currentProject.id);
      if (index >= 0) {
        cleanedProjects[index] = currentProject;
      } else {
        cleanedProjects.push(currentProject);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProjects));
      console.log('Storage cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup storage:', error);
      // As last resort, save only current project
      localStorage.setItem(STORAGE_KEY, JSON.stringify([currentProject]));
    }
  }

  static cleanupOldProjects(projects: BookProject[]): void {
    // Remove projects older than 30 days or demo projects
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProjects = projects.filter(p => 
      new Date(p.updatedAt) > thirtyDaysAgo && !p.title.toLowerCase().includes('demo')
    );
    
    // If still too many, keep only the 5 most recent
    let finalProjects = recentProjects;
    if (finalProjects.length > 5) {
      finalProjects = finalProjects
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
    }
    
    if (finalProjects.length < projects.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProjects));
      console.log(`Cleaned up ${projects.length - finalProjects.length} old projects`);
    }
  }

  // Force cleanup storage to resolve current quota issues
  static forceCleanup(): void {
    try {
      const projects = this.getProjects();
      console.log(`Current projects: ${projects.length}`);
      
      // Keep only the 2 most recent user projects
      const userProjects = projects
        .filter(p => !p.title.toLowerCase().includes('demo'))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 2);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProjects));
      console.log(`Force cleanup complete, kept ${userProjects.length} projects`);
    } catch (error) {
      console.error('Force cleanup failed:', error);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }

  static getProject(id: string): BookProject | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  static createNewProject(title: string = "Untitled Book"): BookProject {
    const project: BookProject = {
      id: crypto.randomUUID(),
      title,
      pages: [
        {
          id: crypto.randomUUID(),
          left: undefined,
          right: undefined
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.saveProject(project);
    return project;
  }

  static updateProject(project: BookProject): void {
    this.saveProject({ ...project, updatedAt: new Date().toISOString() });
  }
}
