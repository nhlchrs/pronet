import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './TeamHierarchy.css';
import './OrgChart.css';

const OrgChartNode = ({ member, currentUserId, maxDepth = 5, currentDepth = 0 }) => {
  const hasChildren = member.teamMembers && member.teamMembers.length > 0;
  const isCurrentUser = member.userId?._id === currentUserId || member.isCurrentUser;

  if (currentDepth > maxDepth) {
    return null;
  }

  const userName = member.userId?.fname && member.userId?.lname 
    ? `${member.userId.fname} ${member.userId.lname}` 
    : member.userId?.name || 'Unknown';

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
        {member.referralCode && (
          <div className="referral-code-org">🔑 {member.referralCode}</div>
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
        <div className={`org-children ${member.teamMembers.length === 1 ? 'single-child' : ''}`}>
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
          <div className="org-chart-container">
            <div className="org-tree">
              <OrgChartNode member={hierarchyData} currentUserId={currentUserId} maxDepth={5} />
            </div>
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
