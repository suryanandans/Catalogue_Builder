import React, { useState } from "react";
import { Eye, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MediaLink } from "@/types/book";

interface EyeIconPaletteProps {
  onStartDrag: (mediaLink: MediaLink) => void;
}

export default function EyeIconPalette({ onStartDrag }: EyeIconPaletteProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [draggedLink, setDraggedLink] = useState<MediaLink | null>(null);

  const handleAddEyeIcon = () => {
    if (!newUrl.trim()) return;

    const mediaLink: MediaLink = {
      url: newUrl.trim(),
      title: newTitle.trim() || undefined
    };

    onStartDrag(mediaLink);
    setNewUrl("");
    setNewTitle("");
    setIsAdding(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    const mediaLink: MediaLink = {
      url: newUrl.trim(),
      title: newTitle.trim() || undefined
    };
    
    if (!mediaLink.url) {
      e.preventDefault();
      return;
    }

    setDraggedLink(mediaLink);
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "eye-icon",
      mediaLink
    }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedLink(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="text-bookcraft-primary" size={20} />
          <h2 className="text-xl font-semibold text-bookcraft-secondary">Eye Link Icons</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Create draggable eye icons with links. Add a URL and drag the eye icon onto any image or video in your book.
        </p>

        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full"
            variant="outline"
          >
            <Plus size={16} className="mr-2" />
            Create Eye Icon Link
          </Button>
        ) : (
          <div className="space-y-4 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Create New Eye Icon</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewUrl("");
                  setNewTitle("");
                }}
                className="p-1 h-6 w-6"
              >
                <X size={12} />
              </Button>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Link URL *</Label>
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Hover Description (optional)</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Description shown on hover"
                className="text-sm"
              />
            </div>

            {newUrl.trim() && (
              <>
                <Separator />
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Drag this eye icon to any image/video:</p>
                  <div
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    className={`inline-flex w-10 h-10 bg-white border-2 border-blue-500 rounded-full items-center justify-center cursor-grab hover:cursor-grabbing transition-all ${
                      draggedLink ? 'scale-110 shadow-lg' : 'shadow-md hover:shadow-lg'
                    }`}
                    title="Drag me to an image or video"
                  >
                    <Eye size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {newTitle.trim() || 'Eye Icon Link'}
                  </p>
                </div>
                
                <Button
                  onClick={handleAddEyeIcon}
                  size="sm"
                  className="w-full"
                >
                  <Plus size={12} className="mr-1" />
                  Complete & Close
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="text-center text-gray-500">
          <Eye size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="font-medium mb-2">How to use Eye Icons:</h3>
          <div className="text-xs text-left space-y-2">
            <p>1. Click "Create Eye Icon Link" above</p>
            <p>2. Enter a URL and optional description</p>
            <p>3. Drag the blue eye icon onto any image or video</p>
            <p>4. The eye will appear on your media - visitors can click it to open the link</p>
            <p>5. Right-click an eye icon to remove it</p>
          </div>
        </div>
      </div>
    </div>
  );
}