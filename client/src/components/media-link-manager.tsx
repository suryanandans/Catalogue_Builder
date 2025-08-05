import { useState } from "react";
import { Eye, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MediaLink } from "@/types/book";

interface MediaLinkManagerProps {
  mediaLinks?: { [mediaId: string]: MediaLink };
  onMediaLinksUpdate: (mediaLinks: { [mediaId: string]: MediaLink }) => void;
  mediaItems?: Array<{ id: string; type: 'image' | 'video'; url: string; title?: string }>;
}

export default function MediaLinkManager({ 
  mediaLinks = {}, 
  onMediaLinksUpdate, 
  mediaItems = [] 
}: MediaLinkManagerProps) {
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [selectedMediaId, setSelectedMediaId] = useState("");

  const handleAddLink = () => {
    if (!selectedMediaId || !newLinkUrl.trim()) return;

    const updatedLinks = {
      ...mediaLinks,
      [selectedMediaId]: {
        url: newLinkUrl.trim(),
        title: newLinkTitle.trim() || undefined
      }
    };

    onMediaLinksUpdate(updatedLinks);
    setNewLinkUrl("");
    setNewLinkTitle("");
    setSelectedMediaId("");
  };

  const handleRemoveLink = (mediaId: string) => {
    const updatedLinks = { ...mediaLinks };
    delete updatedLinks[mediaId];
    onMediaLinksUpdate(updatedLinks);
  };

  const availableMedia = mediaItems.filter(item => !mediaLinks[item.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Eye size={16} className="text-bookcraft-primary" />
        <Label className="text-sm font-medium text-gray-700">Media Links</Label>
      </div>

      {/* Existing Links */}
      {Object.keys(mediaLinks).length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Active Links</Label>
          {Object.entries(mediaLinks).map(([mediaId, link]) => {
            const mediaItem = mediaItems.find(item => item.id === mediaId);
            return (
              <div key={mediaId} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Eye size={12} className="text-bookcraft-primary flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate">
                      {mediaItem?.title || `Media ${mediaId.slice(0, 8)}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <ExternalLink size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-500 truncate" title={link.url}>
                      {link.url}
                    </span>
                  </div>
                  {link.title && (
                    <div className="text-xs text-gray-500 truncate mt-1" title={link.title}>
                      "{link.title}"
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLink(mediaId)}
                  className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Link */}
      {availableMedia.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-xs text-gray-600">Add Link to Media</Label>
            
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Select Media</Label>
              <select
                value={selectedMediaId}
                onChange={(e) => setSelectedMediaId(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded focus:border-bookcraft-primary focus:outline-none"
              >
                <option value="">Choose media...</option>
                {availableMedia.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title || `${item.type} ${item.id.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Link URL</Label>
              <Input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-xs"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Link Title (optional)</Label>
              <Input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Hover text for the link"
                className="text-xs"
              />
            </div>

            <Button
              onClick={handleAddLink}
              disabled={!selectedMediaId || !newLinkUrl.trim()}
              size="sm"
              className="w-full"
            >
              <Plus size={12} className="mr-1" />
              Add Eye Icon Link
            </Button>
          </div>
        </>
      )}

      {availableMedia.length === 0 && Object.keys(mediaLinks).length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Eye size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-xs">Upload images or videos first to add eye icon links</p>
        </div>
      )}
    </div>
  );
}