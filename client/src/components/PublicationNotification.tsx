'use client';
import { useEffect, useState } from 'react';

interface PublicationNotificationProps {
  teacherId: string; // teacher ID only
}

interface PublicationData {
  count: number;
  latestTitle: string;
  addedAt: string;
}

export default function PublicationNotification({ teacherId }: PublicationNotificationProps) {
  const [pubData, setPubData] = useState<PublicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicationCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/publications/teacher/${teacherId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch publication data');
        }
        
        const data = await response.json();
        setPubData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicationCount();
  }, [teacherId]);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600">⚠️</div>
        <div className="text-sm text-red-700">Error loading publication data</div>
      </div>
    );
  }

  if (!pubData) return null;

  return (
   
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Avatar/Icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Publication Added
          </h3>
          {pubData.count > 1 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {pubData.count} total
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          You added a new publication {pubData.latestTitle}
        </p>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-400 whitespace-nowrap">
        {getRelativeTime(pubData.addedAt)}
      </div>
    </div>
    
  );
}