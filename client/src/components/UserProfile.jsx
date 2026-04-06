import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const token = localStorage.getItem('token');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load profile');
          return;
        }

        setUser(data.user);
        setEditForm({
          name: data.user.name,
          bio: data.user.bio || '',
        });
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setUser(data.user);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update profile error:', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to change password');
        return;
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMode(false);
      alert('Password changed successfully!');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Change password error:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <p className="mt-1 text-slate-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <p className="mt-1 text-slate-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <p className="mt-1 text-slate-900 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Bio</label>
              <p className="mt-1 text-slate-900">{user.bio || 'No bio yet'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          {!passwordMode && (
            <button
              onClick={() => setPasswordMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          )}
        </div>

        {passwordMode && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-slate-500">
                Must be 8+ characters with uppercase, lowercase, and numbers
              </p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setPasswordMode(false)}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
