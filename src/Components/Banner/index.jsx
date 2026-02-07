import React from "react";
import { BannerTag } from "../../Data/BannerTag";
import VideoButton from "../Video/VideoButton";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const BannerHome =() => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="banner-heading">
                        <h1 className="font-family-1 animate-box animated animate__animated" data-animate="animate__fadeInUp">Pro Net Solutions<span className="accent-color"> Multi-Service</span> Platform </h1>
                        <div className="banner-client-container">
                            <div className="banner-client-rating">
                                <div>
                                    <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="client-1" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="client-2" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="client-3" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                    <img src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="client-4" className="banner-client-person animate-box animated animate__animated" data-animate="animate__fadeIn"/>
                                </div>
                                <div className="d-flex flex-column gspace-0">
                                    <h3 className="font-family-1 secondary-accent">1500+</h3>
                                    <p className="m-0">Trusted Clients</p>
                                </div>
                            </div>
                            <div className="banner-text-description">
                                <p>Choose from our diverse range of services - Financial Markets Education, Affiliate Earnings, and Digital Learning Solutions.</p>
                            </div>
                        </div>
                        <div className="banner-home animate-box animated animate__animated" data-animate="animate__fadeIn">
                            <div className="banner-icon-container">
                                {BannerTag.map((tag) => (
                                    <div className="banner-icon" key={tag.id}>
                                        {tag.title}
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex flex-wrap d-flex flex-wrap justify-content-between align-items-end z-2">
                                <div>
                                    <a href="#" className="btn btn-secondary-accent">View Portfolio</a>
                                </div>

                                <VideoButton videoUrl="https://www.youtube.com/embed/VhBl3dHT5SY?autoplay=1" />
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-4 justify-content-between">
                            <div className="social-container">
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                                <a href="#" className="social-item primary-accent">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                            <div className="d-flex flex-row flex-wrap gap-4 justify-content-center text-center">
                                <p>Proven Result</p>
                                <p>Experienced Team</p>
                                <p>Affordable Pricing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BannerHome;

