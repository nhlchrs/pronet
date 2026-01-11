import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";

const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    // Fetch profile picture when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            userAPI.getProfile()
                .then(response => {
                    const profileInfo = response.data || response;
                    setProfilePicture(profileInfo.profilePicture || null);
                })
                .catch(err => {
                    console.error('Failed to fetch profile picture:', err);
                });
        }
    }, [isAuthenticated, user]);

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
                            {isAuthenticated && user ? (
                                <div className="user-profile" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* User Avatar */}
                                    <div
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: profilePicture ? 'transparent' : '#11E44F',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            color: '#121212',
                                            fontSize: '18px',
                                            transition: 'all 0.3s ease',
                                            overflow: 'hidden',
                                            border: profilePicture ? '2px solid #11E44F' : 'none',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!profilePicture) {
                                                e.target.style.backgroundColor = '#8AFFAC';
                                            }
                                            e.target.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!profilePicture) {
                                                e.target.style.backgroundColor = '#11E44F';
                                            }
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {profilePicture ? (
                                            <img
                                                src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '')}${profilePicture}`}
                                                alt="Profile"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            user.fname?.[0]?.toUpperCase() || 'U'
                                        )}
                                    </div>

                                    {/* User Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', color: '#DAFAF4' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                            {user.fname} {user.lname}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#8AFFAC' }}>
                                            {user.email}
                                        </span>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '12px',
                                                backgroundColor: '#1a1a1a',
                                                border: '1px solid #313131',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                                                minWidth: '200px',
                                                zIndex: 1000,
                                            }}
                                        >
                                            <div style={{ padding: '12px 0' }}>
                                                <button
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setShowUserMenu(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#DAFAF4',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#11E44F12';
                                                        e.target.style.color = '#11E44F';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#DAFAF4';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-user" style={{ marginRight: '8px' }}></i>
                                                    My Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/dashboard');
                                                        setShowUserMenu(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#DAFAF4',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#11E44F12';
                                                        e.target.style.color = '#11E44F';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#DAFAF4';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-chart-line" style={{ marginRight: '8px' }}></i>
                                                    Dashboard
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/referral');
                                                        setShowUserMenu(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#DAFAF4',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#11E44F12';
                                                        e.target.style.color = '#11E44F';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#DAFAF4';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-network-wired" style={{ marginRight: '8px' }}></i>
                                                    Referral Network
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/media');
                                                        setShowUserMenu(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#DAFAF4',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#11E44F12';
                                                        e.target.style.color = '#11E44F';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#DAFAF4';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-photo-film" style={{ marginRight: '8px' }}></i>
                                                    Media Library
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/payment');
                                                        setShowUserMenu(false);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#DAFAF4',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#11E44F12';
                                                        e.target.style.color = '#11E44F';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#DAFAF4';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-credit-card" style={{ marginRight: '8px' }}></i>
                                                    Payments
                                                </button>
                                                <div style={{ height: '1px', backgroundColor: '#313131', margin: '8px 0' }}></div>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setShowUserMenu(false);
                                                        navigate('/');
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        color: '#e63946',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#e6394612';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="btn btn-accent"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
