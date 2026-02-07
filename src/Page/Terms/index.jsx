import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";

const TermsPage = () => {
    return (
        <>
            <HeadTitle title="Terms & Conditions - ProNet Solutions"/>
            <BannerInnerSection title="Terms & Conditions" currentPage="Terms & Conditions" />
            
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-3">
                        <div className="card" style={{ padding: '40px' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <h1 style={{ marginBottom: '20px' }}>TERMS AND CONDITIONS</h1>
                                <p style={{ lineHeight: '1.8', marginBottom: '30px' }}>Last Updated: January 31, 2026</p>
                                
                                <div style={{ marginBottom: '30px' }}>
                                    <p style={{ lineHeight: '1.8' }}>
                                        These Terms and Conditions ("Terms") govern the access to and use of all 
                                        services, content, and platforms operated by ProNet Solutions ("Company", 
                                        "We", "Us", "Our"). By accessing, enrolling in, or using any service provided by 
                                        ProNet Solutions, you ("User", "You", "Learner") agree to be bound by these 
                                        Terms.
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '15px', fontWeight: '600' }}>
                                        If you do not agree to these Terms, you must not use our services.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>1. Nature of Services</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        ProNet Solutions is an educational platform providing training related to:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Financial markets</li>
                                        <li>Trading and investing concepts</li>
                                        <li>Technical analysis and market structure</li>
                                        <li>Risk management and trading psychology</li>
                                        <li>Fintech-related learning</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        We do not provide financial advice, investment advice, portfolio management, 
                                        trade execution, or guaranteed profit programs.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>2. Eligibility</h2>
                                    <p style={{ lineHeight: '1.8' }}>By using our services, you confirm that:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>You are at least <strong>18 years of age</strong> or have legal parental/guardian consent</li>
                                        <li>You have the legal capacity to enter into this agreement</li>
                                        <li>You will comply with applicable laws and regulations</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>3. User Responsibilities</h2>
                                    <p style={{ lineHeight: '1.8' }}>Users agree to:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Use the platform solely for lawful and educational purposes</li>
                                        <li>Provide accurate and complete information during registration</li>
                                        <li>Maintain respectful conduct during live sessions and community interactions</li>
                                        <li>Avoid misleading, abusive, or disruptive behavior</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        ProNet Solutions reserves the right to restrict access for violations.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>4. Intellectual Property Rights</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        All content provided by ProNet Solutions, including but not limited to:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Videos, recordings, PDFs, presentations</li>
                                        <li>Strategies, indicators, methodologies</li>
                                        <li>Logos, branding, website design</li>
                                        <li>Community content and session materials</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        is the <strong>exclusive intellectual property</strong> of ProNet Solutions and protected under 
                                        applicable copyright and intellectual property laws.
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        <strong>Users may not:</strong>
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Copy, record, download, distribute, resell, or reproduce content</li>
                                        <li>Share login credentials or grant access to third parties</li>
                                        <li>Use content for commercial or public purposes</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Violation may result in legal action.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>5. Payments, Fees & Refunds</h2>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                        <li>All fees are clearly communicated before enrollment</li>
                                        <li>Payments are <strong>non-refundable</strong>, unless explicitly stated otherwise in writing</li>
                                        <li>ProNet Solutions reserves the right to modify pricing or offerings at any time</li>
                                        <li>Failure to complete payment may result in restricted or revoked access</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>6. Access to Services</h2>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                        <li>Access is provided only for the duration of the purchased program</li>
                                        <li>Access may be suspended or terminated if Terms are violated</li>
                                        <li>Recorded content availability is subject to course-specific policies</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        ProNet Solutions does not guarantee uninterrupted access due to technical or third-party issues.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>7. No Guarantee of Results</h2>
                                    <p style={{ lineHeight: '1.8' }}>We do not guarantee:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Profitability or income generation</li>
                                        <li>Trading success or consistency</li>
                                        <li>Skill mastery within a specific time</li>
                                        <li>Employment or professional outcomes</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Results vary based on individual effort, discipline, market conditions, and experience.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>8. Limitation of Liability</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        To the maximum extent permitted by law, ProNet Solutions shall not be liable for:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Financial losses</li>
                                        <li>Market fluctuations</li>
                                        <li>Technical failures</li>
                                        <li>Third-party platform disruptions</li>
                                        <li>Decisions made by users based on educational content</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Users accept full responsibility for their actions.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>9. Third-Party Tools & Platforms</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        Any third-party platforms, tools, software, brokers, or websites referenced are for 
                                        educational purposes only. ProNet Solutions does not endorse or control third-party 
                                        services and shall not be responsible for their performance or outcomes.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>10. Termination & Suspension</h2>
                                    <p style={{ lineHeight: '1.8' }}>ProNet Solutions reserves the right to:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Suspend or terminate access without notice</li>
                                        <li>Remove users violating policies</li>
                                        <li>Deny service at its discretion</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Termination does not entitle the user to a refund.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>11. Confidentiality</h2>
                                    <p style={{ lineHeight: '1.8' }}>Users agree not to disclose or share:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Course materials</li>
                                        <li>Session recordings</li>
                                        <li>Internal strategies</li>
                                        <li>Community discussions</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Confidential information misuse may lead to legal action.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>12. Modifications to Terms</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        ProNet Solutions reserves the right to update or modify these Terms at any time. 
                                        Continued use of services after changes constitutes acceptance of revised Terms.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>13. Governing Law & Jurisdiction</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        These Terms shall be governed by and interpreted in accordance with the laws of 
                                        <strong> UAE</strong>. Any disputes shall be subject to the exclusive jurisdiction of courts located in 
                                        UAE.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>14. Contact Information</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        For questions regarding these Terms, users may contact:
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px', fontWeight: '600' }}>
                                        ProNet Solutions
                                    </p>
                                    <p style={{ lineHeight: '1.8' }}>
                                        ?? Email: support@pronetsolutions.com<br />
                                        ?? Website: <a href="http://www.pronetsolutions.net" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>www.pronetsolutions.net</a>
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>15. Acceptance of Terms</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        By accessing or using ProNet Solutions' services, you acknowledge that you have:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Read</li>
                                        <li>Understood</li>
                                        <li>Agreed</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        to these Terms and Conditions.
                                    </p>
                                </div>

                                <div className="alert" style={{ padding: '20px', borderRadius: '5px', marginTop: '40px', border: '2px solid var(--accent-color)' }}>
                                    <p style={{ textAlign: 'center', fontWeight: '600', marginBottom: '0' }}>
                                        By continuing to use our services, you agree to be bound by these Terms and Conditions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsPage;



