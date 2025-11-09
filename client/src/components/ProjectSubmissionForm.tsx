'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProjectFormData {
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
}

export default function ProjectSubmissionForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    domainArea: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    principalInvestigator: '',
    coInvestigators: '',
    githubLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    // Basic validation
    if (!formData.projectTitle || !formData.projectDescription || !formData.projectType) {
      setMessage('✗ Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Submit to dummy API (JSONPlaceholder)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.projectTitle,
          body: JSON.stringify(formData),
          userId: 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✓ Project submitted successfully! ID: ' + result.id);
        console.log('Submitted project data:', result);
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            projectTitle: '',
            projectDescription: '',
            projectType: '',
            domainArea: '',
            startDate: '',
            endDate: '',
            isOngoing: false,
            principalInvestigator: '',
            coInvestigators: '',
            githubLink: '',
          });
          setMessage('');
        }, 2000);
      } else {
        setMessage('✗ Error submitting project. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('✗ Error submitting project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      projectTitle: '',
      projectDescription: '',
      projectType: '',
      domainArea: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      principalInvestigator: '',
      coInvestigators: '',
      githubLink: '',
    });
    setMessage('');
  };

  const handleBack = () => {
    console.log('Navigate back');
    // In a real app, you'd use: router.back() or router.push('/previous-page')
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-700 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold">Project Submission Form</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Project Description / Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description / Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Project Type and Domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                >
                  <option value="">Select Project Type</option>
                  <option value="research">Research Project</option>
                  <option value="development">Development Project</option>
                  <option value="consulting">Consulting Project</option>
                  <option value="funded">Funded Project</option>
                  <option value="industrial">Industrial Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain / Area of Work <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="domainArea"
                  value={formData.domainArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="dd-mm-yyyy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="dd-mm-yyyy"
                  disabled={formData.isOngoing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Mark as Ongoing Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOngoing"
                name="isOngoing"
                checked={formData.isOngoing}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isOngoing" className="text-sm font-medium text-gray-700">
                Mark as "Ongoing"
              </label>
            </div>

            {/* Principal Investigator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Investigator (PI) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="principalInvestigator"
                value={formData.principalInvestigator}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Co-Investigators */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Co-Investigators (if any)
              </label>
              <textarea
                name="coInvestigators"
                value={formData.coInvestigators}
                onChange={handleInputChange}
                placeholder="Enter names of co-investigators, one per line"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* GitHub Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('Error') || message.includes('✗') 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-400 transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}