import React, { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {!uploadedImage ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-gray-600 hover:border-purple-400 hover:bg-purple-500/5'
            }
          `}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Glissez votre graphique ici
          </h3>
          <p className="text-gray-400 mb-4">
            ou cliquez pour sélectionner un fichier
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF jusqu'à 10MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={uploadedImage}
            alt="Graphique uploadé"
            className="w-full h-64 object-contain bg-white/5 rounded-xl border border-white/20"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Image className="w-4 h-4" />
            Graphique chargé
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;