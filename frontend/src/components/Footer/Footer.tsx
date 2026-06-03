import React from 'react';
import { styled } from 'styled-components';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const FooterContainer = styled.footer`
    position: relative;
    width: 100%;
    background: #111c36;
    flex-shrink: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #a51c1c;
    }
`;

const FooterInner = styled.div`
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr 0.8fr;
    gap: 32px;
    padding: 32px 40px 24px 40px;
    box-sizing: border-box;

    @media (max-width: 1000px) {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 28px;
        padding: 28px 28px 20px 28px;
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding: 20px 16px 16px 16px;

        /* On mobile hide staff columns — keep brand + links only */
        & > *:nth-child(2),
        & > *:nth-child(3),
        & > *:nth-child(4) {
            display: none;
        }
    }
`;

const FooterCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

/* Semantic heading for screen readers, styled as a small label */
const ColLabel = styled.h3`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #a51c1c;
    margin: 0 0 6px 0;
`;

const BrandTitle = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #ffffff;
    margin: 0 0 2px 0;
`;

const BrandSub = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #7a90aa;
    margin: 0;
    line-height: 1.7;
`;

const ContactName = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #e8edf5;
    margin: 0 0 1px 0;
`;

const ContactRole = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #7a90aa;
    margin: 0 0 6px 0;
    line-height: 1.4;
`;

const ContactLine = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #7a90aa;
    margin: 0;
    line-height: 1.7;
`;

const ContactLink = styled.a`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #7a90aa;
    text-decoration: none;
    line-height: 1.7;

    &:hover { color: #ffffff; text-decoration: underline; }
    &:focus-visible {
        outline: 2px solid #a51c1c;
        outline-offset: 2px;
        border-radius: 2px;
    }
`;

const LinkItem = styled.a`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #7a90aa;
    text-decoration: none;
    line-height: 1.9;

    &:hover { color: #ffffff; text-decoration: underline; }
    &:focus-visible {
        outline: 2px solid #a51c1c;
        outline-offset: 2px;
        border-radius: 2px;
    }
`;

/* Visually hidden text for screen readers (e.g. "opens in new tab") */
const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const FooterBottom = styled.div`
    border-top: 1px solid #1e2d4a;
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 850px) {
        padding: 8px 16px;
        flex-direction: column;
        gap: 2px;
        align-items: flex-start;
    }
`;

const Copyright = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11px;
    color: #2e3f5c;
    margin: 0;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Footer() {
    return (
        <FooterContainer>
            <FooterInner>

                {/* ── Brand ── */}
                <FooterCol>
                    <ColLabel>The Forge</ColLabel>
                    <BrandTitle>THE FORGE | THE MILL</BrandTitle>
                    <BrandSub>Rensselaer Polytechnic Institute</BrandSub>
                    <BrandSub>School of Engineering</BrandSub>
                    <BrandSub style={{ marginTop: 6 }}>
                        George M. Low Center for Industrial
                    </BrandSub>
                    <BrandSub>Innovation (CII), Room 2037A</BrandSub>
                    <ContactLink
                        href="https://maps.google.com/?q=110+8th+St,+Troy,+NY+12180"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginTop: 2 }}
                    >
                        110 8th St, Troy, NY 12180
                        <VisuallyHidden> (opens in new tab)</VisuallyHidden>
                    </ContactLink>
                </FooterCol>

                {/* ── Contact: Sam Chiappone ── */}
                <FooterCol>
                    <ColLabel>Director</ColLabel>
                    <ContactName>Sam Chiappone</ContactName>
                    <ContactRole>Director, Manufacturing Innovation</ContactRole>
                    <ContactLink href="mailto:chiaps@rpi.edu">chiaps@rpi.edu</ContactLink>
                    <ContactLink href="tel:+15182768295">518-276-8295</ContactLink>
                    <ContactLine>JEC 3100A</ContactLine>
                </FooterCol>

                {/* ── Contact: Larry Oligny ── */}
                <FooterCol>
                    <ColLabel>Lab Manager</ColLabel>
                    <ContactName>Larry Oligny</ContactName>
                    <ContactRole>Manufacturing Innovation Learning Lab Manager</ContactRole>
                    <ContactLink href="mailto:olignl2@rpi.edu">olignl2@rpi.edu</ContactLink>
                    <ContactLink href="tel:+15182766078">518-276-6078</ContactLink>
                    <ContactLine>CII 2037</ContactLine>
                </FooterCol>

                {/* ── Contact: Scott Yerbury ── */}
                <FooterCol>
                    <ColLabel>Academic Support</ColLabel>
                    <ContactName>Scott Yerbury</ContactName>
                    <ContactRole>Senior Academic Support Technician</ContactRole>
                    <ContactLink href="mailto:yerbus@rpi.edu">yerbus@rpi.edu</ContactLink>
                    <ContactLink href="tel:+15182768290">518-276-8290</ContactLink>
                    <ContactLine>JEC 3004/3018, 3rd Fl</ContactLine>
                </FooterCol>

                {/* ── Links ── */}
                <FooterCol>
                    <ColLabel>Links</ColLabel>
                    <LinkItem href="https://www.rpiforge.dev/hours" target="_blank" rel="noopener noreferrer">
                        Hours of Operation
                        <VisuallyHidden> (opens in new tab)</VisuallyHidden>
                    </LinkItem>
                    <LinkItem href="https://discord.gg/WdJzzyXyWu" target="_blank" rel="noopener noreferrer">
                        Join our Discord
                        <VisuallyHidden> (opens in new tab)</VisuallyHidden>
                    </LinkItem>
                    <LinkItem href="https://manufacturing.eng.rpi.edu/facilities/forge" target="_blank" rel="noopener noreferrer">
                        Manufacturing Network
                        <VisuallyHidden> (opens in new tab)</VisuallyHidden>
                    </LinkItem>
                </FooterCol>

            </FooterInner>

            <FooterBottom>
                <Copyright>© {new Date().getFullYear()} The Forge — Rensselaer Polytechnic Institute</Copyright>
                <Copyright>School of Engineering · Manufacturing Innovation</Copyright>
            </FooterBottom>
        </FooterContainer>
    );
}
