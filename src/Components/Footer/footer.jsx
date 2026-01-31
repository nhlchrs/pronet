import React from "react";
import NewsletterForm from "../Form/NewsletterForm";

const Footer = () => {
    return (
        <footer>
            <div className="section section-footer">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <NewsletterForm/>
                        <div className="footer-content-container">
                            <div className="footer-info-container">    
                                <div className="footer-info">
                                    <img
                                        src="/assets/images/logo2.png"
                                        alt="Footer Logo"
                                        className="logo"
                                    />
                                    <p className="accent-color-2">
                                        ProNet Solutions is an education-driven platform focused on financial markets and fintech learning. We simplify complex trading concepts for learners at every level.
                                    </p>
                                    <ul className="footer-list">
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <span>Somewhere, Earth</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-envelope-open-text"></i>
                                                <span>support@pronetsolutions.com</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex flex-row align-items-center gspace-2 secondary-accent">
                                                <i className="fa-solid fa-phone"></i>
                                                <span>Contact us for inquiries</span>
                                            </div>
                                            </li>
                                    </ul>
                                </div>
                                <div className="footer-quick-links">
                                    <h4 className="accent-color">Quick Links</h4>
                                    <ul className="footer-list">
                                        <li><a href="/about">About</a></li>
                                        <li><a href="#">Contact</a></li>
                                        <li><a href="/team">Team</a></li>
                                        <li><a href="/faq">FAQs</a></li>
                                        <li><a href="/learn-more">Learn More</a></li>
                                        <li><a href="/terms">Terms & Conditions</a></li>
                                        <li><a href="/agreement">User Agreement</a></li>
                                        <li><a href="/disclaimer">Disclaimer</a></li>
                                    </ul>
                                </div>
                                {/* <div className="footer-services">
                                    <h4 className="accent-color">Services</h4>
                                    <ul className="footer-list">
                                        <li><a href="/services">Our Services</a></li>
                                        <li><a href="/services">Content Marketing</a></li>
                                        <li><a href="/services">Off-Page SEO</a></li>
                                        <li><a href="/services">Social Media Marketing</a></li>
                                        <li><a href="/services">Analytics & Reporting</a></li>
                                        <li><a href="/services">Influencer Marketing</a></li>
                                    </ul>
                                </div> */}
                                <div className="footer-cta">
                                    <h4 className="accent-color">Support Hours</h4>
                                    <p>
                                        Our support team is available to assist you with any questions or concerns about our educational programs.
                                    </p>
                                    <div className="d-flex gspace-2">
                                        <i className="fa-solid accent-color-2 fa-clock"></i>
                                        <p className="accent-color-2">
                                        Mon to Fri, 09:00 - 17:00
                                        </p>
                                    </div>
                                    <div>
                                        <a href="#" className="btn btn-accent">Contact Us</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="copyright-container">
                            <span className="copyright-text">
                                ProNet Solutions © 2026 All Rights Reserved | <a href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms & Conditions</a> | <a href="/agreement" style={{ color: 'inherit', textDecoration: 'underline' }}>User Agreement</a> | <a href="/disclaimer" style={{ color: 'inherit', textDecoration: 'underline' }}>Disclaimer</a>
                            </span>
                            <div className="social-footer">
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                                <a href="#" className="social-item accent-color">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
