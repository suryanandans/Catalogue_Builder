export interface MediaLink {
  url: string;
  title?: string;
}

export interface EyeIconInstance {
  id: string;
  position: { x: number; y: number };
  mediaLink: MediaLink;
}

export interface PageContent {
  id: string;
  template: string;
  content: Record<string, any>;
  position: 'left' | 'right';
  mediaLinks?: {
    [mediaId: string]: MediaLink;
  };
  eyeIcons?: EyeIconInstance[];
}

export interface BookPage {
  id: string;
  left?: PageContent;
  right?: PageContent;
}

export interface BookProject {
  id: string;
  title: string;
  pages: BookPage[];
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'photo' | 'text' | 'mixed';
  preview: React.ReactNode;
  content: (props: any) => React.ReactNode;
  defaultProps: Record<string, any>;
}
