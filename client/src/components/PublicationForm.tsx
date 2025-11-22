'use client';

import { useState, useEffect } from 'react';

interface FormData {
  publicationTitle: string;
  publicationType: string;
  journalName: string;
  publicationDate: string;
  doi: string;
  coAuthors: string;
  indexed: string;
  authorRole: string;
  publicationPdf: File | null;
  indexingProof: File | null;
  abstract: string;
}

export default function PublicationForm() {
  const [formData, setFormData] = useState<FormData>({
    publicationTitle: '',
    publicationType: '',
    journalName: '',
    publicationDate: '',
    doi: '',
    coAuthors: '',
    indexed: '',
    authorRole: '',
    publicationPdf: null,
    indexingProof: null,
    abstract: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [publicationCount, setPublicationCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    const getCookieValue = (name: string) => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
      }
      return null;
    };

    const tokenValue = getCookieValue('token');
    const userCookie = getCookieValue('user');
    
    if (tokenValue) setToken(tokenValue);
    
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
    const fetchPublicationCount = async () => {
      if (!userData?._id || !token) return;
      
      try {
        const API_ENDPOINT = 'http://localhost:8090';
        const response = await fetch(`${API_ENDPOINT}/publications/fetch?_facultyId=${userData._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const publications = await response.json();
          setPublicationCount(publications.length);
        }
      } catch (error) {
        console.error('Error fetching publication count:', error);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchPublicationCount();
  }, [userData, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'publicationPdf' | 'indexingProof') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    if (!formData.publicationTitle || !formData.publicationType || !formData.journalName) {
      setMessage('✗ Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const API_ENDPOINT = 'http://localhost:8090';
      
      const submissionData = {
        token: token,
        _orgId: userData?._orgId,
        _facultyId: userData?._id,
        publicationTitle: formData.publicationTitle,
        publicationType: formData.publicationType,
        journalName: formData.journalName,
        publicationDate: formData.publicationDate,
        doi: formData.doi,
        coAuthors: formData.coAuthors,
        indexed: formData.indexed,
        authorRole: formData.authorRole,
        publicationPdf: formData.publicationPdf?.name || null,
        indexingProof: formData.indexingProof?.name || null,
        abstract: formData.abstract,
      };

      const response = await fetch(`${API_ENDPOINT}/publications/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✓ Publication submitted successfully!');
        console.log('Submitted data:', result);
        
        // Update publication count
        setPublicationCount(prev => prev + 1);
        
        setTimeout(() => {
          setFormData({
            publicationTitle: '',
            publicationType: '',
            journalName: '',
            publicationDate: '',
            doi: '',
            coAuthors: '',
            indexed: '',
            authorRole: '',
            publicationPdf: null,
            indexingProof: null,
            abstract: '',
          });
          setMessage('');
        }, 2000);
      } else {
        setMessage('✗ ' + (result.error || 'Error submitting publication. Please try again.'));
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessage('✗ Error submitting publication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      publicationTitle: '',
      publicationType: '',
      journalName: '',
      publicationDate: '',
      doi: '',
      coAuthors: '',
      indexed: '',
      authorRole: '',
      publicationPdf: null,
      indexingProof: null,
      abstract: '',
    });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quick Entry - Add Publication
          </h1>
          
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
            <div className="text-sm text-gray-600 mb-1">Total Publications</div>
            <div className="text-3xl font-bold text-blue-600">
              {loadingCount ? '...' : publicationCount}
            </div>
          </div> */}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="publicationTitle"
                value={formData.publicationTitle}
                onChange={handleInputChange}
                placeholder="Enter publication title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Type <span className="text-red-500">*</span>
              </label>
              <select
                name="publicationType"
                value={formData.publicationType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select</option>
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book Chapter</option>
                <option value="patent">Patent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journal/Conference Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="journalName"
                value={formData.journalName}
                onChange={handleInputChange}
                placeholder="Enter journal or conference name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Date
              </label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DOI
              </label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
                placeholder="Enter DOI"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Co-authors
              </label>
              <input
                type="text"
                name="coAuthors"
                value={formData.coAuthors}
                onChange={handleInputChange}
                placeholder="Enter co-authors (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indexed In
              </label>
              <select
                name="indexed"
                value={formData.indexed}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select</option>
                <option value="scopus">Scopus</option>
                <option value="web-of-science">Web of Science</option>
                <option value="pubmed">PubMed</option>
                <option value="ieee">IEEE Xplore</option>
                <option value="google-scholar">Google Scholar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Role
              </label>
              <select
                name="authorRole"
                value={formData.authorRole}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select</option>
                <option value="first">First Author</option>
                <option value="corresponding">Corresponding Author</option>
                <option value="co-author">Co-author</option>
                <option value="last">Last Author</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Publication PDF
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'publicationPdf')}
                accept=".pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {formData.publicationPdf && (
                <p className="mt-2 text-sm text-green-600">Selected: {formData.publicationPdf.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Indexing Proof
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'indexingProof')}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {formData.indexingProof && (
                <p className="mt-2 text-sm text-green-600">Selected: {formData.indexingProof.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Abstract
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              placeholder="Enter abstract here..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-md ${message.includes('Error') || message.includes('✗') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Publication'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}