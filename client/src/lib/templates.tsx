import React from "react";
import { Template } from "@/types/book";
import { Grid, FileText, Image, Quote } from "lucide-react";

export const templates: Template[] = [
  {
    id: 'photo-grid',
    name: 'Photo Grid',
    category: 'photo',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex items-center justify-center">
        <Grid className="text-gray-400" size={16} />
      </div>
    ),
    content: (props) => (
      <div className="grid grid-cols-2 gap-2 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded object-cover w-full h-full flex items-center justify-center">
            <Image className="text-gray-400" size={24} />
          </div>
        ))}
      </div>
    ),
    defaultProps: {
      images: []
    }
  },
  {
    id: 'text-article',
    name: 'Article',
    category: 'text',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex flex-col justify-center p-2">
        <div className="h-1 bg-gray-300 rounded mb-1"></div>
        <div className="h-1 bg-gray-300 rounded mb-1"></div>
        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
      </div>
    ),
    content: (props) => (
      <div className="space-y-4 h-full">
        <h3 
          className="text-xl font-bold text-secondary" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-title"
        >
          {props.title || "Article Title"}
        </h3>
        <div 
          className="text-gray-700 text-sm leading-relaxed" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-content"
        >
          {props.content || "Start writing your article content here..."}
        </div>
      </div>
    ),
    defaultProps: {
      title: "Article Title",
      content: "Start writing your article content here..."
    }
  },
  {
    id: 'hero-image',
    name: 'Hero Image',
    category: 'photo',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex items-center justify-center">
        <Image className="text-gray-400" size={16} />
      </div>
    ),
    content: (props) => (
      <div className="relative h-full">
        <div className="bg-gray-200 rounded-lg object-cover w-full h-3/4 flex items-center justify-center">
          <Image className="text-gray-400" size={48} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg p-4">
          <h3 
            className="text-white font-bold" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-hero-title"
          >
            {props.title || "Hero Title"}
          </h3>
        </div>
      </div>
    ),
    defaultProps: {
      title: "Hero Title",
      image: null
    }
  },
  {
    id: 'quote-block',
    name: 'Quote',
    category: 'text',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex items-center justify-center">
        <Quote className="text-gray-400" size={16} />
      </div>
    ),
    content: (props) => (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <Quote className="text-3xl text-gray-300 mb-4 mx-auto" size={32} />
          <blockquote 
            className="text-lg font-medium text-gray-700 mb-4" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-quote"
          >
            {props.quote || "This is an inspiring quote that adds meaning to your content."}
          </blockquote>
          <cite 
            className="text-sm text-gray-500" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-author"
          >
            — {props.author || "Author Name"}
          </cite>
        </div>
      </div>
    ),
    defaultProps: {
      quote: "This is an inspiring quote that adds meaning to your content.",
      author: "Author Name"
    }
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter(template => template.category === category);
};