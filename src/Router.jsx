import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/Home";
import AboutPage from "./Page/About";
import ServicePage from "./Page/Service";
import PortfolioPage from "./Page/Portfolio";
import PricingPage from "./Page/Pricing";
import TeamPage from "./Page/Team";
import TestimonialPage from "./Page/Testimonial";
import FaqPage from "./Page/Faq";
import BlogPage from "./Page/Blog";
import ContactPage from "./Page/Contact";
import SingleServicePage from "./Page/ServiceDetail";
import SinglePortfolioPage from "./Page/PortfolioDetail";
import SinglePostPage from "./Page/SinglePost";
import PageNotFound from "./Page/NotFoundPage/NotFound";
import LoginPage from "./Page/Login";
import RegisterPage from "./Page/Register";
import VerifyOTPPage from "./Page/VerifyOTP";
import Dashboard from "./Page/Dashboard";
import ProfilePage from "./Page/Profile";
import AnnouncementsPage from "./Page/Announcements";
import ProtectedRoute from "./Components/ProtectedRoute";

function AppRouters(){
    return(
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="service-detail" element={<SingleServicePage />} />
            {/* <Route path="portfolio" element={<PortfolioPage />} /> */}
            {/* <Route path="portfolio-detail" element={<SinglePortfolioPage/>}/> */}
            <Route path="pricing" element={<PricingPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="testimonial" element={<TestimonialPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="blog" element={<BlogPage/>} />
            <Route path="single-post" element={<SinglePostPage />} />
            <Route path="contact" element={<ContactPage />}/>
            
            {/* Authentication Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-otp" element={<VerifyOTPPage />} />
            
            {/* Protected Routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
            
            <Route path="404-page" element={<PageNotFound />}/>
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
    );
}

export default AppRouters;