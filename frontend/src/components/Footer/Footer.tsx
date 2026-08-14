import React from 'react';
import './Footer.scss';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">

                {/* ── Brand ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">The Forge</h3>
                    <p className="footer-brand-title">THE FORGE | THE MILL</p>
                    <p className="footer-brand-sub">Rensselaer Polytechnic Institute</p>
                    <p className="footer-brand-sub">School of Engineering</p>
                    <p className="footer-brand-sub" style={{ marginTop: 6 }}>
                        George M. Low Center for Industrial<br />Innovation (CII), Room 2037A
                    </p>
                    <a
                        className="footer-link"
                        href="https://maps.google.com/?q=110+8th+St,+Troy,+NY+12180"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginTop: 2 }}
                    >
                        110 8th St, Troy, NY 12180
                        <span className="footer-visually-hidden"> (opens in new tab)</span>
                    </a>
                </div>

                {/* ── Contact: Sam Chiappone ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">Director</h3>
                    <p className="footer-contact-name">Sam Chiappone</p>
                    <p className="footer-contact-role">Director, Manufacturing Innovation</p>
                    <a className="footer-link" href="mailto:chiaps@rpi.edu">chiaps@rpi.edu</a>
                    <a className="footer-link" href="tel:+15182768295">518-276-8295</a>
                    <p className="footer-contact-line">JEC 3100A</p>
                </div>

                {/* ── Contact: Larry Oligny ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">Lab Manager</h3>
                    <p className="footer-contact-name">Larry Oligny</p>
                    <p className="footer-contact-role">Manufacturing Innovation Learning Lab Manager</p>
                    <a className="footer-link" href="mailto:olignl2@rpi.edu">olignl2@rpi.edu</a>
                    <a className="footer-link" href="tel:+15182766078">518-276-6078</a>
                    <p className="footer-contact-line">CII 2037</p>
                </div>

                {/* ── Contact: Scott Yerbury ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">Academic Support</h3>
                    <p className="footer-contact-name">Scott Yerbury</p>
                    <p className="footer-contact-role">Senior Academic Support Technician</p>
                    <a className="footer-link" href="mailto:yerbus@rpi.edu">yerbus@rpi.edu</a>
                    <a className="footer-link" href="tel:+15182768290">518-276-8290</a>
                    <p className="footer-contact-line">JEC 3004/3018, 3rd Fl</p>
                </div>

                {/* ── Contact: Sal Ferrara ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">Advisor</h3>
                    <p className="footer-contact-name">Sal Ferrara</p>
                    <a className="footer-link" href="mailto:ferras6@rpi.edu">ferras6@rpi.edu</a>
                    <p className="footer-contact-line">CII 2037</p>
                </div>

                {/* ── Links ── */}
                <div className="footer-col">
                    <h3 className="footer-col-label">Links</h3>
                    <a className="footer-nav-link" href="/hours">
                        Hours of Operation
                    </a>
                    <a className="footer-nav-link" href="https://discord.gg/WdJzzyXyWu" target="_blank" rel="noopener noreferrer">
                        Join our Discord
                        <span className="footer-visually-hidden"> (opens in new tab)</span>
                    </a>
                    <a className="footer-nav-link" href="https://manufacturing.eng.rpi.edu/facilities/forge" target="_blank" rel="noopener noreferrer">
                        Manufacturing Network
                        <span className="footer-visually-hidden"> (opens in new tab)</span>
                    </a>
                </div>

            </div>

            <div className="footer-bottom">
                <p className="footer-copyright">© {new Date().getFullYear()} The Forge — Rensselaer Polytechnic Institute</p>
                <p className="footer-copyright">School of Engineering · Manufacturing Innovation</p>
            </div>
        </footer>
    );
}
