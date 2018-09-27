import React from 'react';

const Footer = (props) => {
    return (
        <div className="block footer">
            <div className="block__details">
                <span className="row__data row__data--last">
                    <span className="footer__text">Copyright {props.year}</span>
            <span className="footer__text">Sunrise/Sunset Information Provided By: <a href="https://sunrise-sunset.org/">sunrise-sunset.org</a></span>
                    <span className="footer__text">Version: {props.version}</span>
                </span>
            </div>
        </div>
    );
};

export default Footer;