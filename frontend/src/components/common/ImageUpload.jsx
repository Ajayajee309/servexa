import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const ImageUpload = ({ label = 'Upload Image', value, onChange, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB.');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(response.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div
        onClick={value || loading ? undefined : triggerInput}
        className={`relative flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed rounded-xl transition-all
          ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/10' :
            value ? 'border-transparent bg-transparent' :
              'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer bg-white dark:bg-gray-800'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : value ? (
          <div className="relative group w-full h-40 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transform scale-90 group-hover:scale-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"><X className="w-4 h-4" /> {error}</p>}
    </div>
  );
};

export default ImageUpload;