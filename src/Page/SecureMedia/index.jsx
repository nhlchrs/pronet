import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  PlayCircle,
  FileText,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SecureMedia = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const pdfIframeRef = useRef(null);

  useEffect(() => {
    fetchMediaFiles();
  }, [filterType]);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/secure-media${filterType !== 'all' ? `?type=${filterType}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMediaFiles(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error(error.response?.data?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setIsPlaying(false);
  };

  const handleCloseViewer = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
  };

  const getStreamUrl = (mediaId) => {
    const token = localStorage.getItem('token');
    return `${API_BASE_URL}/secure-media/${mediaId}/stream?token=${token}`;
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const canAccessMedia = (media) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (media.accessLevel === 'public') return true;
    if (media.accessLevel === 'admin' && user.role !== 'admin') return false;
    if (media.accessLevel === 'subscribers' && !user.subscription?.isActive) return false;
    
    return true;
  };

  const getAccessLevelBadge = (level) => {
    const badges = {
      public: { color: 'bg-green-100 text-green-800', icon: <Eye className="w-3 h-3" />, text: 'Public' },
      subscribers: { color: 'bg-blue-100 text-blue-800', icon: <Lock className="w-3 h-3" />, text: 'Subscribers' },
      admin: { color: 'bg-purple-100 text-purple-800', icon: <Lock className="w-3 h-3" />, text: 'Admin Only' }
    };
    
    const badge = badges[level] || badges.public;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const MediaCard = ({ media }) => {
    const hasAccess = canAccessMedia(media);
    const isVideo = media.mimeType?.startsWith('video/');

    return (
      <div
        onClick={() => hasAccess && handleMediaClick(media)}
        className={`relative group rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
          hasAccess ? 'cursor-pointer hover:shadow-2xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {isVideo ? (
            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <FileText className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          )}
          
          {!hasAccess && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Lock className="w-12 h-12 text-white" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-medium truncate">{media.title}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-gray-800 truncate mb-2">{media.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{media.description || 'No description'}</p>
          
          <div className="flex items-center justify-between">
            {getAccessLevelBadge(media.accessLevel)}
            <span className="text-xs text-gray-500">{formatFileSize(media.fileSize)}</span>
          </div>

          {media.viewCount > 0 && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {media.viewCount} views
            </div>
          )}
        </div>

        {/* Encrypted Badge */}
        {media.isEncrypted && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Encrypted
          </div>
        )}
      </div>
    );
  };

  const MediaViewer = () => {
    if (!selectedMedia) return null;

    const isVideo = selectedMedia.mimeType?.startsWith('video/');
    const isPDF = selectedMedia.mimeType === 'application/pdf';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedMedia.title}</h2>
              <p className="text-sm opacity-90">{selectedMedia.description}</p>
            </div>
            <button
              onClick={handleCloseViewer}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-black" style={{ minHeight: '400px' }}>
            {isVideo && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ maxHeight: '70vh' }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={getStreamUrl(selectedMedia._id)} type={selectedMedia.mimeType} />
                  Your browser does not support the video tag.
                </video>

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayVideo}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-6 transition-all transform hover:scale-110"
                    >
                      <PlayCircle className="w-12 h-12" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {isPDF && (
              <div className="h-screen max-h-[70vh]">
                <iframe
                  ref={pdfIframeRef}
                  src={getStreamUrl(selectedMedia._id)}
                  className="w-full h-full"
                  title={selectedMedia.title}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 flex items-center justify-between border-t">
            <div className="text-sm text-gray-600">
              <p>Size: {formatFileSize(selectedMedia.fileSize)}</p>
              <p>Views: {selectedMedia.viewCount || 0}</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {selectedMedia.isEncrypted && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Encrypted & Protected</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Download Disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Media Library</h1>
          <p className="text-gray-600">Access encrypted videos and documents</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Media
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filterType === 'video'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Videos
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filterType === 'pdf'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents
          </button>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Media Found</h3>
            <p className="text-gray-500">No media files are available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaFiles.map((media) => (
              <MediaCard key={media._id} media={media} />
            ))}
          </div>
        )}
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && <MediaViewer />}
    </div>
  );
};

export default SecureMedia;
