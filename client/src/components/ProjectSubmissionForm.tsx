'use client';

import { useState, useEffect } from 'react';
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
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState<any>(null);

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

    if (!formData.projectTitle || !formData.projectDescription || !formData.projectType) {
      setMessage('✗ Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8090';
      
      const submissionData = {
        token: token,
        _orgId: userData?._orgId,
        _facultyId: userData?._id,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        projectType: formData.projectType,
        domainArea: formData.domainArea,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isOngoing: formData.isOngoing,
        principalInvestigator: formData.principalInvestigator,
        coInvestigators: formData.coInvestigators,
        githubLink: formData.githubLink,
      };

      const response = await fetch(`${API_ENDPOINT}/projects/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✓ Project submitted successfully! ID: ' + result.data._id);
        console.log('Submitted project data:', result);
        
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
        setMessage('✗ ' + (result.error || 'Error submitting project. Please try again.'));
      }
    } catch (error: any) {
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
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-blue-800 rounded transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold">Project Submission Form</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  disabled={formData.isOngoing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

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

            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('Error') || message.includes('✗') 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {message}
              </div>
            )}

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
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
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