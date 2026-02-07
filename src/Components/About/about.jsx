import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const AboutSection = () => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="d-flex flex-column flex-md-row h-100 gspace-2">
                            <div className="about-details">
                                <div className="sub-heading">
                                    <i className="fa-solid fa-circle-notch"></i>
                                    <h6 className="font-family-1 accent-color">About Us</h6>
                                </div>
                                <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">About Us</h2>
                                <p>
                                    ProNet Solutions is an education-driven platform focused on financial markets and fintech learning.
                                </p>
                                <p>
                                    We aim to simplify complex trading and market concepts for learners at every level.
                                </p>
                                <p>
                                    Our programs are designed to be practical, structured, and beginner-friendly.
                                </p>
                                <p>
                                    We believe in skill-based learning, not shortcuts or guarantees.
                                </p>
                                <p>
                                    Through live sessions and expert guidance, we help learners build confidence and discipline.
                                </p>
                                <p>
                                    Our focus is on understanding markets, managing risk, and growing responsibly.
                                </p>
                                <p style={{ fontWeight: '600' }}>
                                    ProNet Solutions is where knowledge meets real-world application
                                </p>
                                <div>
                                    <a href="#" className="btn btn-accent">Learn More</a>
                                </div>
                            </div>
                            <div className="about-image-wrapper">
                                <div className="image-container">
                                    <img src="/assets/images/dummy-img-600x400.png" alt="About Image" className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInRight" />
                                </div>
                                <div className="card about-traffic-card animate-box animated animate__animated" data-animate="animate__zoomIn">
                                    <div className="d-flex flex-column gspace-2 align-self-center text-center">
                                        <i className="fa-solid fa-2x fa-chart-simple"></i>
                                        <p className="secondary-accent mb-0">Montly Trafic</p>
                                        <h2 className="secondary-accent">100 K</h2>
                                    </div>
                                    <div className="d-flex justify-content-center accent-color">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                        <p className="description">+70%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-spacer"></div>
                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card card-about animate-box animated-fast animate__animated" data-animate="animate__fadeInUp">
                                    <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="icon-circle align-self-lg-center align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                        <div className="d-flex flex-column gspace-2">
                                            <h3 className="secondary-accent">Our Philosophy</h3>
                                            <p className="secondary-accent">
                                               Empowering individuals with practical knowledge and a supportive community.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                     <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="icon-circle align-self-lg-center align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                         <div className="d-flex flex-column gspace-2">
                                    <h3 className="secondary-accent">Our Vision</h3>
                                    <p className="secondary-accent">
                                      Creating opportunities and fostering growth for every member.
                                    </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                     <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="icon-circle align-self-lg-center align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                         <div className="d-flex flex-column gspace-2">
                                    <h3 className="secondary-accent">Our Mission</h3>
                                    <p className="secondary-accent">
                                     Making financial success simple, accessible, and sustainable for all.
                                    </p>
                                    </div>
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

export default AboutSection;

