'use client';

import { useState } from 'react';

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

    try {
      // Submit to dummy API (JSONPlaceholder)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.publicationTitle,
          body: JSON.stringify({
            ...formData,
            publicationPdf: formData.publicationPdf?.name || null,
            indexingProof: formData.indexingProof?.name || null,
          }),
          userId: 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✓ Publication submitted successfully! ID: ' + result.id);
        console.log('Submitted data:', result);
        
        // Reset form after 2 seconds
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
        setMessage('✗ Error submitting publication. Please try again.');
      }
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50  pt-10">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Quick Entry - Add Publication
        </h1>

        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Title
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
                Publication Type
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

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journal/Conference Name
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
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3 */}
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

          {/* Row 4 */}
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

          {/* Row 5 - File Uploads */}
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

          {/* Abstract */}
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

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-md ${message.includes('Error') || message.includes('✗') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
              {message}
            </div>
          )}

          {/* Buttons */}
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
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Verify
              </button>
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