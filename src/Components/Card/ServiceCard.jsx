import React from "react";


const ServiceCard  = ({icon, title, content, link, highlight}) => {
    return(
        <>
            <div
                className={`card card-service animate-box animated animate__animated ${highlight ? 'card-service--highlight' : ''}`}
                data-animate="animate__fadeIn"
            >
                <div className="icon-circle">
                    <i className={icon}></i>
                </div>
                <h3 className="secondary-accent">{title}</h3>
                <p>{content}</p>
                <div className="service-cta">
                    <a href={link} className="accent-color">Learn More</a>
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </>
    );
}

export default ServiceCard;