import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    const isDropdownActive = (prefixes = []) => {
        return prefixes.some((prefix) => pathname.startsWith(prefix));
    };

    return (
        <header>
            <div className="hero-container">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid flex-nowrap">

                        <NavLink className="navbar-brand" to="/">
                            <img src="/assets/images/logo2.png" className="logo" alt="Logo" />
                        </NavLink>

                        <div className="nav-link-container">
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav my-4 my-lg-0">
                                    <li className="nav-item">
                                        <NavLink to="/" className="nav-link" end>
                                            Home
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/about" className="nav-link">
                                            About Us
                                        </NavLink>
                                    </li>

                                    <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle ${
                                                isDropdownActive(["/services", "/service-detail"]) ? "active" : ""
                                            }`}
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Services <i className="fa-solid fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="/services" className="dropdown-item">Service</NavLink></li>
                                            <li><NavLink to="/service-detail" className="dropdown-item">Service Details</NavLink></li>
                                        </ul>
                                    </li>

                                    {/* <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle ${
                                                isDropdownActive(["/portfolio", "/portfolio-detail"]) ? "active" : ""
                                            }`}
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Portfolio <i className="fa-solid fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="/portfolio" className="dropdown-item">Portfolio</NavLink></li>
                                            <li><NavLink to="/portfolio-detail" className="dropdown-item">Portfolio Details</NavLink></li>
                                        </ul>
                                    </li> */}

                                    <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle ${
                                                isDropdownActive([
                                                    "/pricing",
                                                    "/team",
                                                    "/testimonial",
                                                    "/faq",
                                                    // "/404-page",
                                                    // "/blog",
                                                    // "/single-post"
                                                ])
                                                    ? "active"
                                                    : ""
                                            }`}
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Pages <i className="fa-solid fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="/pricing" className="dropdown-item">Pricing Plan</NavLink></li>
                                            <li><NavLink to="/team" className="dropdown-item">Team</NavLink></li>
                                            <li><NavLink to="/testimonial" className="dropdown-item">Testimonials</NavLink></li>
                                            <li><NavLink to="/faq" className="dropdown-item">FAQs</NavLink></li>
                                            {/* <li><NavLink to="/404-page" className="dropdown-item">404 Error</NavLink></li>
                                            <li><NavLink to="/blog" className="dropdown-item">Blog Archive</NavLink></li>
                                            <li><NavLink to="/single-post" className="dropdown-item">Single Post</NavLink></li> */}
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="#" className="nav-link">
                                            Contact
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button
                            className="navbar-toggler nav-btn"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="fa-solid fa-bars-staggered"></i>
                        </button>

                        <div className="navbar-cta">
                            <button 
                                onClick={() => navigate('/login')} 
                                className="btn btn-accent"
                                style={{ cursor: 'pointer' }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
