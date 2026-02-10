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
import ForgotPasswordPage from "./Page/ForgotPassword";
import ResetPasswordPage from "./Page/ResetPassword";
import Dashboard from "./Page/Dashboard";
import ProfilePage from "./Page/Profile";
import AnnouncementsPage from "./Page/Announcements";
import TeamsPage from "./Page/Teams";
import MeetingsPage from "./Page/Meetings";
import ReferralPage from "./Page/ReferralPage";
import SecureMedia from "./Page/SecureMedia";
import PaymentPage from "./Page/Payment";
import PayoutPage from "./Page/Payout";
import AgreementPage from "./Page/Agreement";
import DisclaimerPage from "./Page/Disclaimer";
import LearnMorePage from "./Page/LearnMore";
import TermsPage from "./Page/Terms";
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
            <Route path="agreement" element={<AgreementPage />} />
            <Route path="disclaimer" element={<DisclaimerPage />} />
            <Route path="learn-more" element={<LearnMorePage />} />
            <Route path="terms" element={<TermsPage />} />
            
            {/* Authentication Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-otp" element={<VerifyOTPPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
            <Route path="meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
            <Route path="media" element={<ProtectedRoute><SecureMedia /></ProtectedRoute>} />
            <Route path="referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
            <Route path="payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="payout" element={<ProtectedRoute><PayoutPage /></ProtectedRoute>} />
            
            <Route path="404-page" element={<PageNotFound />}/>
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
    );
}

export default AppRouters;

