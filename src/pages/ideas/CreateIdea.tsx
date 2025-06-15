import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Sparkles } from 'lucide-react';
import { IdeaForm } from '../../components/ideas/IdeaForm';
import { useCreateIdea } from '../../hooks/ideas/useCreateIdea';

export function CreateIdea() {
  const navigate = useNavigate();
  const { createIdea, loading, error } = useCreateIdea();

  const handleSubmit = async (formData: FormData) => {
    const success = await createIdea(formData);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create New Idea
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your vision and bring it to life with our comprehensive project management tools
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center mt-8 space-x-8">
            <div className="flex items-center text-blue-600">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Collaborate</span>
            </div>
            <div className="flex items-center text-indigo-600">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Manage</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Execute</span>
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl"></div>
          <img
            src="https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Innovation and creativity"
            className="w-full h-64 object-cover rounded-2xl shadow-xl"
          />
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <IdeaForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}