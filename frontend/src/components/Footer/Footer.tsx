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

    /* Red top accent bar */
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
    grid-template-columns: 1.4fr 1fr 1fr 0.8fr;
    gap: 32px;
    padding: 28px 40px 22px 40px;
    box-sizing: border-box;

    @media (max-width: 850px) {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        padding: 24px 20px 20px 20px;
    }

    @media (max-width: 500px) {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 20px 16px 16px 16px;
    }
`;

const FooterCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const ColLabel = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: #a51c1c;
    margin: 0 0 4px 0;
`;

const BrandTitle = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #ffffff;
    margin: 0 0 2px 0;
    white-space: nowrap;
`;

const BrandSub = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #4a6080;
    margin: 0;
    line-height: 1.7;
`;

const ContactName = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #e8edf5;
    margin: 0 0 2px 0;
`;

const ContactRole = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #4a6080;
    margin: 0 0 6px 0;
    line-height: 1.4;
`;

const ContactLine = styled.p`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #4a6080;
    margin: 0;
    line-height: 1.7;
`;

const ContactLink = styled.a`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #4a6080;
    text-decoration: none;
    line-height: 1.7;

    &:hover { color: #a51c1c; }
`;

const LinkItem = styled.a`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #4a6080;
    text-decoration: none;
    line-height: 1.8;

    &:hover { color: #a51c1c; }
`;

const FooterBottom = styled.div`
    border-top: 1px solid #1e2d4a;
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 850px) {
        padding: 10px 20px;
        flex-direction: column;
        gap: 4px;
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
                    <BrandSub style={{ marginTop: 6 }}>George M. Low Center for Industrial</BrandSub>
                    <BrandSub>Innovation (CII), Room 2037A</BrandSub>
                    <BrandSub>110 8th St, Troy, NY 12180</BrandSub>
                </FooterCol>

                {/* ── Contact: Sam Chiappone ── */}
                <FooterCol>
                    <ColLabel>Director</ColLabel>
                    <ContactName>Sam Chiappone</ContactName>
                    <ContactRole>Director, Manufacturing Innovation</ContactRole>
                    <ContactLink href="mailto:chiaps@rpi.edu">chiaps@rpi.edu</ContactLink>
                    <ContactLine>518-276-8295</ContactLine>
                    <ContactLine>JEC 3100A</ContactLine>
                </FooterCol>

                {/* ── Contact: Larry Oligny ── */}
                <FooterCol>
                    <ColLabel>Lab Manager</ColLabel>
                    <ContactName>Larry Oligny</ContactName>
                    <ContactRole>Manufacturing Innovation Learning Lab Manager</ContactRole>
                    <ContactLink href="mailto:olignl2@rpi.edu">olignl2@rpi.edu</ContactLink>
                    <ContactLine>518-276-6078</ContactLine>
                    <ContactLine>CII 2037</ContactLine>
                </FooterCol>

                {/* ── Links ── */}
                <FooterCol>
                    <ColLabel>Links</ColLabel>
                    <LinkItem href="https://www.rpiforge.dev" target="_blank" rel="noopener noreferrer">
                        rpiforge.dev
                    </LinkItem>
                    <LinkItem href="https://www.rpiforge.dev/hours" target="_blank" rel="noopener noreferrer">
                        Hours of Operation
                    </LinkItem>
                    <LinkItem href="https://discord.com/invite/ZxUXDH3Me" target="_blank" rel="noopener noreferrer">
                        Join our Discord
                    </LinkItem>
                    <LinkItem href="https://manufacturing.eng.rpi.edu/facilities/forge" target="_blank" rel="noopener noreferrer">
                        Manufacturing Network
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
