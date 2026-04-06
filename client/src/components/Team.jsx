import { useState, useEffect } from 'react';

function Team() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teams', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load teams');
          return;
        }

        setTeams(data.teams);
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Fetch teams error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTeams();
    }
  }, [token]);

  // Fetch available users for adding members
  const fetchAvailableUsers = async (teamId) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.users) {
        const team = teams.find(t => t._id === teamId);
        // Filter out users who are already members
        const available = data.users.filter(
          u => !team.members.some(m => m._id === u._id)
        );
        setAvailableUsers(available);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedTeam(null);
    setFormData({
      name: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (team) => {
    setModalMode('edit');
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
    });
    setShowModal(true);
  };

  const handleOpenDetailModal = async (team) => {
    setSelectedTeamDetail(team);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      const url = modalMode === 'create'
        ? 'http://localhost:5000/api/teams'
        : `http://localhost:5000/api/teams/${selectedTeam._id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save team');
        return;
      }

      if (modalMode === 'create') {
        setTeams([data.team, ...teams]);
      } else {
        setTeams(teams.map(t => t._id === data.team._id ? data.team : t));
      }

      setShowModal(false);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submit error:', err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/teams/${selectedTeamDetail._id}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: selectedUserId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add member');
        return;
      }

      setTeams(teams.map(t => t._id === data.team._id ? data.team : t));
      setSelectedTeamDetail(data.team);
      setShowAddMemberModal(false);
      setSelectedUserId('');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Add member error:', err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the team?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/teams/${selectedTeamDetail._id}/members/${memberId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to remove member');
        return;
      }

      setTeams(teams.map(t => t._id === data.team._id ? data.team : t));
      setSelectedTeamDetail(data.team);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Remove member error:', err);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete team');
        return;
      }

      setTeams(teams.filter(t => t._id !== teamId));
      setSelectedTeamDetail(null);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8"><p className="text-slate-600">Loading teams...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Team
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-600">
            <p>No teams yet. Create your first team!</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team._id}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => handleOpenDetailModal(team)}
            >
              <h3 className="text-lg font-semibold text-slate-900">{team.name}</h3>
              {team.description && (
                <p className="text-sm text-slate-600 mt-2">{team.description}</p>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-600">
                  👤 Owner: {team.owner.name}
                </p>
                <p className="text-sm text-slate-600">
                  👥 Members: {team.members.length}
                </p>
                <p className="text-sm text-slate-600">
                  📋 Projects: {team.projects.length}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {modalMode === 'create' ? 'Create New Team' : 'Edit Team'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Team Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Detail Modal */}
      {selectedTeamDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{selectedTeamDetail.name}</h2>
              <button
                onClick={() => setSelectedTeamDetail(null)}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {selectedTeamDetail.description && (
              <p className="text-slate-600 mb-4">{selectedTeamDetail.description}</p>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Team Owner</h3>
                <div className="bg-slate-50 p-3 rounded text-sm text-slate-700">
                  {selectedTeamDetail.owner.name} ({selectedTeamDetail.owner.email})
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Members</h3>
                  {selectedTeamDetail.owner._id === userId && (
                    <button
                      onClick={() => {
                        setShowAddMemberModal(true);
                        fetchAvailableUsers(selectedTeamDetail._id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      + Add
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedTeamDetail.members.map((member) => (
                    <div key={member._id} className="flex justify-between items-center bg-slate-50 p-3 rounded text-sm">
                      <div>
                        <p className="text-slate-900 font-medium">{member.name}</p>
                        <p className="text-slate-600 text-xs">{member.email}</p>
                      </div>
                      {selectedTeamDetail.owner._id === userId &&
                        member._id !== selectedTeamDetail.owner._id && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Projects ({selectedTeamDetail.projects.length})
                </h3>
                {selectedTeamDetail.projects.length === 0 ? (
                  <p className="text-sm text-slate-600">No projects assigned yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTeamDetail.projects.map((project) => (
                      <div key={project._id} className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                        {project.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedTeamDetail.owner._id === userId && (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleOpenEditModal(selectedTeamDetail);
                      setSelectedTeamDetail(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTeam(selectedTeamDetail._id);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedTeamDetail(null)}
                className="w-full bg-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Add Team Member</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
                  Select User
                </label>
                <select
                  id="userId"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choose a user --</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddMember}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;
