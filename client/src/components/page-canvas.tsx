import { useState } from "react";
import { motion } from "framer-motion";
import { PageContent } from "@/types/book";
import { getTemplateById } from "@/lib/templates";
import { Plus } from "lucide-react";

interface PageCanvasProps {
  pageContent?: PageContent;
  position: 'left' | 'right';
  onContentUpdate?: (content: PageContent) => void;
  onTemplateApply?: (template: any, position: 'left' | 'right') => void;
}

export default function PageCanvas({ 
  pageContent, 
  position, 
  onContentUpdate, 
  onTemplateApply 
}: PageCanvasProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const templateData = JSON.parse(e.dataTransfer.getData("application/json"));
      onTemplateApply?.(templateData, position);
    } catch (error) {
      console.error("Failed to parse template data:", error);
    }
  };

  const renderContent = () => {
    if (!pageContent) {
      return (
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Plus className="text-2xl mb-2 mx-auto" size={32} />
            <p>Drag template here</p>
          </div>
        </div>
      );
    }

    const template = getTemplateById(pageContent.template);
    if (!template) {
      return <div>Template not found</div>;
    }

    return template.content(pageContent.content);
  };

  return (
    <motion.div
      className={`page-canvas bg-white rounded-lg shadow-lg border border-gray-200 w-96 h-96 p-6 relative transition-all ${
        isDragOver ? "border-bookcraft-primary bg-blue-50" : ""
      }`}
      data-page={position}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-testid={`page-canvas-${position}`}
    >
      {renderContent()}
    </motion.div>
  );
}
