import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const ProcessSection = () => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section spacious-top">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="sub-heading justify-content-center">
                            <i className="fa-solid fa-circle-notch"></i>
                            <h6 className="font-family-1 accent-color">Our Process</h6>
                        </div>
                        <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp"> Alert Providers You Can Trust</h2>

                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
    <div className="col">
        <div className="d-flex flex-column gspace-1">
            <div className="process-header">
                <span className="process-number">01</span>
            </div>
            <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                <i className="fa-solid fa-signal"></i>
                <h3 className="secondary-accent">Forex Signals</h3>
                <p>Access precise entry and exit points for major currency pairs with 85%+ accuracy, delivered by trusted traders.</p>
            </div>
        </div>
    </div>
    <div className="col">
        <div className="d-flex flex-column gspace-1">
            <div className="process-header">
                <span className="process-number">02</span>
            </div>
            <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                <i className="fa-solid fa-bitcoin-sign"></i>
                <h3 className="secondary-accent">Crypto Analysis</h3>
                <p>Stay ahead of market trends with real-time crypto predictions and signal alerts to make smart investment moves.</p>
            </div>
        </div>
    </div>
    <div className="col">
        <div className="d-flex flex-column gspace-1">
            <div className="process-header">
                <span className="process-number">03</span>
            </div>
            <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                <i className="fa-solid fa-chart-line"></i>
                <h3 className="secondary-accent">Stock Insights</h3>
                <p>Receive expert analysis and actionable buy/sell recommendations for consistently profitable stock picks.</p>
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

export default ProcessSection;

