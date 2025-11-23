import React from "react";
import { servicedata } from "../../Data/Service";
import { Link } from "react-router-dom";

const SingleServiceSection = () => {
    return (
        <section className="section">
            <div className="hero-container">
                <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                    <div className="col col-lg-8">
                        <div className="service-details">
                            <div className="image-container">
                                <img
                                    src="/assets/images/dummy-img-600x400.jpg"
                                    alt="Service Overview"
                                    className="post-detail-img"
                                />
                            </div>

                            <h3>Overview</h3>

                            <div>
                                <p>
                                    Discover how Pro Net Solutions helps you unlock financial opportunities. Our platform connects you to powerful tools for trading, gaming, and e-commerce—no experience required!
                                </p>
                                <p>
                                    Whether you’re aspiring to trade in financial markets, win big in fantasy gaming, or build your own online store, you’ll find tailored solutions, expert guidance, and a vibrant community behind you.
                                </p>
                            </div>

                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                                <div className="col">
                                    <div className="image-container">
                                        <img
                                            src="/assets/images/dummy-img-600x400.jpg"
                                            alt="Teamwork"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="d-flex flex-column h-100 gap-4">
                                        <p>
                                            Explore our key features:
                                        </p>
                                        <ul className="circle-notch-list">
                                            <li>Premium trading signals for forex, crypto, and stocks</li>
                                            <li>Live sports and eSports betting with fast payouts</li>
                                            <li>Curated product catalog and Shopify integration</li>
                                            <li>Mentorship & community-driven support</li>
                                            <li>Affiliate commissions and direct bonuses</li>
                                            <li>Beginner-friendly onboarding—no prior knowledge needed!</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-4">
                        <div className="card other-services">
                            <div className="other-services-content">
                                <h3 className="accent-color-2">Other Services</h3>
                                <div className="underline-1"></div>
                                <ul className="service-list px-0">
                                    {servicedata.map((item) => (
                                        <li key={item.id}>
                                            <Link to={item.link} className="other-service-link">
                                                {item.title}
                                                <i className="fa-solid fa-arrow-right rotate45"></i>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SingleServiceSection;
