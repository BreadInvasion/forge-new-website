import React from 'react';
import './Footer.scss';
import footerContacts from './footerContacts.json';

// Converts "518-276-8295" -> "+15182768295" for tel: links
const toTelHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

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

                {/* ── Contacts ── */}
                {footerContacts.map((contact) => (
                    <div className="footer-col" key={contact.name}>
                        <h3 className="footer-col-label">{contact.label}</h3>
                        <p className="footer-contact-name">{contact.name}</p>
                        {contact.role && (
                            <p className="footer-contact-role">{contact.role}</p>
                        )}
                        <a className="footer-link" href={`mailto:${contact.email}`}>{contact.email}</a>
                        {contact.phone && (
                            <a className="footer-link" href={toTelHref(contact.phone)}>{contact.phone}</a>
                        )}
                        <p className="footer-contact-line">{contact.location}</p>
                    </div>
                ))}

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
