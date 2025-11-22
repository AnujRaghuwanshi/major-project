'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, ExternalLink, Calendar, FileText, Award, BookOpen, Users } from 'lucide-react';

interface Publication {
  _id: string;
  publicationTitle: string;
  publicationType: string;
  journalName: string;
  publicationDate: string;
  doi: string;
  coAuthors: string;
  indexed: string;
  authorRole: string;
  publicationPdf: string;
  indexingProof: string;
  abstract: string;
  faculty: {
    fullName: string;
    email: string;
    facultyId: string;
  };
}

export default function MyPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; publicationId: string | null }>({
    show: false,
    publicationId: null,
  });
  const [expandedAbstract, setExpandedAbstract] = useState<string | null>(null);

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
      fetchPublications();
    }
  }, [userData]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const API_ENDPOINT = 'http://localhost:8090';
      const response = await fetch(
        `${API_ENDPOINT}/publications/fetch?_facultyId=${userData._id}&userType=faculty`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      } else {
        setError('Failed to fetch publications');
      }
    } catch (err) {
      setError('Error fetching publications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.publicationId) return;

    try {
      const API_ENDPOINT = 'http://localhost:8090';
      const response = await fetch(
        `${API_ENDPOINT}/publications/delete/${deleteModal.publicationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _facultyId: userData._id,
            userType: 'faculty',
          }),
        }
      );

      if (response.ok) {
        setPublications(publications.filter((p) => p._id !== deleteModal.publicationId));
        setDeleteModal({ show: false, publicationId: null });
      } else {
        alert('Failed to delete publication');
      }
    } catch (err) {
      console.error('Error deleting publication:', err);
      alert('Error deleting publication');
    }
  };

  const filteredPublications = publications.filter((publication) => {
    const matchesSearch =
      publication.publicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.journalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.publicationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.coAuthors?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' || publication.publicationType.toLowerCase() === filter.toLowerCase();

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

  const getPublicationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      journal: 'bg-blue-100 text-blue-700',
      'journal article': 'bg-blue-100 text-blue-700',
      conference: 'bg-purple-100 text-purple-700',
      'conference paper': 'bg-purple-100 text-purple-700',
      book: 'bg-green-100 text-green-700',
      'book chapter': 'bg-green-100 text-green-700',
      patent: 'bg-orange-100 text-orange-700',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const getAuthorRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      first: 'bg-indigo-100 text-indigo-700',
      'first author': 'bg-indigo-100 text-indigo-700',
      corresponding: 'bg-pink-100 text-pink-700',
      'corresponding author': 'bg-pink-100 text-pink-700',
      'co-author': 'bg-cyan-100 text-cyan-700',
      last: 'bg-teal-100 text-teal-700',
      'last author': 'bg-teal-100 text-teal-700',
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading your publications...</p>
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
                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                My Publications
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl px-6 py-4 shadow-sm">
              <div className="text-sm text-gray-600 font-medium">Total Publications</div>
              <div className="text-4xl font-bold text-blue-600">{publications.length}</div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, journal, type, or co-authors..."
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
              <option value="all">All Publication Types</option>
              <option value="journal">Journal Article</option>
              <option value="conference">Conference Paper</option>
              <option value="book">Book Chapter</option>
              <option value="patent">Patent</option>
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

        {/* Publications List */}
        {filteredPublications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-6">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {publications.length === 0 ? 'No Publications Added' : 'No Publications Found'}
            </h3>
            <p className="text-gray-500 text-lg">
              {publications.length === 0 
                ? "You haven't added any publications yet. Start by adding your first publication!"
                : searchTerm || filter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : "You haven't added any publications yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPublications.map((publication) => (
              <div
                key={publication._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                {/* Header with Title and Actions */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight">
                      {publication.publicationTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPublicationTypeColor(publication.publicationType)}`}>
                        {publication.publicationType}
                      </span>
                      {publication.indexed && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {publication.indexed}
                        </span>
                      )}
                      {publication.authorRole && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAuthorRoleColor(publication.authorRole)}`}>
                          {publication.authorRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Publication"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, publicationId: publication._id })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Publication"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Journal/Conference Name */}
                {publication.journalName && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-semibold text-gray-800">Journal/Conference:</span>
                      <span className="ml-2">{publication.journalName}</span>
                    </div>
                  </div>
                )}

                {/* Date and DOI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-700 bg-blue-50 rounded-lg p-3">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-600 block">Published On</span>
                      <span className="font-semibold">{formatDate(publication.publicationDate)}</span>
                    </div>
                  </div>
                  {publication.doi && (
                    <div className="flex items-center bg-green-50 rounded-lg p-3">
                      <ExternalLink className="w-5 h-5 mr-2 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-600 block">DOI</span>
                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-green-700 hover:text-green-800 hover:underline block truncate"
                        >
                          {publication.doi}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Co-authors */}
                {publication.coAuthors && (
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <Users className="w-5 h-5 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 block mb-1">Co-authors:</span>
                        <span className="text-gray-700">{publication.coAuthors}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Abstract */}
                {publication.abstract && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="mb-2">
                      <span className="font-semibold text-gray-800 text-lg">Abstract</span>
                    </div>
                    <p className={`text-gray-600 leading-relaxed ${expandedAbstract === publication._id ? '' : 'line-clamp-3'}`}>
                      {publication.abstract}
                    </p>
                    {publication.abstract.length > 200 && (
                      <button
                        onClick={() =>
                          setExpandedAbstract(
                            expandedAbstract === publication._id ? null : publication._id
                          )
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2 flex items-center gap-1"
                      >
                        {expandedAbstract === publication._id ? '← Show less' : 'Read more →'}
                      </button>
                    )}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {publication.publicationPdf && (
                    <a
                      href={publication.publicationPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View PDF
                    </a>
                  )}
                  {publication.indexingProof && (
                    <a
                      href={publication.indexingProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Indexing Proof
                    </a>
                  )}
                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open DOI Link
                    </a>
                  )}
                </div>
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
              <h3 className="text-xl font-bold text-gray-800">Delete Publication</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete this publication? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, publicationId: null })}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
              >
                Delete Publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}