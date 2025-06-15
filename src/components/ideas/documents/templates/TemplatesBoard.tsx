import React, { useState } from 'react';
import { useBusinessTemplates } from '../../../../hooks/ideas/useBusinessTemplates';
import { TemplateList } from './TemplateList';
import { TemplateSearch } from './TemplateSearch';
import { TemplateCategory } from '../../../../types/templates';

export function TemplatesBoard() {
  const { templates, loading, error } = useBusinessTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | ''>('');

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load templates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TemplateSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <TemplateList
        templates={filteredTemplates || []}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}