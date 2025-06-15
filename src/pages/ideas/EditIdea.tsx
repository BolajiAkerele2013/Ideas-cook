import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useIdea } from '../../hooks/ideas/useIdea';
import { useUpdateIdea } from '../../hooks/ideas/useUpdateIdea';
import { IdeaForm } from '../../components/ideas/IdeaForm';

export function EditIdea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idea, loading: loadingIdea } = useIdea(id);
  const { updateIdea, loading: updating, error } = useUpdateIdea();

  if (loadingIdea) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Idea not found</p>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    const success = await updateIdea(id!, formData);
    if (success) {
      navigate(`/ideas/${id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <Pencil className="h-12 w-12 text-indigo-600 mx-auto" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Idea</h1>
        <p className="mt-2 text-gray-600">Update your idea details</p>
      </div>

      <IdeaForm
        onSubmit={handleSubmit}
        loading={updating}
        error={error}
        initialData={idea}
      />
    </div>
  );
}