import React, { useState } from 'react';
import { User, Settings, Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/profile/useProfile';
import { ProfileEditForm } from './ProfileEditForm';
import { DeleteProfileModal } from './DeleteProfileModal';
import { UserIdeas } from './UserIdeas';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleDeleteSuccess = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.full_name || 'User Profile'}
                  </h1>
                  <p className="text-blue-100">{profile?.username}</p>
                  {profile?.bio && (
                    <p className="text-blue-100 mt-2">{profile.bio}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Profile Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  
                  {profile?.skills && profile.skills.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Skills</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile?.interests && profile.interests.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Interests</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Manage your notification preferences</p>
                    </div>
                    <Settings className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Privacy</p>
                      <p className="text-sm text-gray-500">Control your privacy settings</p>
                    </div>
                    <Settings className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Security</p>
                      <p className="text-sm text-gray-500">Password and security options</p>
                    </div>
                    <Settings className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Ideas Section */}
        <div className="mt-8">
          <UserIdeas />
        </div>
      </div>

      {/* Modals */}
      {showEditForm && (
        <ProfileEditForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => setShowEditForm(false)}
        />
      )}

      <DeleteProfileModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}