import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  Type, 
  Palette,
  Upload,
  Video,
  Image as ImageIcon
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  allowMedia?: boolean;
  className?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  allowMedia = false,
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFontSize = (size: string) => {
    handleFormat('fontSize', size);
  };

  const handleTextColor = (color: string) => {
    handleFormat('foreColor', color);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.margin = '8px 0';
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editorRef.current?.appendChild(img);
        }
        updateContent();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const video = document.createElement('video');
        video.src = event.target?.result as string;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
        video.style.borderRadius = '8px';
        video.style.margin = '8px 0';
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(video);
          range.setStartAfter(video);
          range.setEndAfter(video);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editorRef.current?.appendChild(video);
        }
        updateContent();
      };
      reader.readAsDataURL(file);
    }
  };

  const fontSizes = [
    { label: "12px", value: "1" },
    { label: "14px", value: "2" },
    { label: "16px", value: "3" },
    { label: "18px", value: "4" },
    { label: "24px", value: "5" },
    { label: "32px", value: "6" },
    { label: "48px", value: "7" }
  ];

  const colors = [
    "#000000", "#333333", "#666666", "#999999",
    "#2563EB", "#DC2626", "#059669", "#D97706",
    "#7C3AED", "#DB2777", "#0891B2", "#65A30D"
  ];

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('bold')}
            className="h-8 w-8 p-0"
            data-testid="button-bold"
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('italic')}
            className="h-8 w-8 p-0"
            data-testid="button-italic"
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('underline')}
            className="h-8 w-8 p-0"
            data-testid="button-underline"
          >
            <Underline size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Size */}
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 min-w-[60px]"
          data-testid="select-font-size"
        >
          <option value="">Size</option>
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Colors */}
        <div className="flex gap-1 flex-wrap">
          {colors.slice(0, 6).map((color) => (
            <button
              key={color}
              onClick={() => handleTextColor(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              data-testid={`color-${color}`}
              title={`Text color: ${color}`}
            />
          ))}
        </div>

        {allowMedia && (
          <>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Media Upload */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0"
                data-testid="button-upload-image"
                title="Upload Image"
              >
                <ImageIcon size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                className="h-8 w-8 p-0"
                data-testid="button-upload-video"
                title="Upload Video"
              >
                <Video size={16} />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-32 text-black focus:outline-none focus:ring-2 focus:ring-bookcraft-primary"
        style={{ color: '#000000' }}
        onInput={updateContent}
        onBlur={updateContent}
        data-testid="rich-text-editor"
      />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />
    </div>
  );
}