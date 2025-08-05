import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Edit, Eye, Check, Grid, FileText, Image, Quote, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocalStorage } from "@/lib/storage";

export default function LandingPage() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Grid,
      title: "Drag & Drop Editor",
      description: "Intuitive interface with pre-designed templates. Simply drag and drop to create stunning page layouts."
    },
    {
      icon: FileText,
      title: "Realistic Page Flipping",
      description: "Experience smooth, realistic page-turning animations that bring your digital books to life."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Create and view your books on any device with our fully responsive design and touch controls."
    }
  ];

  const templates = [
    {
      id: "photo-gallery",
      name: "Photo Gallery",
      description: "Perfect for albums",
      preview: Grid
    },
    {
      id: "story-layout",
      name: "Story Layout", 
      description: "Great for narratives",
      preview: FileText
    },
    {
      id: "product-catalog",
      name: "Product Catalog",
      description: "Showcase products",
      preview: Image
    },
    {
      id: "mixed-media",
      name: "Mixed Media",
      description: "Text + visuals",
      preview: Quote
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-bookcraft-secondary leading-tight">
                  Create Beautiful{" "}
                  <span className="text-bookcraft-primary">Digital Books</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Design and publish interactive catalogues, stories, and albums with our intuitive drag-and-drop editor. Experience the magic of digital page-turning.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => {
                    // Navigate to editor with new project flag
                    navigate("/editor?new=true");
                  }}
                  size="lg"
                  className="bg-bookcraft-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:scale-105 transition-all"
                  data-testid="button-start-creating"
                >
                  <Edit className="mr-2" size={20} />
                  Start Creating
                </Button>
                <Button 
                  onClick={() => navigate("/demo")}
                  variant="outline"
                  size="lg"
                  className="border-2 border-bookcraft-primary text-bookcraft-primary hover:bg-bookcraft-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all"
                  data-testid="button-view-demo"
                >
                  <Eye className="mr-2" size={20} />
                  View Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                {["No Sign-up Required", "Save Locally", "Mobile Friendly"].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Check className="text-green-500" size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="animate-float">
                <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 aspect-[3/4]">
                    <div className="space-y-4">
                      <div className="h-6 bg-bookcraft-primary rounded w-3/4"></div>
                      <div className="h-32 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -left-4 bg-bookcraft-accent text-white p-3 rounded-full shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Edit size={20} />
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Check size={20} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-bookcraft-secondary">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to create professional digital publications</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center space-y-4 p-8 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-2xl text-bookcraft-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-bookcraft-secondary mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Templates Preview */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-bookcraft-secondary">Beautiful Templates</h2>
            <p className="text-xl text-gray-600">Start with professionally designed layouts</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                  <div className="bg-white h-32 flex items-center justify-center">
                    <template.preview className="text-gray-400" size={48} />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-bookcraft-secondary" data-testid={`template-${template.id}`}>
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
