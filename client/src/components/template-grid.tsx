import { useState } from "react";
import { motion } from "framer-motion";
import { templates, getTemplatesByCategory } from "@/lib/templates";
import { Template } from "@/types/book";
import { Images, FileText, LayoutGrid } from "lucide-react";

interface TemplateGridProps {
  onTemplateSelect?: (template: Template) => void;
}

export default function TemplateGrid({ onTemplateSelect }: TemplateGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("photo");

  const categories = [
    { id: "photo", name: "Photo Layouts", icon: Images },
    { id: "text", name: "Text Layouts", icon: FileText },
    { id: "mixed", name: "Mixed Layouts", icon: LayoutGrid },
  ];

  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  const handleDragStart = (e: React.DragEvent, template: Template) => {
    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-bookcraft-secondary mb-4">Templates</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? "border-bookcraft-primary bg-blue-50"
                  : "border-gray-200 hover:border-bookcraft-primary hover:bg-blue-50"
              }`}
              data-testid={`category-${category.id}`}
            >
              <div className="flex items-center space-x-3">
                <category.icon className="text-bookcraft-primary" size={20} />
                <span className="font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="template-card bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300 cursor-grab hover:border-bookcraft-primary transition-colors"
              onClick={() => onTemplateSelect?.(template)}
              data-testid={`template-${template.id}`}
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
                className="w-full h-full"
              >
                {template.preview}
                <p className="text-xs text-gray-600 text-center mt-2">{template.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
