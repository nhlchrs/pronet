import React from "react";
import AboutSection from "../../Components/About/about";
import BannerHome from "../../Components/Banner";
import ModalVideoSection from "../../Components/Video/VideoPlayer";
import ProcessSection from "../../Components/ProcessStep";
import PartnersipSection from "../../Components/Partnership";
import ServiceSection from "../../Components/Service";
import WhyChooseUsSection from "../../Components/ChooseUs";
import CtaSection from "../../Components/CallToAction";
import PortfolioSection from "../../Components/Portfolio";
import BlogSection from "../../Components/Blog";
import TestimonialSection from "../../Components/Testimonial/TestimonialSection";
import AchievementSection from "../../Components/Achievement";

const HomePage = () => {
    return(
        <>
            <BannerHome />
            <ModalVideoSection />
            <AboutSection />
            <ServiceSection />
            <AchievementSection />
            <ProcessSection />
            <WhyChooseUsSection />
            <CtaSection />
            {/* <PortfolioSection /> */}
            <TestimonialSection />
            <BlogSection />
        </>
    );
}

export default HomePage;

