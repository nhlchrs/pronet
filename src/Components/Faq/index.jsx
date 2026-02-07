import React, { useState } from "react";
import { faqdata } from "../../Data/faqdata";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    useAnimateOnScroll();

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="faq-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color-1">FAQs</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Answers to Help You Get Started</h2>
                        </div>

                        <div className="faq-wrapper">
                            <div className="accordion d-flex flex-column gspace-2" id="faqAccordion">
                            {faqdata.map((item, index) => (
                                <div className="accordion-item" key={item.id}>
                                    <h2 className="accordion-header">
                                        <button
                                        className={`accordion-button ${
                                            openIndex !== index ? "collapsed" : ""
                                        }`}
                                        type="button"
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq${item.id}`}
                                        >
                                        {item.question}
                                        </button>
                                    </h2>
                                    {openIndex === index && (
                                        <div
                                            id={`faq${item.id}`}
                                            className="accordion-collapse"
                                        >
                                            <div className="accordion-body">{item.answer}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FaqSection;

