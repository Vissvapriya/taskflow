import { useState, useEffect } from 'react';
import Tasks from './Tasks.jsx';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortByDeadline, setSortByDeadline] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTaskProject, setSelectedTaskProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'Not Started',
  });

  const token = localStorage.getItem('token');

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load projects');
          return;
        }

        setProjects(data.projects);
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Fetch projects error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  // Filter and sort projects
  let filteredProjects = projects;
  if (filterStatus !== 'All') {
    filteredProjects = projects.filter(p => p.status === filterStatus);
  }

  if (sortByDeadline) {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      deadline: '',
      status: 'Not Started',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      deadline: project.deadline ? project.deadline.split('T')[0] : '',
      status: project.status,
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = modalMode === 'create' 
        ? 'http://localhost:5000/api/projects'
        : `http://localhost:5000/api/projects/${selectedProject._id}`;

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
        setError(data.error || 'Failed to save project');
        return;
      }

      // Update projects list
      if (modalMode === 'create') {
        setProjects([data.project, ...projects]);
      } else {
        setProjects(projects.map(p => p._id === data.project._id ? data.project : p));
      }

      setShowModal(false);
      alert(modalMode === 'create' ? 'Project created successfully!' : 'Project updated successfully!');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete project');
        return;
      }

      setProjects(projects.filter(p => p._id !== projectId));
      alert('Project deleted successfully!');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8"><p className="text-slate-600">Loading projects...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <label className="text-sm font-medium text-slate-700 mr-2">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option>All</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sortDeadline"
            checked={sortByDeadline}
            onChange={(e) => setSortByDeadline(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="sortDeadline" className="text-sm font-medium text-slate-700">
            Sort by Deadline
          </label>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            <p>No projects found. Create your first project!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Deadline</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Team Members</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-900">{project.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{formatDate(project.deadline)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => setSelectedTaskProject(project)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {modalMode === 'create' ? 'Create New Project' : 'Edit Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
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

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
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

      {/* Tasks Modal */}
      {selectedTaskProject && (
        <Tasks
          projectId={selectedTaskProject._id}
          projectTeamMembers={selectedTaskProject.teamMembers}
          onClose={() => setSelectedTaskProject(null)}
        />
      )}
    </div>
  );
}

export default Projects;
