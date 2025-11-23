import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const CtaSection =() => {
    useAnimateOnScroll();
    
    return(
        <>
            <div className="section py-0 animate-box animated animate__animated" data-animate="animate__zoomIn">
                <div className="hero-container">
                    <div className="cta-banner">
                        <div className="cta-content">
                            <div className="cta-container">
                                <h2 className="secondary-accent">Unlock Your Potential, Reach Out and Transform Your Business!</h2> 
                                <p>Commodo facilisis egestas maximus volutpat iaculis maecenas augue tortor aptent. Efficitur interdum laoreet ullamcorper dis velit purus praesent conubia magna.</p>
                                <div>
                                    <a href="./contact" className="btn btn-secondary-accent">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CtaSection;