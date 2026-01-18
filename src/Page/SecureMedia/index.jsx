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
import './SecureMedia.css';

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
      console.log('Fetching media with token:', token ? 'Token exists' : 'No token');
      console.log('API URL:', `${API_BASE_URL}/secure-media${filterType !== 'all' ? `?type=${filterType}` : ''}`);
      
      const response = await axios.get(
        `${API_BASE_URL}/secure-media${filterType !== 'all' ? `?type=${filterType}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Media array:', response.data?.data?.media);
      
      // Backend returns { success: true, message: "...", data: { media: [...], pagination: {...} } }
      const mediaArray = response.data?.data?.media || [];
      console.log('Setting media files:', mediaArray.length, 'items');
      setMediaFiles(mediaArray);
    } catch (error) {
      console.error('Error fetching media:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.response?.data?.message);
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
      public: { 
        bg: 'rgba(17, 228, 79, 0.1)',
        color: '#11E44F',
        icon: <Eye style={{ width: '12px', height: '12px' }} />, 
        text: 'PUBLIC' 
      },
      subscribers: { 
        bg: 'rgba(59, 130, 246, 0.1)',
        color: '#3B82F6',
        icon: <Lock style={{ width: '12px', height: '12px' }} />, 
        text: 'SUBSCRIBERS' 
      },
      admin: { 
        bg: 'rgba(168, 85, 247, 0.1)',
        color: '#A855F7',
        icon: <Lock style={{ width: '12px', height: '12px' }} />, 
        text: 'ADMIN' 
      }
    };
    
    const badge = badges[level] || badges.public;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 'bold',
        backgroundColor: badge.bg,
        color: badge.color,
        letterSpacing: '0.5px',
      }}>
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
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          backgroundColor: '#1a1a1a',
          border: '1px solid #313131',
          cursor: hasAccess ? 'pointer' : 'not-allowed',
          opacity: hasAccess ? 1 : 0.6,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (hasAccess) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(17, 228, 79, 0.2)';
            e.currentTarget.style.borderColor = '#11E44F';
          }
        }}
        onMouseLeave={(e) => {
          if (hasAccess) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = '#313131';
          }
        }}
      >
        {/* Enhanced Thumbnail */}
        <div style={{
          position: 'relative',
          height: '200px',
          backgroundColor: 'rgba(17, 228, 79, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {isVideo ? (
            <PlayCircle style={{ width: '64px', height: '64px', color: '#11E44F', opacity: 0.8 }} />
          ) : (
            <FileText style={{ width: '64px', height: '64px', color: '#11E44F', opacity: 0.8 }} />
          )}
          
          {!hasAccess && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
            }}>
              <Lock style={{ width: '48px', height: '48px', color: '#DAFAF4', marginBottom: '8px' }} />
              <span style={{ color: '#DAFAF4', fontSize: '13px', fontWeight: '600' }}>Subscribers Only</span>
            </div>
          )}

          {/* Type Badge */}
          {media.isEncrypted && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'linear-gradient(135deg, #FFA500, #FF6B00)',
              color: '#121212',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(255, 165, 0, 0.4)',
              zIndex: 10,
            }}>
              <Lock style={{ width: '12px', height: '12px' }} />
              SECURED
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{ padding: '20px' }}>
          <h3 style={{
            fontWeight: 'bold',
            color: '#DAFAF4',
            marginBottom: '8px',
            fontSize: '16px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{media.title}</h3>
          
          <p style={{
            fontSize: '13px',
            color: '#8AFFAC',
            marginBottom: '16px',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{media.description || 'No description available'}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
            {getAccessLevelBadge(media.accessLevel)}
            <span style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#8AFFAC',
              backgroundColor: '#0f0f0f',
              padding: '4px 10px',
              borderRadius: '6px',
            }}>{formatFileSize(media.fileSize)}</span>
          </div>

          {media.viewCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#8AFFAC',
              paddingTop: '12px',
              borderTop: '1px solid #313131',
            }}>
              <Eye style={{ width: '14px', height: '14px', color: '#11E44F' }} />
              <span style={{ fontWeight: '600' }}>{media.viewCount} views</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MediaViewer = () => {
    const isVideo = selectedMedia.mimeType?.startsWith('video/');
    const isPDF = selectedMedia.mimeType === 'application/pdf';

    return (
      <div style={{
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#1a1a1a',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(17, 228, 79, 0.3)',
          border: '1px solid #313131',
        }}>
          {/* Enhanced Header */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderBottom: '2px solid #313131',
            color: '#DAFAF4',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{
                backgroundColor: 'rgba(17, 228, 79, 0.15)',
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid rgba(17, 228, 79, 0.3)',
              }}>
                {isVideo ? (
                  <PlayCircle style={{ width: '24px', height: '24px', color: '#11E44F' }} />
                ) : (
                  <FileText style={{ width: '24px', height: '24px', color: '#11E44F' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  color: '#DAFAF4',
                }}>{selectedMedia.title}</h2>
                {selectedMedia.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#8AFFAC',
                  }}>{selectedMedia.description}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleCloseViewer}
              style={{
                padding: '10px',
                backgroundColor: 'transparent',
                border: '2px solid #313131',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: '#DAFAF4',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(17, 228, 79, 0.1)';
                e.currentTarget.style.borderColor = '#11E44F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#313131';
              }}
            >
              <ChevronLeft style={{ width: '24px', height: '24px' }} />
            </button>
          </div>

          {/* Content Area */}
          <div style={{
            backgroundColor: '#000000',
            position: 'relative',
            minHeight: '400px',
          }}>
            {isVideo && (
              <div style={{ position: 'relative' }}>
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                  }}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={getStreamUrl(selectedMedia._id)} type={selectedMedia.mimeType} />
                  Your browser does not support the video tag.
                </video>

                {!isPlaying && (
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}>
                    <button
                      onClick={handlePlayVideo}
                      style={{
                        position: 'relative',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        const child = e.currentTarget.querySelector('[data-play-btn]');
                        if (child) {
                          child.style.transform = 'scale(1.1)';
                          child.style.boxShadow = '0 20px 60px rgba(17, 228, 79, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        const child = e.currentTarget.querySelector('[data-play-btn]');
                        if (child) {
                          child.style.transform = 'scale(1)';
                          child.style.boxShadow = '0 10px 40px rgba(17, 228, 79, 0.5)';
                        }
                      }}
                    >
                      <div data-play-btn style={{
                        background: 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)',
                        color: '#121212',
                        borderRadius: '50%',
                        padding: '32px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 40px rgba(17, 228, 79, 0.5)',
                      }}>
                        <PlayCircle style={{ width: '56px', height: '56px' }} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {isPDF && (
              <div style={{
                height: '100vh',
                maxHeight: '70vh',
              }}>
                <iframe
                  ref={pdfIframeRef}
                  src={getStreamUrl(selectedMedia._id)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  title={selectedMedia.title}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div style={{
            padding: '24px',
            backgroundColor: '#1a1a1a',
            borderTop: '2px solid #313131',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0f0f0f',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid #313131',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'linear-gradient(135deg, #11E44F, #0BA639)',
                    borderRadius: '50%',
                  }}></div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#8AFFAC',
                    letterSpacing: '0.5px',
                  }}>SIZE:</span>
                  <span style={{
                    fontSize: '13px',
                    color: '#DAFAF4',
                    fontWeight: '600',
                  }}>{formatFileSize(selectedMedia.fileSize)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0f0f0f',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid #313131',
                }}>
                  <Eye style={{ width: '16px', height: '16px', color: '#11E44F' }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#8AFFAC',
                    letterSpacing: '0.5px',
                  }}>VIEWS:</span>
                  <span style={{
                    fontSize: '13px',
                    color: '#DAFAF4',
                    fontWeight: '600',
                  }}>{selectedMedia.viewCount || 0}</span>
                </div>
              </div>
              
              {/* Security Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedMedia.isEncrypted && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.15))',
                    border: '2px solid rgba(251, 146, 60, 0.4)',
                    borderRadius: '12px',
                  }}>
                    <Lock style={{ width: '16px', height: '16px', color: '#FB923C' }} />
                    <span style={{
                      fontWeight: 'bold',
                      color: '#FB923C',
                      fontSize: '13px',
                      letterSpacing: '0.5px',
                    }}>ENCRYPTED</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))',
                  border: '2px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                  <span style={{
                    fontWeight: 'bold',
                    color: '#EF4444',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                  }}>PROTECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '80px 16px 40px',
      backgroundColor: '#121212',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif"
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '-100px',
        width: '400px',
        height: '400px',
        opacity: 0.05,
        borderRadius: '50%',
        backgroundColor: '#11E44F',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '350px',
        height: '350px',
        opacity: 0.05,
        borderRadius: '50%',
        backgroundColor: '#11E44F',
      }}></div>

      {/* Page Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Enhanced Header */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(17, 228, 79, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '2px solid rgba(17, 228, 79, 0.2)',
          }}>
            <FileText style={{ width: '40px', height: '40px', color: '#11E44F' }} />
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#DAFAF4',
            margin: '0 0 12px 0',
            letterSpacing: '-1px',
          }}>Media Library</h1>
          
          <p style={{
            fontSize: '16px',
            color: '#8AFFAC',
            margin: 0,
            fontWeight: '500',
          }}>
            Access your secure video and document content
          </p>
        </div>

        {/* Enhanced Filters */}
        <div style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '14px 24px',
              borderRadius: '10px',
              border: filterType === 'all' ? 'none' : '2px solid #313131',
              background: filterType === 'all' ? 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)' : '#1a1a1a',
              color: filterType === 'all' ? '#121212' : '#DAFAF4',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: filterType === 'all' ? '0 4px 14px rgba(17, 228, 79, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (filterType !== 'all') {
                e.currentTarget.style.borderColor = '#11E44F';
                e.currentTarget.style.backgroundColor = '#0f0f0f';
              } else {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(17, 228, 79, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterType !== 'all') {
                e.currentTarget.style.borderColor = '#313131';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              } else {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 228, 79, 0.4)';
              }
            }}
          >
            All Media
            <span style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              backgroundColor: filterType === 'all' ? 'rgba(0,0,0,0.2)' : 'rgba(17, 228, 79, 0.1)',
              color: filterType === 'all' ? '#121212' : '#11E44F',
            }}>
              {mediaFiles.length}
            </span>
          </button>
          <button
            onClick={() => setFilterType('video')}
            style={{
              padding: '14px 24px',
              borderRadius: '10px',
              border: filterType === 'video' ? 'none' : '2px solid #313131',
              background: filterType === 'video' ? 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)' : '#1a1a1a',
              color: filterType === 'video' ? '#121212' : '#DAFAF4',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: filterType === 'video' ? '0 4px 14px rgba(17, 228, 79, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (filterType !== 'video') {
                e.currentTarget.style.borderColor = '#11E44F';
                e.currentTarget.style.backgroundColor = '#0f0f0f';
              } else {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(17, 228, 79, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterType !== 'video') {
                e.currentTarget.style.borderColor = '#313131';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              } else {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 228, 79, 0.4)';
              }
            }}
          >
            <PlayCircle style={{ width: '18px', height: '18px' }} />
            Videos
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            style={{
              padding: '14px 24px',
              borderRadius: '10px',
              border: filterType === 'pdf' ? 'none' : '2px solid #313131',
              background: filterType === 'pdf' ? 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)' : '#1a1a1a',
              color: filterType === 'pdf' ? '#121212' : '#DAFAF4',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: filterType === 'pdf' ? '0 4px 14px rgba(17, 228, 79, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (filterType !== 'pdf') {
                e.currentTarget.style.borderColor = '#11E44F';
                e.currentTarget.style.backgroundColor = '#0f0f0f';
              } else {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(17, 228, 79, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterType !== 'pdf') {
                e.currentTarget.style.borderColor = '#313131';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              } else {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 228, 79, 0.4)';
              }
            }}
          >
            <FileText style={{ width: '18px', height: '18px' }} />
            Documents
          </button>
        </div>

        {/* Media Grid with Loading & Empty States */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            backgroundColor: '#1a1a1a',
            borderRadius: '24px',
            border: '1px solid #313131',
            padding: '40px',
          }}>
            <Loader2 style={{ 
              width: '48px', 
              height: '48px', 
              color: '#11E44F', 
              marginBottom: '20px',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: '#DAFAF4', fontSize: '16px', fontWeight: '600' }}>Loading your media...</p>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            backgroundColor: '#1a1a1a',
            borderRadius: '24px',
            border: '2px dashed #313131',
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: 'rgba(17, 228, 79, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '2px solid rgba(17, 228, 79, 0.2)',
            }}>
              <AlertCircle style={{ width: '50px', height: '50px', color: '#11E44F' }} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#DAFAF4',
              marginBottom: '12px',
            }}>No Media Found</h3>
            <p style={{
              fontSize: '16px',
              color: '#8AFFAC',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
            }}>
              {filterType === 'all' 
                ? 'No media files are available at the moment.' 
                : `No ${filterType === 'video' ? 'videos' : 'documents'} found. Try viewing all media.`}
            </p>
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)',
                  color: '#121212',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 14px rgba(17, 228, 79, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(17, 228, 79, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(17, 228, 79, 0.4)';
                }}
              >
                <Eye style={{ width: '18px', height: '18px' }} />
                View All Media
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Enhanced Stats Bar */}
            <div style={{
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              padding: '16px 24px',
              border: '1px solid #313131',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'linear-gradient(135deg, #11E44F, #0BA639)',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                }}></div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#DAFAF4',
                  letterSpacing: '0.5px',
                }}>
                  SHOWING {mediaFiles.length} {mediaFiles.length === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
              {filterType !== 'all' && (
                <span style={{
                  fontSize: '13px',
                  color: '#11E44F',
                  backgroundColor: 'rgba(17, 228, 79, 0.1)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}>
                  {filterType === 'video' ? '🎬 VIDEOS' : '📄 DOCUMENTS'}
                </span>
              )}
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {mediaFiles.map((media) => (
                <MediaCard key={media._id} media={media} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && <MediaViewer />}
    </div>
  );
};

export default SecureMedia;
