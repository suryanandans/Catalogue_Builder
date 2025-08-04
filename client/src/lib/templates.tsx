import React from "react";
import { Template } from "@/types/book";
import { Grid, FileText, Image, Quote, Image as ImageIcon } from "lucide-react";

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
      <div className="relative grid grid-cols-2 gap-2 h-full">
        {props.images && props.images.length > 0 ? (
          props.images.slice(0, 4).map((image: string, index: number) => (
            <img 
              key={index}
              src={image} 
              alt={`Grid image ${index + 1}`} 
              className="bg-gray-200 rounded object-cover w-full h-full"
              data-testid={`grid-image-${index}`}
            />
          ))
        ) : (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded object-cover w-full h-full flex items-center justify-center">
              {i === 1 ? (
                <div className="text-center text-gray-500">
                  <Image className="mx-auto mb-1" size={24} />
                  <p className="text-xs">Add photos</p>
                </div>
              ) : (
                <Image className="text-gray-400" size={20} />
              )}
            </div>
          ))
        )}
        {props.images && props.images.length > 4 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            +{props.images.length - 4} more
          </div>
        )}
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
          className="text-xl font-bold text-black" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-title"
          style={{ color: '#000000' }}
        >
          {props.title || "Article Title"}
        </h3>
        <div 
          className="text-black text-sm leading-relaxed" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-content"
          style={{ color: '#000000' }}
          dangerouslySetInnerHTML={{ __html: props.content || "Start writing your article content here..." }}
        />
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
        {props.image ? (
          <img 
            src={props.image} 
            alt={props.title || "Hero Image"} 
            className="w-full h-3/4 object-cover rounded-lg"
            data-testid="hero-image-display"
          />
        ) : (
          <div className="bg-gray-200 rounded-lg object-cover w-full h-3/4 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image className="mx-auto mb-2" size={48} />
              <p className="text-sm">Click Properties to add image</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg p-4">
          <h3 
            className="text-white font-bold" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-hero-title"
            style={{ color: '#ffffff' }}
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
            className="text-lg font-medium text-black mb-4" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-quote"
            style={{ color: '#000000' }}
            dangerouslySetInnerHTML={{ __html: props.quote || "This is an inspiring quote that adds meaning to your content." }}
          />
          <cite 
            className="text-sm text-black" 
            contentEditable 
            suppressContentEditableWarning={true}
            data-testid="text-author"
            style={{ color: '#000000' }}
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
  },
  {
    id: 'mixed-media',
    name: 'Mixed Media',
    category: 'mixed',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex flex-col p-2 gap-1">
        <div className="h-2 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
          <ImageIcon className="text-gray-400" size={12} />
        </div>
        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
      </div>
    ),
    content: (props) => (
      <div className="space-y-4 h-full">
        <h3 
          className="text-lg font-bold text-black" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-mixed-title"
          style={{ color: '#000000' }}
        >
          {props.title || "Mixed Content"}
        </h3>
        <div className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center min-h-32">
          {props.mediaUrl ? (
            props.mediaType === 'video' ? (
              <video 
                src={props.mediaUrl} 
                controls 
                className="max-w-full max-h-full rounded-lg"
                data-testid="mixed-video"
              />
            ) : (
              <img 
                src={props.mediaUrl} 
                alt="Media content" 
                className="max-w-full max-h-full object-cover rounded-lg"
                data-testid="mixed-image"
              />
            )
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="mx-auto mb-2" size={32} />
              <p className="text-sm">Click Properties to add media</p>
            </div>
          )}
        </div>
        <div 
          className="text-black text-sm leading-relaxed" 
          contentEditable 
          suppressContentEditableWarning={true}
          data-testid="text-mixed-content"
          style={{ color: '#000000' }}
          dangerouslySetInnerHTML={{ __html: props.content || "Add your description here..." }}
        />
      </div>
    ),
    defaultProps: {
      title: "Mixed Content",
      content: "Add your description here...",
      mediaUrl: null,
      mediaType: null
    }
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter(template => template.category === category);
};