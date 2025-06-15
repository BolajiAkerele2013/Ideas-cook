import React from 'react';
import { FileText, Download, Star } from 'lucide-react';
import { useTemplateRating } from '../../../../hooks/ideas/useTemplateRating';
import { TemplateCategory, BusinessTemplate } from '../../../../types/templates';
import { formatTemplateCategory } from '../../../../utils/format';

interface TemplateListProps {
  templates: BusinessTemplate[];
  selectedCategory: TemplateCategory | '';
}

export function TemplateList({ templates, selectedCategory }: TemplateListProps) {
  const { rateTemplate, getUserRating } = useTemplateRating();

  const filteredTemplates = templates.filter(template => 
    !selectedCategory || template.category === selectedCategory
  );

  const handleRating = async (templateId: string, rating: number) => {
    await rateTemplate(templateId, rating);
  };

  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredTemplates.map((template) => (
        <div key={template.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-indigo-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {formatTemplateCategory(template.category)}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                {template.averageRating.toFixed(1)}
              </span>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {template.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(template.id, rating)}
                  className={`h-5 w-5 ${
                    rating <= (getUserRating(template.id) || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  <Star className="h-full w-full fill-current" />
                </button>
              ))}
            </div>
            <a
              href={template.fileUrl}
              download
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}