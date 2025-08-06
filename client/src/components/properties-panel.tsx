import { useState } from "react";
import { PageContent, MediaLink } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Upload, Image, Video, Bold, Italic, Underline, Type, Play } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";
import MediaLinkManager from "@/components/media-link-manager";

interface PropertiesPanelProps {
  selectedContent?: PageContent;
  onContentUpdate?: (content: PageContent) => void;
}

export default function PropertiesPanel({ selectedContent, onContentUpdate }: PropertiesPanelProps) {
  const [fontSize, setFontSize] = useState([16]);
  const [textColor, setTextColor] = useState("#000000");

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Dark Gray", value: "#374151" },
    { name: "Gray", value: "#6B7280" },
    { name: "Blue", value: "#2563EB" },
    { name: "Red", value: "#DC2626" },
    { name: "Green", value: "#059669" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Orange", value: "#D97706" },
  ];

  const imageFitOptions = [
    { name: "Cover (Fill)", value: "object-cover", description: "Fill container, may crop" },
    { name: "Contain (Fit)", value: "object-contain", description: "Fit entirely, may show padding" },
    { name: "Fill (Stretch)", value: "object-fill", description: "Stretch to fill exactly" },
    { name: "Scale Down", value: "object-scale-down", description: "Scale down if needed" }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedContent && onContentUpdate) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onContentUpdate({
          ...selectedContent,
          content: {
            ...selectedContent.content,
            image: imageUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedContent && onContentUpdate) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoUrl = event.target?.result as string;
        onContentUpdate({
          ...selectedContent,
          content: {
            ...selectedContent.content,
            videoUrl: videoUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoArrayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && selectedContent && onContentUpdate) {
      const videoPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              url: event.target?.result as string,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              thumbnail: null
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(videoPromises).then(videos => {
        const currentVideos = selectedContent.content.videos || [];
        onContentUpdate({
          ...selectedContent,
          content: {
            ...selectedContent.content,
            videos: [...currentVideos, ...videos]
          }
        });
      });
    }
  };

  const handleRichTextChange = (field: string, value: string) => {
    if (selectedContent && onContentUpdate) {
      onContentUpdate({
        ...selectedContent,
        content: {
          ...selectedContent.content,
          [field]: value
        }
      });
    }
  };

  const handleMediaLinksUpdate = (mediaLinks: { [mediaId: string]: MediaLink }) => {
    if (selectedContent && onContentUpdate) {
      onContentUpdate({
        ...selectedContent,
        mediaLinks
      });
    }
  };

  const getMediaItemsForTemplate = () => {
    if (!selectedContent) return [];
    
    const items: Array<{ id: string; type: 'image' | 'video'; url: string; title?: string }> = [];
    
    // Hero Image template
    if (selectedContent.template === 'hero-image' && selectedContent.content.image) {
      items.push({
        id: 'hero-image',
        type: 'image',
        url: selectedContent.content.image,
        title: selectedContent.content.title || 'Hero Image'
      });
    }
    
    // Photo Grid template
    if (selectedContent.template === 'photo-grid' && selectedContent.content.images) {
      selectedContent.content.images.forEach((image: string, index: number) => {
        items.push({
          id: `grid-image-${index}`,
          type: 'image',
          url: image,
          title: `Grid Image ${index + 1}`
        });
      });
    }
    
    // Video Player template
    if (selectedContent.template === 'video-player' && selectedContent.content.videoUrl) {
      items.push({
        id: 'video-player',
        type: 'video',
        url: selectedContent.content.videoUrl,
        title: selectedContent.content.title || 'Video Player'
      });
    }
    
    // Video Gallery template
    if (selectedContent.template === 'video-gallery' && selectedContent.content.videos) {
      selectedContent.content.videos.forEach((video: any, index: number) => {
        items.push({
          id: `gallery-video-${index}`,
          type: 'video',
          url: video.url,
          title: video.title || `Gallery Video ${index + 1}`
        });
      });
    }
    
    // Mixed Media template
    if (selectedContent.template === 'mixed-media') {
      if (selectedContent.content.image) {
        items.push({
          id: 'mixed-image',
          type: 'image',
          url: selectedContent.content.image,
          title: 'Mixed Media Image'
        });
      }
      if (selectedContent.content.videoUrl) {
        items.push({
          id: 'mixed-video',
          type: 'video',
          url: selectedContent.content.videoUrl,
          title: 'Mixed Media Video'
        });
      }
    }
    
    return items;
  };

  return (
    <div className="h-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-bookcraft-secondary mb-4">Properties</h3>
        <div className="space-y-6">
          {selectedContent ? (
            <>
              {/* Rich Text Editor for text content */}
              {selectedContent.template === 'text-article' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Article Title</Label>
                  <RichTextEditor
                    content={selectedContent.content.title || "Article Title"}
                    onChange={(value) => handleRichTextChange('title', value)}
                    className="mb-4"
                  />
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Article Content</Label>
                  <RichTextEditor
                    content={selectedContent.content.content || "Start writing..."}
                    onChange={(value) => handleRichTextChange('content', value)}
                    allowMedia={false}
                  />
                </div>
              )}

              {selectedContent.template === 'quote-block' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Quote Text</Label>
                  <RichTextEditor
                    content={selectedContent.content.quote || "Quote text..."}
                    onChange={(value) => handleRichTextChange('quote', value)}
                    className="mb-4"
                  />
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Author (Optional)</Label>
                  <Input
                    value={selectedContent.content.author || ""}
                    onChange={(e) => handleRichTextChange('author', e.target.value)}
                    placeholder="Author name (leave empty to hide)"
                    data-testid="input-author"
                  />
                </div>
              )}

              {selectedContent.template === 'mixed-media' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
                  <RichTextEditor
                    content={selectedContent.content.title || "Mixed Content"}
                    onChange={(value) => handleRichTextChange('title', value)}
                    className="mb-4"
                  />
                  
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Media</Label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        data-testid="input-mixed-image"
                      />
                      <Button
                        variant="outline"
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                      >
                        <Image size={20} />
                        <br />
                        Add Image
                      </Button>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        data-testid="input-mixed-video"
                      />
                      <Button
                        variant="outline"
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                      >
                        <Video size={20} />
                        <br />
                        Add Video
                      </Button>
                    </div>
                  </div>

                  {(selectedContent.content.image || selectedContent.content.videoUrl) && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Media Fit</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {imageFitOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              if (selectedContent && onContentUpdate) {
                                onContentUpdate({
                                  ...selectedContent,
                                  content: {
                                    ...selectedContent.content,
                                    imageFit: option.value,
                                    videoFit: option.value
                                  }
                                });
                              }
                            }}
                            className={`p-2 text-xs border rounded transition-colors ${
                              (selectedContent.content.imageFit || selectedContent.content.videoFit || 'object-cover') === option.value
                                ? 'border-bookcraft-primary bg-bookcraft-primary/10 text-bookcraft-primary'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                            title={option.description}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                  <RichTextEditor
                    content={selectedContent.content.content || "Add description..."}
                    onChange={(value) => handleRichTextChange('content', value)}
                    allowMedia={true}
                  />
                </div>
              )}

              {selectedContent.template === 'hero-image' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Hero Image</Label>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && selectedContent && onContentUpdate) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const imageUrl = event.target?.result as string;
                            onContentUpdate({
                              ...selectedContent,
                              content: {
                                ...selectedContent.content,
                                image: imageUrl
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-hero-image"
                    />
                    <Button
                      variant="outline"
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                    >
                      <Upload className="mb-2 mx-auto" size={24} />
                      <br />
                      {selectedContent.content.image ? 'Change Hero Image' : 'Upload Hero Image'}
                    </Button>
                  </div>
                  
                  {selectedContent.content.image && (
                    <>
                      <div className="mb-4">
                        <img 
                          src={selectedContent.content.image} 
                          alt="Hero preview" 
                          className="w-full h-24 object-cover rounded border"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Image Fit</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {imageFitOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                if (selectedContent && onContentUpdate) {
                                  onContentUpdate({
                                    ...selectedContent,
                                    content: {
                                      ...selectedContent.content,
                                      imageFit: option.value
                                    }
                                  });
                                }
                              }}
                              className={`p-2 text-xs border rounded transition-colors ${
                                (selectedContent.content.imageFit || 'object-cover') === option.value
                                  ? 'border-bookcraft-primary bg-bookcraft-primary/10 text-bookcraft-primary'
                                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
                              }`}
                              title={option.description}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Title (Optional)</Label>
                  <Input
                    value={selectedContent.content.title || ""}
                    onChange={(e) => handleRichTextChange('title', e.target.value)}
                    placeholder="Hero title (leave empty to hide overlay)"
                    data-testid="input-hero-title"
                  />
                </div>
              )}

              {selectedContent.template === 'photo-grid' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Photo Grid</Label>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        const newImages: string[] = [];
                        let loadedCount = 0;
                        
                        files.forEach((file, index) => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            newImages[index] = result; // Preserve order
                            loadedCount++;
                            
                            if (loadedCount === files.length && selectedContent && onContentUpdate) {
                              // Filter out any undefined values and add to existing images
                              const validNewImages = newImages.filter(Boolean);
                              onContentUpdate({
                                ...selectedContent,
                                content: {
                                  ...selectedContent.content,
                                  images: [...(selectedContent.content.images || []), ...validNewImages]
                                }
                              });
                              
                              // Reset the input so the same files can be selected again if needed
                              e.target.value = '';
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-grid-images"
                    />
                    <Button
                      variant="outline"
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                    >
                      <Upload className="mb-2 mx-auto" size={24} />
                      <br />
                      {selectedContent.content.images && selectedContent.content.images.length > 0 
                        ? 'Add More Images' 
                        : 'Upload Images (Multiple)'}
                    </Button>
                  </div>
                  
                  {selectedContent.content.images && selectedContent.content.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Uploaded Images ({selectedContent.content.images.length})
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedContent && onContentUpdate) {
                              onContentUpdate({
                                ...selectedContent,
                                content: {
                                  ...selectedContent.content,
                                  images: []
                                }
                              });
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Clear All
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {selectedContent.content.images.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Grid image ${index + 1}`} 
                              className="w-full h-16 object-cover rounded border"
                            />
                            <button
                              onClick={() => {
                                if (selectedContent && onContentUpdate) {
                                  const updatedImages = selectedContent.content.images.filter((_: any, i: number) => i !== index);
                                  onContentUpdate({
                                    ...selectedContent,
                                    content: {
                                      ...selectedContent.content,
                                      images: updatedImages
                                    }
                                  });
                                }
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1 rounded text-xs">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedContent.content.images && selectedContent.content.images.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Image Fit</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {imageFitOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              if (selectedContent && onContentUpdate) {
                                onContentUpdate({
                                  ...selectedContent,
                                  content: {
                                    ...selectedContent.content,
                                    imageFit: option.value
                                  }
                                });
                              }
                            }}
                            className={`p-2 text-xs border rounded transition-colors ${
                              (selectedContent.content.imageFit || 'object-cover') === option.value
                                ? 'border-bookcraft-primary bg-bookcraft-primary/10 text-bookcraft-primary'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                            title={option.description}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Video Player Template */}
              {selectedContent.template === 'video-player' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Video Title (Optional)</Label>
                  <Input
                    value={selectedContent.content.title || ""}
                    onChange={(e) => handleRichTextChange('title', e.target.value)}
                    placeholder="Video title (leave empty to hide overlay)"
                    data-testid="input-video-title"
                    className="mb-4"
                  />
                  
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Video File</Label>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-video-file"
                    />
                    <Button
                      variant="outline"
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                    >
                      <Video className="mb-2 mx-auto" size={24} />
                      <br />
                      {selectedContent.content.videoUrl ? 'Change Video' : 'Upload Video'}
                    </Button>
                  </div>
                  
                  {selectedContent.content.videoUrl && (
                    <div className="mb-4">
                      <video 
                        src={selectedContent.content.videoUrl} 
                        className="w-full h-24 object-cover rounded border"
                        controls
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Video Gallery Template */}
              {selectedContent.template === 'video-gallery' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Gallery Title</Label>
                  <Input
                    value={selectedContent.content.title || ""}
                    onChange={(e) => handleRichTextChange('title', e.target.value)}
                    placeholder="Video Gallery"
                    data-testid="input-gallery-title"
                    className="mb-4"
                  />
                  
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Videos</Label>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoArrayUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-gallery-videos"
                    />
                    <Button
                      variant="outline"
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                    >
                      <Video className="mb-2 mx-auto" size={24} />
                      <br />
                      Upload Videos (Multiple)
                    </Button>
                  </div>
                  
                  {selectedContent.content.videos && selectedContent.content.videos.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Videos in Gallery ({selectedContent.content.videos.length}/4)
                      </Label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {selectedContent.content.videos.map((video: any, index: number) => (
                          <div key={index} className="relative">
                            <video 
                              src={video.url} 
                              className="w-full h-16 object-cover rounded border"
                              muted
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="text-white" size={16} />
                            </div>
                            <button
                              onClick={() => {
                                if (selectedContent && onContentUpdate) {
                                  const newVideos = selectedContent.content.videos.filter((_: any, i: number) => i !== index);
                                  onContentUpdate({
                                    ...selectedContent,
                                    content: {
                                      ...selectedContent.content,
                                      videos: newVideos
                                    }
                                  });
                                }
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                              data-testid={`button-remove-video-${index}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Media Links Section - Show for templates with media */}
              {selectedContent && ['hero-image', 'photo-grid', 'video-player', 'video-gallery', 'mixed-media'].includes(selectedContent.template) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <MediaLinkManager
                    mediaLinks={selectedContent.mediaLinks || {}}
                    onMediaLinksUpdate={handleMediaLinksUpdate}
                    mediaItems={getMediaItemsForTemplate()}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Type className="mx-auto mb-2" size={32} />
              <p className="text-sm">Select a template element to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
