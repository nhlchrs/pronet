import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './TeamHierarchy.css';

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

export const TeamHierarchy = ({ isActive }) => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trigger API call when tab becomes active
  useEffect(() => {
    if (isActive) {
      console.log('TeamHierarchy tab is active - triggering API calls');
      initializeAndFetch();
    }
  }, [isActive]);

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
      const response = await teamAPI.getDownlineStructure();
      console.log('Hierarchy API Response:', response);

      if (response.success) {
        setHierarchyData(response.data);
        setCurrentUserId(response.currentUserId);
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
        <h3>Complete Team Network</h3>
        {hierarchyData && (directCount > 0 || totalTeamCount > 0) ? (
          <div className="tree-content">
            <HierarchyNode member={hierarchyData} depth={0} currentUserId={currentUserId} />
          </div>
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
