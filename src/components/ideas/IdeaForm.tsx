import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { TextArea } from '../forms/TextArea';
import { Select } from '../forms/Select';
import { Globe, Lock, Lightbulb, Target, Zap } from 'lucide-react';

interface IdeaFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  initialData?: any;
}

const PROBLEM_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Environment',
  'Finance',
  'Social Impact',
  'Entertainment',
  'Other',
];

export function IdeaForm({ onSubmit, loading, error, initialData }: IdeaFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [problemCategory, setProblemCategory] = useState(initialData?.problem_category || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [visibility, setVisibility] = useState(initialData?.visibility || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('problemCategory', problemCategory);
    formData.append('solution', solution);
    formData.append('visibility', visibility.toString());
    await onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <FormInput
            id="name"
            label="Idea Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in detail..."
              rows={4}
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="problemCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Category
            </label>
            <select
              id="problemCategory"
              required
              value={problemCategory}
              onChange={(e) => setProblemCategory(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value="">Select a category</option>
              {PROBLEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Solution */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Solution</h3>
          </div>
          
          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              How does your idea solve the problem?
            </label>
            <textarea
              id="solution"
              required
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Explain your solution approach..."
              rows={4}
              className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Visibility</h3>
          </div>
          
          <div className="space-y-4">
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !visibility 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setVisibility(false)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={!visibility}
                  onChange={() => setVisibility(false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Lock className="h-5 w-5 text-gray-600 ml-3 mr-2" />
                <div>
                  <div className="font-medium text-gray-900">Private</div>
                  <div className="text-sm text-gray-600">Only you and invited team members can see this idea</div>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                visibility 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setVisibility(true)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={visibility}
                  onChange={() => setVisibility(true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Globe className="h-5 w-5 text-gray-600 ml-3 mr-2" />
                <div>
                  <div className="font-medium text-gray-900">Public</div>
                  <div className="text-sm text-gray-600">Anyone can discover and view this idea</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {initialData ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            initialData ? 'Update Idea' : 'Create Idea'
          )}
        </button>
      </form>
    </div>
  );
}