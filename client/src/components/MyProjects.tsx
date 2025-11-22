'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, ExternalLink, Calendar, Users, FolderOpen, Briefcase, GitBranch } from 'lucide-react';

interface Project {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  domainArea: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  principalInvestigator: string;
  coInvestigators: string;
  githubLink: string;
  faculty: {
    fullName: string;
    email: string;
    facultyId: string;
  };
}

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; projectId: string | null }>({
    show: false,
    projectId: null,
  });
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  useEffect(() => {
    const getCookieValue = (name: string) => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
      }
      return null;
    };

    const userCookie = getCookieValue('user');
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchProjects();
    }
  }, [userData]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const API_ENDPOINT = 'http://localhost:8090';
      const response = await fetch(
        `${API_ENDPOINT}/projects/fetch?_facultyId=${userData._id}&userType=faculty`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Error fetching projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.projectId) return;

    try {
      const API_ENDPOINT = 'http://localhost:8090';
      const response = await fetch(`${API_ENDPOINT}/projects/delete/${deleteModal.projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _facultyId: userData._id,
          userType: 'faculty',
        }),
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== deleteModal.projectId));
        setDeleteModal({ show: false, projectId: null });
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domainArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.principalInvestigator?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'ongoing' && project.isOngoing) ||
      (filter === 'completed' && !project.isOngoing) ||
      project.projectType.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProjectTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      research: 'bg-blue-100 text-blue-700',
      development: 'bg-purple-100 text-purple-700',
      consulting: 'bg-green-100 text-green-700',
      funded: 'bg-orange-100 text-orange-700',
      industrial: 'bg-pink-100 text-pink-700',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                My Projects
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl px-6 py-4 shadow-sm">
              <div className="text-sm text-gray-600 font-medium">Total Projects</div>
              <div className="text-4xl font-bold text-blue-600">{projects.length}</div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, domain, type, or investigator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium"
            >
              <option value="all">All Projects</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="research">Research</option>
              <option value="development">Development</option>
              <option value="consulting">Consulting</option>
              <option value="funded">Funded</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-6">
                <FolderOpen className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {projects.length === 0 ? 'No Projects Added' : 'No Projects Found'}
            </h3>
            <p className="text-gray-500 text-lg">
              {projects.length === 0 
                ? "You haven't added any projects yet. Start by adding your first project!"
                : searchTerm || filter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : "You haven't created any projects yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                {/* Header with Title and Actions */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight">
                      {project.projectTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getProjectTypeColor(project.projectType)}`}>
                        {project.projectType}
                      </span>
                      {project.isOngoing ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                          ● Ongoing
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          ✓ Completed
                        </span>
                      )}
                      {project.domainArea && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          {project.domainArea}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, projectId: project._id })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {project.projectDescription && (
                  <div className="mb-4">
                    <p className={`text-gray-600 leading-relaxed ${expandedDescription === project._id ? '' : 'line-clamp-3'}`}>
                      {project.projectDescription}
                    </p>
                    {project.projectDescription.length > 200 && (
                      <button
                        onClick={() =>
                          setExpandedDescription(
                            expandedDescription === project._id ? null : project._id
                          )
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2 flex items-center gap-1"
                      >
                        {expandedDescription === project._id ? '← Show less' : 'Read more →'}
                      </button>
                    )}
                  </div>
                )}

                {/* Date Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-700 bg-blue-50 rounded-lg p-3">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-600 block">Start Date</span>
                      <span className="font-semibold">{formatDate(project.startDate)}</span>
                    </div>
                  </div>
                  {!project.isOngoing && project.endDate && (
                    <div className="flex items-center text-gray-700 bg-green-50 rounded-lg p-3">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      <div>
                        <span className="text-xs text-gray-600 block">End Date</span>
                        <span className="font-semibold">{formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Principal Investigator */}
                {project.principalInvestigator && (
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      <div>
                        <span className="text-xs text-gray-600 block">Principal Investigator</span>
                        <span className="font-semibold text-gray-800">{project.principalInvestigator}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Co-Investigators */}
                {project.coInvestigators && (
                  <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <Users className="w-5 h-5 mr-2 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-600 block mb-1">Co-Investigators</span>
                        <span className="text-gray-700">{project.coInvestigators}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* GitHub Link */}
                {project.githubLink && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium shadow-sm"
                    >
                      <GitBranch className="w-4 h-4 mr-2" />
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Project</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete this project? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, projectId: null })}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}