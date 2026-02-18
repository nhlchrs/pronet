import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/shared/Tabs';
import { ReferralCode } from '../Components/Team/ReferralCode';
import { JoinTeam } from '../Components/Team/JoinTeam';
import { TeamHierarchy } from '../Components/Team/TeamHierarchy';
import { teamAPI } from '../services/api';
import './ReferralPage.css';

export const ReferralPage = () => {
  const [activeTab, setActiveTab] = useState('my-code');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);

  useEffect(() => {
    checkUserRoleAndTeamStatus();
    
    // Re-check status when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page visible, re-checking team status...');
        checkUserRoleAndTeamStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkUserRoleAndTeamStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Check user role
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user?.role);
        }

        // Check if user has joined a team
        try {
          const statusResponse = await teamAPI.checkMemberStatus();
          console.log('🔍 Team Status Response:', statusResponse);
          
          if (statusResponse.success) {
            // Check if user is a team member (has team membership initialized)
            const isMember = statusResponse.isTeamMember || false;
            setIsTeamMember(isMember);
            
            // Check if user has joined someone's team (has a sponsor)
            let hasJoined = false;
            if (statusResponse.data && statusResponse.data.hasJoinedTeam !== undefined) {
              hasJoined = statusResponse.data.hasJoinedTeam;
            }
            
            setHasJoinedTeam(hasJoined);
            console.log(`✅ Team Status: isMember=${isMember}, hasJoinedTeam=${hasJoined}`);
            
            // Debug: Show sponsor status
            if (statusResponse.data?.sponsorId) {
              console.log(`👤 User has sponsor: ${statusResponse.data.sponsorId}`);
            }
          } else {
            // User is not a team member
            setIsTeamMember(false);
            setHasJoinedTeam(false);
            console.log('❌ User is not a team member');
          }
        } catch (error) {
          console.error('Error checking team status:', error);
          // On error, default to safe state
          setIsTeamMember(false);
          setHasJoinedTeam(false);
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="referral-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="referral-page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Team & Referral Management</h1>
          <p>Build your network, earn commissions, and unlock higher levels</p>
        </div>
      </div>

      <div className="page-content">
        <Tabs defaultValue="my-code" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="my-code">My Referral Code</TabsTrigger>
            {!hasJoinedTeam && (
              <TabsTrigger value="join-team">Join a Team</TabsTrigger>
            )}
            <TabsTrigger value="hierarchy">Team Hierarchy</TabsTrigger>
          </TabsList>

          {/* My Referral Code Tab */}
          <TabsContent value="my-code">
            <div className="tab-content">
              <div className="tab-header">
                <h2>Your Referral Code</h2>
                <p>
                  Share your unique referral code with others to invite them to your team.
                  Every person who joins using your code becomes part of your downline!
                </p>
              </div>
              <div className="tab-body">
                <ReferralCode isActive={activeTab === 'my-code'} />
              </div>
              <div className="tab-info">
                <h3>💡 Earning Opportunities</h3>
                <div className="opportunities-grid">
                  <div className="opportunity">
                    <span className="opportunity-icon">📊</span>
                    <h4>Direct Income</h4>
                    <p>Earn commissions from every person you directly refer</p>
                  </div>
                  <div className="opportunity">
                    <span className="opportunity-icon">📈</span>
                    <h4>Level Income</h4>
                    <p>Earn from your entire downline at different levels</p>
                  </div>
                  <div className="opportunity">
                    <span className="opportunity-icon">🏆</span>
                    <h4>Level Bonuses</h4>
                    <p>Unlock exclusive bonuses as you reach higher levels</p>
                  </div>
                  <div className="opportunity">
                    <span className="opportunity-icon">â­</span>
                    <h4>Growth Rewards</h4>
                    <p>Earn additional rewards as your team grows</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Join a Team Tab - Only show if user hasn't joined a team */}
          {!hasJoinedTeam && (
            <TabsContent value="join-team">
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Join a Team</h2>
                  <p>
                    Do you have a referral code from someone? Use it here to join their team
                    and start building your network together!
                  </p>
                </div>
                <div className="tab-body">
                  <JoinTeam 
                    isActive={activeTab === 'join-team'} 
                    onSuccess={() => {
                      console.log('✅ Join successful, refreshing status...');
                      checkUserRoleAndTeamStatus();
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Team Hierarchy Tab - Always show for team members */}
          <TabsContent value="hierarchy">
            <div className="tab-content">
              {isTeamMember ? (
                <>
                  <div className="tab-header">
                    <h2>Your Team Downline</h2>
                    <p>
                      View your team structure starting from you as the root.
                      The tree below shows all your direct referrals and their teams (your downline).
                    </p>
                  </div>
                  <div className="tab-body">
                    <TeamHierarchy isActive={activeTab === 'hierarchy'} />
                  </div>
                  <div className="tab-info">
                    <h3>📊 Understanding Levels</h3>
                    <div className="levels-guide">
                      <div className="level-item">
                        <span className="level-number">Level 0</span>
                        <div>
                          <h4>Starter</h4>
                          <p>Your first position in the network</p>
                        </div>
                      </div>
                      <div className="level-item">
                        <span className="level-number">Level 1</span>
                        <div>
                          <h4>10+ Direct Referrals</h4>
                          <p>Unlock level 2 income and premium benefits</p>
                        </div>
                      </div>
                      <div className="level-item">
                        <span className="level-number">Level 2+</span>
                        <div>
                          <h4>Team Leaders</h4>
                          <p>Continue growing to unlock even higher benefits</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="tab-header" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <h2>🌳 Team Hierarchy</h2>
                  <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Initialize your team membership to view your team hierarchy and start building your network.
                  </p>
                  <button 
                    onClick={() => setActiveTab('my-code')}
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      backgroundColor: '#4F46E5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#4338CA'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4F46E5'}
                  >
                    Get Your Referral Codes
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I get my referral code?</h4>
            <p>
              Your unique referral code is automatically generated when you join. You can find it
              in the "My Referral Code" tab above.
            </p>
          </div>
          <div className="faq-item">
            <h4>How much can I earn?</h4>
            <p>
              Your earnings depend on your level, the number of direct referrals, and the size
              of your downline. Higher levels unlock higher commission percentages.
            </p>
          </div>
          <div className="faq-item">
            <h4>When do I get paid?</h4>
            <p>
              Payments are processed monthly based on your verified downline activity. Check your
              account dashboard for payment history and pending earnings.
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I share my code multiple times?</h4>
            <p>
              Yes! You can share your code with unlimited people. The more people who join using
              your code, the larger your network grows.
            </p>
          </div>
          <div className="faq-item">
            <h4>What happens if I reach a higher level?</h4>
            <p>
              You'll automatically unlock higher commission rates, exclusive bonuses, and access
              to premium features. Levels are permanent once achieved.
            </p>
          </div>
          <div className="faq-item">
            <h4>How is the hierarchy structured?</h4>
            <p>
              Your network is organized by levels. Level 1 is your direct referrals, Level 2 is
              their referrals, and so on. Earn from multiple levels as you advance.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="getting-started-section">
        <h2>Getting Started Guide</h2>
        <div className="steps-container">
          <div className="getting-started-step">
            <div className="step-icon">1️⃣</div>
            <h3>Get Your Code</h3>
            <p>
              Navigate to "My Referral Code" tab to view your unique referral code and link.
            </p>
          </div>
          <div className="getting-started-step">
            <div className="step-icon">2️⃣</div>
            <h3>Share & Invite</h3>
            <p>
              Copy your code or link and share it with friends, family, and colleagues. You can
              share it unlimited times!
            </p>
          </div>
          <div className="getting-started-step">
            <div className="step-icon">3️⃣</div>
            <h3>They Join</h3>
            <p>
              When someone uses your code to sign up, they automatically become part of your
              downline.
            </p>
          </div>
          <div className="getting-started-step">
            <div className="step-icon">4️⃣</div>
            <h3>Earn & Grow</h3>
            <p>
              Start earning commissions from their activity. Track your growing network in the
              "Team Hierarchy" tab.
            </p>
          </div>
          <div className="getting-started-step">
            <div className="step-icon">5️⃣</div>
            <h3>Reach Higher Levels</h3>
            <p>
              As your team grows, you'll automatically advance to higher levels and unlock
              greater earning potential.
            </p>
          </div>
          <div className="getting-started-step">
            <div className="step-icon">6️⃣</div>
            <h3>Get Rewarded</h3>
            <p>
              Receive monthly payments, exclusive bonuses, and special recognition for your
              network building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;


