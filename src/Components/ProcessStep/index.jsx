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
                        <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Market research you can trust  </h2>

                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
    <div className="col">
        <div className="d-flex flex-column gspace-1">
            <div className="process-header">
                <span className="process-number">01</span>
            </div>
            <div className="card card-process animate-box animated animate__animated" data-animate="animate__fadeInUp">
                <i className="fa-solid fa-signal"></i>
                <h3 className="secondary-accent">Technical Analysis</h3>
                <p>Leverage high-probability, data-backed trade setups built to
capitalize on short-term volatility and market inefficiencies. Our technical frameworks
focus on precise entries, structured risk management, and optimized exit strategies to
maximize edge and consistency.</p>
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
                <h3 className="secondary-accent">Market Research & Strategic Commentary</h3>
                <p> Gain a comprehensive understanding of
market dynamics through in-depth research and macro-level insights. We go beyond
price movement to explain underlying drivers, valuation perspectives, liquidity flows,
and the broader economic environment shaping asset behavior.</p>
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
                <h3 className="secondary-accent">Actionable Insights</h3>
                <p>Transform complex market data into clear, practical opportunities.
We deliver structured trade ideas and investment perspectives designed to help you act
decisively with confidence and disciplined risk management.</p>
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

