import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './TeamHierarchy.css';
import './OrgChart.css';

const HierarchyNode = ({ member, depth = 0, maxDepth = 5, currentUserId }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = member.teamMembers && member.teamMembers.length > 0;
  const isCurrentUser = member.userId?._id === currentUserId || member.isCurrentUser;

  if (depth > maxDepth) {
    return null;
  }

  const getLevelColor = (level) => {
    const colors = {
      0: '#667eea',
      1: '#764ba2',
      2: '#f093fb',
      3: '#4facfe',
      4: '#00f2fe',
      5: '#43e97b',
    };
    return colors[level] || '#667eea';
  };

  const userName = member.userId?.fname && member.userId?.lname 
    ? `${member.userId.fname} ${member.userId.lname}` 
    : member.userId?.name || 'Unknown';

  return (
    <div className="hierarchy-node" style={{ marginLeft: `${depth * 24}px` }}>
      <div className="node-header">
        {hasChildren && (
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        )}
        {!hasChildren && <div className="expand-placeholder" />}

        <div
          className={`member-info ${isCurrentUser ? 'current-user' : ''}`}
          style={{ borderLeftColor: getLevelColor(member.level) }}
        >
          <div className="member-header">
            <div className="member-name">
              {userName}
              {isCurrentUser && <span className="you-badge"> (You)</span>}
            </div>
            <span className="level-badge" style={{ backgroundColor: getLevelColor(member.level) }}>
              L{member.level}
            </span>
          </div>
          <div className="member-details">
            <span className="detail-item">
              📧 {member.userId?.email || 'N/A'}
            </span>
            <span className="detail-item">
              👥 {member.directCount || 0} Direct
            </span>
            <span className="detail-item">
              🌳 {member.totalDownline || 0} Total
            </span>
            {member.totalEarnings > 0 && (
              <span className="detail-item earnings">
                💰 ${member.totalEarnings.toFixed(2)}
              </span>
            )}
            {member.referralCode && (
              <span className="detail-item code">
                🔑 {member.referralCode}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="children-list">
          {member.teamMembers.map((child, index) => (
            <HierarchyNode
              key={child._id || index}
              member={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrgChartNode = ({ member, currentUserId, maxDepth = 5, currentDepth = 0 }) => {
  const hasChildren = member.teamMembers && member.teamMembers.length > 0;
  const isCurrentUser = member.userId?._id === currentUserId || member.isCurrentUser;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const itemsPerPage = 3; /* Changed from 4 to 3 */

  if (currentDepth > maxDepth) {
    return null;
  }

  const userName = member.userId?.fname && member.userId?.lname 
    ? `${member.userId.fname} ${member.userId.lname}` 
    : member.userId?.name || 'Unknown';

  const totalChildren = member.teamMembers?.length || 0;
  const totalPages = Math.ceil(totalChildren / itemsPerPage);
  const showCarousel = totalChildren > itemsPerPage;

  // Auto-slide functionality
  useEffect(() => {
    if (!showCarousel || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalPages);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [showCarousel, isAutoPlaying, totalPages]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalPages);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="org-node">
      <div className={`org-node-content ${isCurrentUser ? 'current-user' : ''}`}>
        <div className="org-node-name">
          {userName}
          {isCurrentUser && <span className="you-badge-org">YOU</span>}
          <span className="level-badge-org">L{member.level}</span>
        </div>
        {member.userId?.email && (
          <div className="org-node-email">{member.userId.email}</div>
        )}
        <div className="org-node-stats">
          <div className="org-stat">
            <div className="org-stat-value">{member.directCount || 0}</div>
            <div className="org-stat-label">Direct</div>
          </div>
          <div className="org-stat">
            <div className="org-stat-value">{member.totalDownline || 0}</div>
            <div className="org-stat-label">Team</div>
          </div>
          {member.totalEarnings > 0 && (
            <div className="org-stat">
              <div className="org-stat-value">${(member.totalEarnings || 0).toFixed(0)}</div>
              <div className="org-stat-label">Earned</div>
            </div>
          )}
        </div>
      </div>

      {hasChildren && (
        <>
          {member.teamMembers.length >= 2 && (
            <div className="team-count-badge">
              👥 {member.teamMembers.length} Team Members
            </div>
          )}
          
          {showCarousel ? (
            <div className="carousel-container">
              {/* Previous Button */}
              <button 
                className="carousel-nav-btn prev-btn" 
                onClick={prevSlide}
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Carousel Track */}
              <div className="org-children-carousel" ref={carouselRef}>
                <div 
                  className="carousel-track"
                  style={{
                    transform: `translateX(-${currentSlide * 880}px)`, 
                    transition: 'transform 0.5s ease-in-out'
                  }}
                >
                  {member.teamMembers.map((child, index) => (
                    <div key={child._id || index} className="carousel-item">
                      <OrgChartNode
                        member={child}
                        currentUserId={currentUserId}
                        maxDepth={maxDepth}
                        currentDepth={currentDepth + 1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button 
                className="carousel-nav-btn next-btn" 
                onClick={nextSlide}
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>

              {/* Pagination Dots */}
              <div className="carousel-dots">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Page Indicator */}
              <div className="carousel-page-indicator">
                Showing {currentSlide * itemsPerPage + 1}-{Math.min((currentSlide + 1) * itemsPerPage, totalChildren)} of {totalChildren}
              </div>
            </div>
          ) : (
            <div className={`org-children ${
              member.teamMembers.length === 1 ? 'single-child' : ''
            }`}>
              {member.teamMembers.map((child, index) => (
                <OrgChartNode
                  key={child._id || index}
                  member={child}
                  currentUserId={currentUserId}
                  maxDepth={maxDepth}
                  currentDepth={currentDepth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const TeamHierarchy = ({ isActive }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('org-chart'); // 'tree' or 'org-chart'

  // Trigger API call when tab becomes active
  useEffect(() => {
    if (isActive) {
      console.log('TeamHierarchy tab is active - triggering API calls');
      initializeAndFetch();
    }
  }, [isActive]);

  // Add scroll detection for org-children containers
  useEffect(() => {
    const handleScroll = (e) => {
      const container = e.target;
      if (container.scrollLeft > 10) {
        container.classList.add('scrolled');
        // Hide scroll hint when scrolling
        const parent = container.closest('.org-node');
        if (parent) {
          const hint = parent.querySelector('.scroll-hint-message');
          if (hint) {
            hint.style.display = 'none';
          }
        }
      } else {
        container.classList.remove('scrolled');
        // Show scroll hint again
        const parent = container.closest('.org-node');
        if (parent) {
          const hint = parent.querySelector('.scroll-hint-message');
          if (hint) {
            hint.style.display = 'inline-block';
          }
        }
      }
    };

    const orgChildrenContainers = document.querySelectorAll('.org-children');
    orgChildrenContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll);
    });

    return () => {
      orgChildrenContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [hierarchyData, viewMode]);

  const initializeAndFetch = async () => {
    try {
      setLoading(true);
      setError('');

      // Initialize team membership if needed
      await teamAPI.initializeMembership();

      // Then fetch hierarchy
      await fetchHierarchy();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to load team hierarchy');
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    try {
      const response = await teamAPI.getUserDownline();
      console.log('User Downline API Response:', response);

      if (response.success) {
        setHierarchyData(response.data.hierarchy);
        setCurrentUserId(response.data.currentUserId);
        setError('');
      } else {
        setError(response.message || 'Could not load team hierarchy');
      }
    } catch (err) {
      setError('Failed to load team hierarchy');
      console.error('Hierarchy fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="hierarchy-container">
        <div className="loading">
          <Loader className="spinner" />
          <p>Loading your team hierarchy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hierarchy-container">
        <div className="error-box">
          <AlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!hierarchyData) {
    return null;
  }

  // Calculate total team members recursively
  const countTeamMembers = (member) => {
    if (!member || !member.teamMembers) return 0;
    let count = member.teamMembers.length;
    member.teamMembers.forEach(child => {
      count += countTeamMembers(child);
    });
    return count;
  };

  const totalTeamCount = hierarchyData ? countTeamMembers(hierarchyData) : 0;
  const directCount = hierarchyData?.directCount || 0;
  const currentLevel = hierarchyData?.level || 0;
  const totalEarnings = hierarchyData?.totalEarnings || 0;

  return (
    <div className="hierarchy-container">
      {/* Stats Cards */}
      <div className="hierarchy-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Team Members</div>
            <div className="stat-value">{totalTeamCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Direct Referrals</div>
            <div className="stat-value">{directCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-label">Your Level</div>
            <div className="stat-value">Level {currentLevel}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Earnings</div>
            <div className="stat-value">${totalEarnings.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <h4>Level Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#667eea' }}></span>
            <span>Level 0 - Starter</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#764ba2' }}></span>
            <span>Level 1 - 10+ Direct (Unlock Level Income)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f093fb' }}></span>
            <span>Level 2 - Advanced Builder</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4facfe' }}></span>
            <span>Level 3 - Team Leader</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#00f2fe' }}></span>
            <span>Level 4+ - Elite Status</span>
          </div>
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="hierarchy-tree">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Complete Team Network</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode('tree')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: viewMode === 'tree' ? '#667eea' : '#e5e7eb',
                background: viewMode === 'tree' ? '#667eea' : 'white',
                color: viewMode === 'tree' ? 'white' : '#667eea',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('org-chart')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: viewMode === 'org-chart' ? '#667eea' : '#e5e7eb',
                background: viewMode === 'org-chart' ? '#667eea' : 'white',
                color: viewMode === 'org-chart' ? 'white' : '#667eea',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              🏢 Org Chart
            </button>
          </div>
        </div>
        {hierarchyData && (directCount > 0 || totalTeamCount > 0) ? (
          viewMode === 'org-chart' ? (
            <div className="org-chart-container">
              <div className="org-tree">
                <OrgChartNode member={hierarchyData} currentUserId={currentUserId} maxDepth={5} />
              </div>
            </div>
          ) : (
            <div className="tree-content">
              <HierarchyNode member={hierarchyData} depth={0} currentUserId={currentUserId} />
            </div>
          )
        ) : (
          <div className="no-data">
            <p>📋 No team members yet.</p>
            <p>Share your referral code to build your network!</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="info-box">
        <h4>📊 Understanding Your Hierarchy</h4>
        <ul>
          <li><strong>Levels</strong> - Your position based on direct referrals and team structure</li>
          <li><strong>Direct Count</strong> - People you directly referred</li>
          <li><strong>Total Downline</strong> - Everyone below you in the network</li>
          <li><strong>Earnings</strong> - Total commissions from your network</li>
          <li><strong>Level Qualification</strong> - Reach 10 direct referrals to unlock Level 1 benefits</li>
        </ul>
      </div>
    </div>
  );
};

export default TeamHierarchy;


