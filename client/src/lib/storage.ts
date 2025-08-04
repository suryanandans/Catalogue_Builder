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
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
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
}
