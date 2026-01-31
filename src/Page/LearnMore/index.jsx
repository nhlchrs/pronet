import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";

const LearnMorePage = () => {
    return (
        <>
            <HeadTitle title="Learn More - ProNet Solutions"/>
            <BannerInnerSection title="Learn More" currentPage="Learn More" />
            
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-3">
                        
                        {/* Financial Markets Section */}
                        <div className="card" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <h1 style={{ marginBottom: '15px', color: '#2c3e50' }}>📊 Financial Markets</h1>
                                    <p style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '16px' }}>
                                        ProNetSolutions provides educational access to financial markets through structured learning, 
                                        expert insights, and market analysis.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>What You'll Get</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Market education for Forex, indices, commodities, and crypto</li>
                                        <li>Live & recorded learning sessions</li>
                                        <li>Trading psychology and risk management guidance</li>
                                        <li>Community discussions and mentorship-based learning</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Who This Is For</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Beginners looking to understand financial markets</li>
                                        <li>Learners who want structured, practical market knowledge</li>
                                        <li>Individuals seeking skill-based income opportunities</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                    <p style={{ marginBottom: '0', color: '#856404', fontWeight: '500' }}>
                                        ⚠️ <strong>Disclaimer:</strong> We do not provide investment advice or guaranteed profits. Financial markets involve risk, and 
                                        users are responsible for their own trading decisions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Affiliate Earnings Section */}
                        <div className="card" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <h1 style={{ marginBottom: '15px', color: '#2c3e50' }}>💰 Affiliate Earnings</h1>
                                    <p style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '16px' }}>
                                        Earn commissions by promoting ProNetSolutions' platforms, services, and learning programs.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>How It Works</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Share referral links</li>
                                        <li>Earn commissions on successful enrollments</li>
                                        <li>Track performance through a transparent system</li>
                                        <li>No upfront investment required</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Ideal For</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Content creators</li>
                                        <li>Network marketers</li>
                                        <li>Students & working professionals</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                    <p style={{ marginBottom: '0', color: '#856404', fontWeight: '500' }}>
                                        ⚠️ <strong>Disclaimer:</strong> Affiliate earnings depend on performance and participation. No fixed or guaranteed income is promised.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Market Education Section */}
                        <div className="card" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <h1 style={{ marginBottom: '15px', color: '#2c3e50' }}>📚 Market Education</h1>
                                    <p style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '16px' }}>
                                        Our education-first approach helps users build strong foundations in financial literacy and digital skills.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Learning Includes</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Beginner to advanced market concepts</li>
                                        <li>Live webinars & recorded sessions</li>
                                        <li>Real-world examples & case studies</li>
                                        <li>Practical, skill-based learning paths</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Who Should Learn</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Students</li>
                                        <li>Working professionals</li>
                                        <li>Aspiring traders & entrepreneurs</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '15px', backgroundColor: '#d1ecf1', border: '1px solid #17a2b8', borderRadius: '5px' }}>
                                    <p style={{ marginBottom: '0', color: '#0c5460', fontWeight: '500' }}>
                                        ℹ️ <strong>Education Only:</strong> All content is for learning purposes and does not constitute financial or investment advice.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Direct Commissions Section */}
                        <div className="card" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <h1 style={{ marginBottom: '15px', color: '#2c3e50' }}>💵 Direct Commissions</h1>
                                    <p style={{ lineHeight: '1.8', color: '#2c3e50', fontSize: '16px' }}>
                                        Get rewarded instantly for your contributions and referrals through our direct commission structure.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Key Benefits</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Transparent commission system</li>
                                        <li>Fast and trackable payouts</li>
                                        <li>Performance-based rewards</li>
                                        <li>Easy onboarding process</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Suitable For</h3>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', color: '#2c3e50' }}>
                                        <li>Active community members</li>
                                        <li>Affiliates and promoters</li>
                                        <li>Digital entrepreneurs</li>
                                    </ul>
                                </div>

                                <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                    <p style={{ marginBottom: '0', color: '#856404', fontWeight: '500' }}>
                                        ⚠️ <strong>Important:</strong> Commission earnings depend on activity, referrals, and platform policies. Terms & conditions apply.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Disclaimer */}
                        <div className="card" style={{ padding: '30px', backgroundColor: '#f8f9fa', border: '2px solid #dee2e6' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                                <p style={{ marginBottom: '0', color: '#2c3e50', fontWeight: '600', fontSize: '16px', lineHeight: '1.8' }}>
                                    ProNetSolutions operates as an education and digital services platform.<br />
                                    We do not offer financial advisory, gambling, or guaranteed income services.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default LearnMorePage;
