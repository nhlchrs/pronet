import React, { useState } from "react";
import { contactAPI } from "../../services/api";

const NewsletterForm = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(false);

        if (validateEmail(email)) {
            setLoading(true);
            try {
                await contactAPI.subscribeNewsletter(email);
                setSuccess(true);
                setError(false);
                setEmail("");
            } catch (err) {
                setSuccess(false);
                setError(true);
            } finally {
                setLoading(false);
            }
        } else {
            setSuccess(false);
            setError(true);
        }

        setTimeout(() => {
            setSuccess(false);
            setError(false);
        }, 3000);
    };

    return (
        <div className="newsletter-bg">
            <div className="card newsletter-card">
                <h2 className="secondary-accent">Subscribe to our newsletter</h2>
                <p className="secondary-accent">
                    Subscribe to our newsletter and become part of our learning community.
                </p>
                <ul className="secondary-accent" style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                    <li>Get updates on live classes, market education, and fintech trends.</li>
                    <li>Access exclusive tips and platform announcements.</li>
                    <li>Simple, useful, and learner-focused content.</li>
                </ul>
                <p className="secondary-accent" style={{ fontWeight: '600', marginTop: '10px' }}>
                    Stay connected. Stay informed
                </p>

                {success && (
                    <div id="newsletter-success" className="alert success">
                        <span className="check-icon">
                            <i className="fa-solid fa-2xl fa-check"></i>
                        </span>
                        <p className="accent-color-3 text-center">
                            Thank you! Form submitted successfully.
                        </p>
                    </div>
                )}

                {error && (
                    <div id="newsletter-error" className="alert error">
                        <span className="cross-icon">
                            <i className="fa-solid fa-2xl fa-xmark"></i>
                        </span>
                        <p className="accent-color-3 text-center">
                            Oops! Form submission failed. Please try again.
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    id="newsletterForm"
                    className="form gspace-2 needs-validation"
                    noValidate
                >
                    <div className="d-flex flex-column flex-md-row w-100 gspace-2">
                        <div className="d-flex w-100 flex-column gspace-2">
                            <input
                                type="email"
                                name="newsletter-email"
                                id="newsletter-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                            {error && (
                                <p className="error-text">Message is required</p>
                            )}
                        </div>
                        <button className="btn btn-red-accent" type="submit" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewsletterForm;

