import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const MultiImageUpload = ({ label = 'Upload Images', value = [], onChange, maxImages = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    if (value.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images in total.`);
      return;
    }

    setUploading(true);
    setError(null);
    const newUrls = [];

    try {
      for (const file of files) {
        // Basic validation
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not an image.`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} exceeds 5MB limit.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // The backend returns { url: "api/public/images/..." }
        // We need to ensure we prepend the backend URL if it's relative
        let fileUrl = response.data.url;
        if (fileUrl && fileUrl.startsWith('api/')) {
           fileUrl = `http://localhost:8088/${fileUrl}`;
        }
        newUrls.push(fileUrl);
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
    } catch (err) {
      setError('Failed to upload one or more images. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const removeImage = (indexToRemove) => {
    const newValues = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newValues);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {value.length > 0 && <span className="text-gray-500 font-normal">({value.length}/{maxImages})</span>}
      </label>
      
      {/* Upload Area */}
      {value.length < maxImages && (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center cursor-pointer py-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Click or drag images to upload</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB per file)</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"><X className="w-4 h-4"/> {error}</p>}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <img 
                src={url} 
                alt={`Upload ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
