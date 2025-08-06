import React from "react";
import { Template } from "@/types/book";
import { Grid, FileText, Image, Quote, Image as ImageIcon, Play, Video } from "lucide-react";
import MediaWithDraggableIcons from "@/components/media-with-draggable-icons";

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
            <MediaWithDraggableIcons
              key={index}
              eyeIcons={props.eyeIcons?.filter((icon: any) => icon.mediaIndex === index) || []}
              onEyeIconsUpdate={(eyeIcons) => {
                if (props.onEyeIconsUpdate) {
                  const updatedIcons = eyeIcons.map(icon => ({ ...icon, mediaIndex: index }));
                  const otherIcons = (props.eyeIcons || []).filter((icon: any) => icon.mediaIndex !== index);
                  props.onEyeIconsUpdate([...otherIcons, ...updatedIcons]);
                }
              }}
              className="bg-gray-200 rounded w-full h-full"
              isPreview={props.isPreview}
            >
              <img 
                src={image} 
                alt={`Grid image ${index + 1}`} 
                className={`rounded w-full h-full ${props.imageFit || 'object-cover'}`}
                data-testid={`grid-image-${index}`}
              />
            </MediaWithDraggableIcons>
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
      <div 
        className="space-y-4 h-full p-4 rounded-lg"
        style={{ 
          backgroundColor: props.backgroundColor || 'transparent',
          backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h3 
          className="text-xl font-bold text-black" 
          data-testid="text-title"
          style={{ color: '#000000' }}
        >
          {props.title || "Article Title"}
        </h3>
        <div 
          className="text-black text-sm leading-relaxed" 
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
      <div 
        className="relative h-full w-full p-4 rounded-lg"
        style={{ 
          backgroundColor: props.backgroundColor || 'transparent',
          backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {props.image ? (
          <MediaWithDraggableIcons
            eyeIcons={props.eyeIcons || []}
            onEyeIconsUpdate={props.onEyeIconsUpdate || (() => {})}
            className="w-full h-full"
            isPreview={props.isPreview}
          >
            <img 
              src={props.image} 
              alt={props.title || "Hero Image"} 
              className={`w-full h-full ${props.imageFit || 'object-cover'}`}
              style={{ borderRadius: "4px" }}
              data-testid="hero-image-display"
            />
          </MediaWithDraggableIcons>
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center" style={{ borderRadius: "4px" }}>
            <div className="text-center text-gray-500">
              <Image className="mx-auto mb-2" size={48} />
              <p className="text-sm">Add image in editor</p>
            </div>
          </div>
        )}
        {props.title && props.title.trim() && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4" style={{ borderRadius: "0 0 4px 4px" }}>
            <h3 
              className="text-white font-bold text-lg" 
              data-testid="text-hero-title"
              style={{ color: '#ffffff' }}
            >
              {props.title}
            </h3>
          </div>
        )}
      </div>
    ),
    defaultProps: {
      title: "",
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
      <div 
        className="flex items-center justify-center h-full text-center p-4 rounded-lg"
        style={{ 
          backgroundColor: props.backgroundColor || 'transparent',
          backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div>
          <Quote className="text-3xl text-gray-300 mb-4 mx-auto" size={32} />
          <blockquote 
            className="text-lg font-medium text-black mb-4" 
            data-testid="text-quote"
            style={{ color: '#000000' }}
            dangerouslySetInnerHTML={{ __html: props.quote || "This is an inspiring quote that adds meaning to your content." }}
          />
          {props.author && props.author.trim() && (
            <cite 
              className="text-sm text-black" 
              data-testid="text-author"
              style={{ color: '#000000' }}
            >
              — {props.author}
            </cite>
          )}
        </div>
      </div>
    ),
    defaultProps: {
      quote: "This is an inspiring quote that adds meaning to your content.",
      author: ""
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
      <div 
        className="space-y-4 h-full p-4 rounded-lg"
        style={{ 
          backgroundColor: props.backgroundColor || 'transparent',
          backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h3 
          className="text-lg font-bold text-black" 
          data-testid="text-mixed-title"
          style={{ color: '#000000' }}
        >
          {props.title || "Mixed Content"}
        </h3>
        <div 
          className="flex-1 bg-gray-200 rounded-lg flex items-center justify-center min-h-32"
          style={{
            width: `${props.mediaWidth || 100}%`,
            height: `${props.mediaHeight || 100}%`,
            borderRadius: `${props.mediaBorderRadius || 8}px`,
            margin: '0 auto'
          }}
        >
          {props.image ? (
            <MediaWithDraggableIcons
              eyeIcons={props.eyeIcons || []}
              onEyeIconsUpdate={props.onEyeIconsUpdate || (() => {})}
              className="w-full h-full"
            >
              <img 
                src={props.image} 
                alt="Media content" 
                className={`w-full h-full ${props.imageFit || 'object-cover'}`}
                style={{ borderRadius: `${props.mediaBorderRadius || 8}px` }}
                data-testid="mixed-image"
              />
            </MediaWithDraggableIcons>
          ) : props.videoUrl ? (
            <MediaWithDraggableIcons
              eyeIcons={props.eyeIcons || []}
              onEyeIconsUpdate={props.onEyeIconsUpdate || (() => {})}
              className="w-full h-full"
              isPreview={props.isPreview}
            >
              <video 
                src={props.videoUrl} 
                controls 
                autoPlay={props.isPreview}
                muted={props.isPreview}
                loop={props.isPreview}
                className={`w-full h-full ${props.videoFit || 'object-cover'}`}
                style={{ borderRadius: `${props.mediaBorderRadius || 8}px` }}
                data-testid="mixed-video"
              />
            </MediaWithDraggableIcons>
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
      image: null
    }
  },
  {
    id: 'video-player',
    name: 'Video Player',
    category: 'mixed',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex items-center justify-center">
        <Play className="text-gray-400" size={16} />
      </div>
    ),
    content: (props) => (
      <div className="relative h-full w-full bg-black rounded-lg overflow-hidden">
        {props.videoUrl ? (
          <MediaWithDraggableIcons
            eyeIcons={props.eyeIcons || []}
            onEyeIconsUpdate={props.onEyeIconsUpdate || (() => {})}
            className="w-full h-full"
            isPreview={props.isPreview}
          >
            <video 
              src={props.videoUrl} 
              controls 
              autoPlay={props.isPreview}
              muted={props.isPreview}
              loop={props.isPreview}
              className="w-full h-full object-cover"
              data-testid="video-player"
              poster={props.thumbnail}
            />
          </MediaWithDraggableIcons>
        ) : (
          <div className="bg-gray-900 w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="mx-auto mb-2" size={48} />
              <p className="text-sm">Add video in Properties panel</p>
              <p className="text-xs text-gray-400 mt-1">Supports MP4, WebM formats</p>
            </div>
          </div>
        )}
        {props.title && props.title.trim() && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 
              className="text-white font-semibold text-sm" 
              data-testid="text-video-title"
              style={{ color: '#ffffff' }}
            >
              {props.title}
            </h3>
          </div>
        )}
      </div>
    ),
    defaultProps: {
      title: "",
      videoUrl: null,
      thumbnail: null
    }
  },
  {
    id: 'video-gallery',
    name: 'Video Gallery',
    category: 'mixed',
    preview: (
      <div className="aspect-square bg-white rounded border-2 mb-2 flex flex-col p-1 gap-1">
        <div className="flex gap-1 flex-1">
          <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
            <Play className="text-gray-400" size={8} />
          </div>
          <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
            <Play className="text-gray-400" size={8} />
          </div>
        </div>
        <div className="flex gap-1 flex-1">
          <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
            <Play className="text-gray-400" size={8} />
          </div>
          <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
            <Play className="text-gray-400" size={8} />
          </div>
        </div>
      </div>
    ),
    content: (props) => (
      <div className="h-full">
        <h3 
          className="text-lg font-bold text-black mb-3" 
          data-testid="text-gallery-title"
          style={{ color: '#000000' }}
        >
          {props.title || "Video Gallery"}
        </h3>
        <div className="grid grid-cols-2 gap-2 h-4/5">
          {props.videos && props.videos.length > 0 ? (
            props.videos.slice(0, 4).map((video: any, index: number) => (
              <MediaWithDraggableIcons
                key={index}
                eyeIcons={props.eyeIcons?.filter((icon: any) => icon.mediaIndex === index) || []}
                onEyeIconsUpdate={(eyeIcons) => {
                  if (props.onEyeIconsUpdate) {
                    const updatedIcons = eyeIcons.map(icon => ({ ...icon, mediaIndex: index }));
                    const otherIcons = (props.eyeIcons || []).filter((icon: any) => icon.mediaIndex !== index);
                    props.onEyeIconsUpdate([...otherIcons, ...updatedIcons]);
                  }
                }}
                className="relative bg-black rounded overflow-hidden group cursor-pointer"
                isPreview={props.isPreview}
              >
                <video 
                  src={video.url} 
                  className="w-full h-full object-cover"
                  data-testid={`gallery-video-${index}`}
                  poster={video.thumbnail}
                  muted
                  autoPlay={props.isPreview}
                  loop={props.isPreview}
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Play className="text-white opacity-70 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
                {video.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{video.title}</p>
                  </div>
                )}
              </MediaWithDraggableIcons>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded flex items-center justify-center">
                {i === 1 ? (
                  <div className="text-center text-gray-500">
                    <Video className="mx-auto mb-1" size={20} />
                    <p className="text-xs">Add videos</p>
                  </div>
                ) : (
                  <Play className="text-gray-400" size={16} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    ),
    defaultProps: {
      title: "Video Gallery",
      videos: []
    }
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter(template => template.category === category);
};