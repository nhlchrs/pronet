import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";

const AgreementPage = () => {
    return (
        <>
            <HeadTitle title="User Agreement - ProNet Solutions"/>
            <BannerInnerSection title="User Agreement" currentPage="Agreement" />
            
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-3">
                        <div className="card" style={{ padding: '40px' }}>
                            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                <h1 style={{ marginBottom: '20px' }}>User Agreement</h1>
                                
                                <div style={{ marginBottom: '30px' }}>
                                    <p style={{ lineHeight: '1.8' }}>
                                        This User Agreement ("Agreement") is a legally binding contract between 
                                        ProNet Solutions ("Company", "We", "Us", "Our") and the individual 
                                        accessing or using our services ("User", "You", "Learner").
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '15px' }}>
                                        By registering, enrolling, accessing, or using any service provided by 
                                        ProNet Solutions, you confirm that you have read, understood, and agreed 
                                        to be bound by this Agreement, along with our <strong>Disclaimer</strong> and 
                                        <strong> Terms and Conditions</strong>.
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '15px', fontWeight: '600' }}>
                                        If you do not agree, you must not use our services.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>1. Purpose of the Agreement</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        This Agreement governs your access to and use of all educational services, 
                                        content, platforms, tools, live sessions, recordings, and community spaces 
                                        operated by ProNet Solutions.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>2. Educational Relationship Only</h2>
                                    <p style={{ lineHeight: '1.8' }}>You acknowledge and agree that:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>ProNet Solutions provides <strong>education and training only</strong></li>
                                        <li>No financial advisory, investment advisory, or brokerage relationship is created</li>
                                        <li>No fiduciary duty exists between you and ProNet Solutions</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        All information shared is for <strong>learning purposes only</strong>.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>3. Acknowledgment of Risk</h2>
                                    <p style={{ lineHeight: '1.8' }}>You expressly acknowledge that:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Trading and investing involve <strong>substantial financial risk</strong></li>
                                        <li>Loss of capital is possible, including total loss</li>
                                        <li>Market conditions are uncertain and volatile</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        You accept full responsibility for any financial decisions or outcomes 
                                        resulting from your actions.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>4. No Guarantee of Results</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        You understand and agree that ProNet Solutions does <strong>not guarantee</strong>:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Profits or income</li>
                                        <li>Trading success or consistency</li>
                                        <li>Employment, placements, or career outcomes</li>
                                        <li>Specific learning results within a defined timeframe</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Individual results vary based on effort, discipline, capital, market 
                                        conditions, and experience.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>5. User Responsibilities</h2>
                                    <p style={{ lineHeight: '1.8' }}>You agree to:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Use services only for lawful and educational purposes</li>
                                        <li>Maintain respectful and professional conduct</li>
                                        <li>Follow platform rules and community guidelines</li>
                                        <li>Provide accurate registration information</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        You shall not misuse the platform or engage in harmful, misleading, or 
                                        disruptive behavior.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>6. Intellectual Property & Confidentiality</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        All content provided by ProNet Solutions—including videos, PDFs, 
                                        strategies, indicators, presentations, recordings, and branding—is the 
                                        <strong> exclusive intellectual property</strong> of ProNet Solutions.
                                    </p>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        You agree that you will <strong>not</strong>:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Copy, record, reproduce, distribute, or resell content</li>
                                        <li>Share login credentials or grant access to third parties</li>
                                        <li>Publicly display or commercially exploit materials</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Unauthorized use may result in immediate termination and legal action.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>7. Payments & Access</h2>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                        <li>Access is granted only upon successful payment</li>
                                        <li>Fees are <strong>non-refundable</strong>, unless explicitly stated otherwise</li>
                                        <li>Access duration is limited to the purchased program</li>
                                        <li>ProNet Solutions may modify course structure, schedule, or content</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Failure to comply with policies may result in access termination without refund.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>8. Technology & Platform Limitations</h2>
                                    <p style={{ lineHeight: '1.8' }}>You acknowledge that:</p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Live sessions may be affected by technical or internet issues</li>
                                        <li>Recorded content availability is subject to platform policies</li>
                                        <li>ProNet Solutions is not responsible for third-party service disruptions</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        No liability arises from technical interruptions beyond reasonable control.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>9. Suspension & Termination</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        ProNet Solutions reserves the right to suspend or terminate your access if:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>You violate this Agreement or related policies</li>
                                        <li>You misuse content or intellectual property</li>
                                        <li>You engage in unethical or disruptive behavior</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Termination does not entitle you to any refund.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>10. Limitation of Liability</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        To the maximum extent permitted by law, ProNet Solutions, its founders, 
                                        instructors, employees, and affiliates shall not be liable for:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Financial losses</li>
                                        <li>Trading or investment outcomes</li>
                                        <li>Market volatility</li>
                                        <li>Emotional or psychological stress</li>
                                        <li>Indirect or consequential damages</li>
                                    </ul>
                                    <p style={{ lineHeight: '1.8', marginTop: '10px' }}>
                                        Your use of the services is at your own risk.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>11. Indemnification</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        You agree to indemnify and hold harmless ProNet Solutions from any 
                                        claims, damages, losses, liabilities, or expenses arising from:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Your misuse of services</li>
                                        <li>Violation of this Agreement</li>
                                        <li>Breach of applicable laws</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>12. Modifications to Agreement</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        ProNet Solutions may revise this Agreement at any time. Continued use of 
                                        services after updates constitutes acceptance of the revised Agreement.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>13. Governing Law & Jurisdiction</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        This Agreement shall be governed by and interpreted in accordance with 
                                        the laws of <strong>UAE</strong>. All disputes shall be subject to the exclusive 
                                        jurisdiction of courts located in UAE.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>14. Severability</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        If any provision of this Agreement is found invalid or unenforceable, the 
                                        remaining provisions shall remain in full force and effect.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ marginBottom: '15px' }}>15. Acceptance of Agreement</h2>
                                    <p style={{ lineHeight: '1.8' }}>
                                        By enrolling, accessing, or using ProNet Solutions' services, you confirm 
                                        that you:
                                    </p>
                                    <ul style={{ lineHeight: '1.8', paddingLeft: '25px', marginTop: '10px' }}>
                                        <li>Have read this Agreement in full</li>
                                        <li>Understand all terms and conditions</li>
                                        <li>Voluntarily agree to be legally bound</li>
                                    </ul>
                                </div>

                                <div className="alert" style={{ padding: '20px', borderRadius: '5px', marginTop: '40px', border: '2px solid var(--accent-color)' }}>
                                    <p style={{ textAlign: 'center', fontWeight: '600', marginBottom: '0' }}>
                                        For questions or concerns regarding this Agreement, please contact us at support@pronetsolutions.com
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

export default AgreementPage;



