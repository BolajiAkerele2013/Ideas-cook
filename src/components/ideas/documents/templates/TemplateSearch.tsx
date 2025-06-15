import React from 'react';
import { Search } from 'lucide-react';
import { TemplateCategory } from '../../../../types/templates';
import { formatTemplateCategory } from '../../../../utils/format';

interface TemplateSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: TemplateCategory | '';
  onCategoryChange: (value: TemplateCategory | '') => void;
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'finance',
  'legal',
  'marketing',
  'planning',
  'project',
];

export function TemplateSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: TemplateSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="sm:w-48">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as TemplateCategory | '')}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Categories</option>
          {TEMPLATE_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {formatTemplateCategory(category)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}