import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const WhyChooseUsSection = () => {
    useAnimateOnScroll();

    return(
        <>
            <div className="section spacious-bottom">
                <div className="hero-container">
                    <div className="d-flex flex-column flex-lg-row gap-4">
                        <div className="whychooseus-image">
                            <div className="image-container">
                                <img src="./assets/images/dummy-img-600x400.png" alt="Why Choose Us" className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInLeft" />
                            </div>
                            <div className="client-rating-card animate-box animated animate__animated" data-animate="animate__zoomIn">
                                <div className="client-rating-card-content">
                                    <span>4.9</span>
                                    <div className="stars">
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                    </div>
                                    <h5 className="secondary-accent">Client Ratings</h5>
                                    <p>Trusted and rated by thousands of satisfied clients for excellence and reliability.</p>
                                </div>
                            </div>
                        </div>
                        <div className="whychooseus-details">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Why Choose Us</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                Join Our Thriving Community
                            </h2>
                            <p>
                                Connect with like-minded individuals committed to financial freedom and personal growth. Unlock daily market insights, weekly training, and exclusive networking opportunities as a valued member.
                            </p>
                            <div className="d-flex flex-column gspace-2">
                                <div className="whychooseus-box animate-box animated-fast animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-globe"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Daily Market Analysis</h4>
                                        <p>Stay ahead with in-depth analysis and active discussion to help guide your financial decisions.</p>
                                    </div>
                                </div>
                                <div className="whychooseus-box animate-box animated animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-lightbulb"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Weekly Live Training</h4>
                                        <p>Get direct access to live sessions, practical workshops, and Q&A with expert mentors.</p>
                                    </div>
                                </div>
                                <div className="whychooseus-box animate-box animated animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-users"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Networking & Support</h4>
                                        <p>Meet successful traders, build your network, and engage in our private community forum for peer support.</p>
                                    </div>
                                </div>
                                <div className="whychooseus-box animate-box animated-slow animate__animated" data-animate="animate__fadeInRight">
                                    <div className="icon-circle">
                                        <i className="fa-solid fa-shield-halved"></i>
                                    </div>
                                    <div className="d-flex flex-column gspace-2">
                                        <h4 className="secondary-accent">Exclusive Access</h4>
                                        <p>Enjoy special resources and community-only benefits to accelerate your financial journey.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WhyChooseUsSection;


