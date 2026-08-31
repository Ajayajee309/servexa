import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { User, Mail, MapPin, Briefcase, Phone, IndianRupee, Clock, FileText, Camera, Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/common/ImageUpload';

const EditProviderProfile = () => {
  const { user, login } = useAuth(); // Need login or update method to refresh context if needed
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    profileImageUrl: '',
    serviceCategory: '',
    experienceYears: '',
    serviceArea: '',
    startingPrice: '',
    description: '',
    workingHours: ''
  });

  const categories = [
    'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 
    'Appliance Repair', 'Pest Control', 'Gardening'
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/provider/profile/me');
      const data = response.data;
      
      setFormData({
        fullName: data.user.fullName || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        profileImageUrl: data.user.profileImageUrl || '',
        serviceCategory: data.serviceCategory || '',
        experienceYears: data.experienceYears || '',
        serviceArea: data.serviceArea || '',
        startingPrice: data.startingPrice || '',
        description: data.description || '',
        workingHours: data.workingHours || ''
      });
    } catch (err) {
      console.error('Failed to load profile', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, profileImageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/provider/profile/me', formData);
      setSuccess('Profile updated successfully!');
      
      // Update local storage user data to reflect changes immediately in UI
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        fullName: formData.fullName,
        profileImageUrl: formData.profileImageUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // We could ideally refresh the auth context here if we had a dedicated function,
      // but navigating or reloading is a simple workaround.
      setTimeout(() => {
        window.location.reload(); // Quick way to force auth context to pick up new local storage
      }, 1500);
      
    } catch (err) {
      console.error('Update failed', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate('/provider/dashboard')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your personal and professional details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" /> Personal Information
              </h3>
            </div>
            
            <div className="p-6">
              {/* Profile Image Section */}
              <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative group">
                  {formData.profileImageUrl ? (
                    <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Upload a professional photo to build trust with customers.</p>
                  <ImageUpload onUploadSuccess={handleImageUpload} buttonText="Change Photo" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Professional Details
              </h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Category</label>
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City / Service Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Chennai"
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    min="0"
                    required
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Working Hours</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    placeholder="e.g. 9 AM - 6 PM"
                    required
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" /> About You
              </h3>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Shown to customers)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Describe your expertise, what makes your service special, and why customers should choose you..."
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Saving Changes...</>
              ) : (
                <><Save className="h-5 w-5 mr-2" /> Save Profile</>
              )}
            </button>
          </div>

        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditProviderProfile;
