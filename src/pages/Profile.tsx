import React, { useState } from 'react';
import { UserCircle, Edit, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserIdeasGrid } from '../components/dashboard/UserIdeasGrid';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { ProfileEditForm } from '../components/profile/ProfileEditForm';
import { useProfile } from '../hooks/profile/useProfile';

export function Profile() {
  const { user } = useAuth();
  const { profile, loading, error, refresh } = useProfile(user?.id);
  const [showEditForm, setShowEditForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center py-16">
          <p className="text-red-600 text-lg">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const displayName = profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Profile cover"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80"></div>
        
        {/* Profile Picture */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <UserCircle className="h-20 w-20 text-blue-400" />
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowEditForm(true)}
              className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{displayName}</h1>
          <p className="text-xl text-gray-600 mb-4">{profile.username}</p>
          {profile.bio && (
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">{profile.bio}</p>
          )}
          <button 
            onClick={() => setShowEditForm(true)}
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <ProfileInfo profile={profile} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <UserIdeasGrid userId={user?.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ProfileEditForm
          profile={profile}
          onClose={() => setShowEditForm(false)}
          onUpdate={refresh}
        />
      )}
    </div>
  );
}