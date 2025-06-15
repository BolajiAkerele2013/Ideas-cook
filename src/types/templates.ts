export type TemplateCategory = 'finance' | 'legal' | 'marketing' | 'planning' | 'project';

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  fileUrl: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}