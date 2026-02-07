import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const LearnMorePage = () => {
    return (
        <>
            <HeadTitle title="Learn More - ProNet Solutions"/>
            <BannerInnerSection title="Learn More" currentPage="Learn More" />
            
            <div className="section">
                <div className="hero-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: true }}
                        style={{ paddingBottom: '60px' }}
                    >
                        {/* Financial Markets Slide */}
                        <SwiperSlide>
                            <div className="card" style={{ padding: '40px', minHeight: '550px' }}>
                                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <h1 style={{ marginBottom: '15px' }}>📊 Financial Markets</h1>
                                        <p style={{ lineHeight: '1.8', fontSize: '16px' }}>
                                            ProNetSolutions provides educational access to financial markets through structured learning, 
                                            expert insights, and market analysis.
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>What You'll Get</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Market education for Forex, indices, commodities, and crypto</li>
                                            <li>Live & recorded learning sessions</li>
                                            <li>Trading psychology and risk management guidance</li>
                                            <li>Community discussions and mentorship-based learning</li>
                                        </ul>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Who This Is For</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Beginners looking to understand financial markets</li>
                                            <li>Learners who want structured, practical market knowledge</li>
                                            <li>Individuals seeking skill-based income opportunities</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-warning" style={{ padding: '15px', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                        <p style={{ marginBottom: '0', fontWeight: '500' }}>
                                            ⚠️ <strong>Disclaimer:</strong> We do not provide investment advice or guaranteed profits. Financial markets involve risk, and 
                                            users are responsible for their own trading decisions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Affiliate Earnings Slide */}
                        <SwiperSlide>
                            <div className="card" style={{ padding: '40px', minHeight: '550px' }}>
                                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <h1 style={{ marginBottom: '15px' }}>💰 Affiliate Earnings</h1>
                                        <p style={{ lineHeight: '1.8', fontSize: '16px' }}>
                                            Earn commissions by promoting ProNetSolutions' platforms, services, and learning programs.
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>How It Works</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Share referral links</li>
                                            <li>Earn commissions on successful enrollments</li>
                                            <li>Track performance through a transparent system</li>
                                            <li>No upfront investment required</li>
                                        </ul>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Ideal For</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Content creators</li>
                                            <li>Network marketers</li>
                                            <li>Students & working professionals</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-warning" style={{ padding: '15px', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                        <p style={{ marginBottom: '0', fontWeight: '500' }}>
                                            ⚠️ <strong>Disclaimer:</strong> Affiliate earnings depend on performance and participation. No fixed or guaranteed income is promised.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Market Education Slide */}
                        <SwiperSlide>
                            <div className="card" style={{ padding: '40px', minHeight: '550px' }}>
                                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <h1 style={{ marginBottom: '15px' }}>📚 Market Education</h1>
                                        <p style={{ lineHeight: '1.8', fontSize: '16px' }}>
                                            Our education-first approach helps users build strong foundations in financial literacy and digital skills.
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Learning Includes</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Beginner to advanced market concepts</li>
                                            <li>Live webinars & recorded sessions</li>
                                            <li>Real-world examples & case studies</li>
                                            <li>Practical, skill-based learning paths</li>
                                        </ul>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Who Should Learn</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Students</li>
                                            <li>Working professionals</li>
                                            <li>Aspiring traders & entrepreneurs</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-info" style={{ padding: '15px', border: '1px solid #17a2b8', borderRadius: '5px' }}>
                                        <p style={{ marginBottom: '0', fontWeight: '500' }}>
                                            ℹ️ <strong>Education Only:</strong> All content is for learning purposes and does not constitute financial or investment advice.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Direct Commissions Slide */}
                        <SwiperSlide>
                            <div className="card" style={{ padding: '40px', minHeight: '550px' }}>
                                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <h1 style={{ marginBottom: '15px' }}>💵 Direct Commissions</h1>
                                        <p style={{ lineHeight: '1.8', fontSize: '16px' }}>
                                            Get rewarded instantly for your contributions and referrals through our direct commission structure.
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Key Benefits</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Transparent commission system</li>
                                            <li>Fast and trackable payouts</li>
                                            <li>Performance-based rewards</li>
                                            <li>Easy onboarding process</li>
                                        </ul>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{ marginBottom: '15px' }}>Suitable For</h3>
                                        <ul style={{ lineHeight: '1.8', paddingLeft: '25px' }}>
                                            <li>Active community members</li>
                                            <li>Affiliates and promoters</li>
                                            <li>Digital entrepreneurs</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-warning" style={{ padding: '15px', border: '1px solid #ffc107', borderRadius: '5px' }}>
                                        <p style={{ marginBottom: '0', fontWeight: '500' }}>
                                            ⚠️ <strong>Important:</strong> Commission earnings depend on activity, referrals, and platform policies. Terms & conditions apply.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Bottom Disclaimer Slide */}
                        <SwiperSlide>
                            <div className="card" style={{ padding: '60px 40px', minHeight: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                                    <h1 style={{ marginBottom: '30px', fontSize: '42px' }}>⚖️ Important Notice</h1>
                                    <p style={{ marginBottom: '0', fontWeight: '600', fontSize: '20px', lineHeight: '1.8' }}>
                                        ProNetSolutions operates as an education and digital services platform.
                                    </p>
                                    <p style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.8' }}>
                                        We do not offer financial advisory, gambling, or guaranteed income services.
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default LearnMorePage;


