import { useState } from "react";
import { PageContent } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Upload, Image, Video, Bold, Italic, Underline, Type } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file && selectedContent && onContentUpdate) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const mediaUrl = event.target?.result as string;
        onContentUpdate({
          ...selectedContent,
          content: {
            ...selectedContent.content,
            mediaUrl,
            mediaType
          }
        });
      };
      reader.readAsDataURL(file);
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

  return (
    <div className="w-80 bg-white shadow-lg border-l border-gray-200">
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
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Author</Label>
                  <Input
                    value={selectedContent.content.author || ""}
                    onChange={(e) => handleRichTextChange('author', e.target.value)}
                    placeholder="Author name"
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
                        onChange={(e) => handleMediaUpload(e, 'image')}
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
                        onChange={(e) => handleMediaUpload(e, 'video')}
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
                      onChange={(e) => handleMediaUpload(e, 'image')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-hero-image"
                    />
                    <Button
                      variant="outline"
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
                    >
                      <Upload className="mb-2 mx-auto" size={24} />
                      <br />
                      Upload Hero Image
                    </Button>
                  </div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Title</Label>
                  <Input
                    value={selectedContent.content.title || ""}
                    onChange={(e) => handleRichTextChange('title', e.target.value)}
                    placeholder="Hero title"
                    data-testid="input-hero-title"
                  />
                </div>
              )}

              {selectedContent.template === 'photo-grid' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Photo Grid</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            // Handle multiple image uploads for grid
                            console.log("Grid image uploaded:", event.target?.result);
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
                      Upload Images (Multiple)
                    </Button>
                  </div>
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
