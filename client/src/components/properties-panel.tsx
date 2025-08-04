import { useState } from "react";
import { PageContent } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";

interface PropertiesPanelProps {
  selectedContent?: PageContent;
  onContentUpdate?: (content: PageContent) => void;
}

export default function PropertiesPanel({ selectedContent, onContentUpdate }: PropertiesPanelProps) {
  const [fontSize, setFontSize] = useState([16]);
  const [textColor, setTextColor] = useState("#000000");

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#6B7280" },
    { name: "Blue", value: "#2563EB" },
    { name: "Red", value: "#EF4444" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Handle image upload
        console.log("Image uploaded:", event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-l border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-bookcraft-secondary mb-4">Properties</h3>
        <div className="space-y-6">
          {/* Text Properties */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Font Size</Label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={12}
              max={48}
              step={1}
              className="w-full"
              data-testid="slider-font-size"
            />
            <span className="text-xs text-gray-500">{fontSize[0]}px</span>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Text Color</Label>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTextColor(color.value)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    textColor === color.value ? "border-bookcraft-primary scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  data-testid={`color-${color.name.toLowerCase()}`}
                />
              ))}
            </div>
          </div>

          {/* Image Properties */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Image</Label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                data-testid="input-image-upload"
              />
              <Button
                variant="outline"
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-bookcraft-primary transition-colors"
              >
                <Upload className="mb-2 mx-auto" size={24} />
                <br />
                Click to upload
              </Button>
            </div>
          </div>

          {/* Template-specific properties would go here */}
          {selectedContent && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Content Properties</Label>
              <div className="space-y-2">
                {Object.entries(selectedContent.content).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs text-gray-600">{key}</Label>
                    <Input
                      value={value as string}
                      onChange={(e) => {
                        if (onContentUpdate) {
                          onContentUpdate({
                            ...selectedContent,
                            content: {
                              ...selectedContent.content,
                              [key]: e.target.value
                            }
                          });
                        }
                      }}
                      className="text-xs"
                      data-testid={`input-${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
