import React from "react";
import BannerInnerSection from "../../Components/Banner/inner";
import SingleServiceSection from "../../Components/Service/SingleService";
import AchievementSection from "../../Components/Achievement";
import TeamSection from "../../Components/Team";
import WhyChooseUsSection from "../../Components/ChooseUs";
import HeadTitle from "../../Components/Head/HeadTitle";

const SingleServicePage = () => {
    return(
        <>
            <HeadTitle title="Pro-net-Solutions" />
            <BannerInnerSection title="Our Services" currentPage="Our Services" />
            <SingleServiceSection />
            <AchievementSection/>
            <TeamSection />
            <WhyChooseUsSection />
        </>
    );
}

export default SingleServicePage;

