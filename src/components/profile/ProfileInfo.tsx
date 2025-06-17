import React from 'react';
import { UserCircle, Mail, Calendar } from 'lucide-react';
import { Profile } from '../../types/database';
import { formatDate } from '../../utils/date';

interface ProfileInfoProps {
  profile: Profile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="h-24 w-24 rounded-full mx-auto"
          />
        ) : (
          <UserCircle className="h-24 w-24 text-gray-400 mx-auto" />
        )}
        {profile.full_name && (
          <p className="text-gray-600">{profile.full_name}</p>
        )}
      </div>

      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      )}

      {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
        <div className="space-y-4">
          {profile.skills?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.interests?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          Joined {formatDate(profile.created_at)}
        </div>
      </div>
    </div>
  );
}