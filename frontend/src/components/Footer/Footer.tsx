import React from 'react';
import { styled } from 'styled-components';

// ---------------------------------------------------------------------------
// Styled components — matching the Figma "The Forge | The MILL" footer design
// ---------------------------------------------------------------------------

const FooterContainer = styled.footer`
    position: relative;
    width: 100%;
    min-height: 64px;
    background: #111c36;
    display: flex;
    align-items: center;
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
        flex: 1;
    }
`;

const FooterLeft = styled.div`
    display: flex;
    flex-direction: column;
    padding: 14px 0 14px 40px;
`;

const FooterTitle = styled.p`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #ffffff;
    white-space: nowrap;
    margin: 0 0 4px 0;
`;

const FooterAddress = styled.div`
    font-family: 'Funnel Display', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #4a6080;
    line-height: 1.7;

    p { margin: 0; }
`;

const FooterRight = styled.div`
    margin-left: auto;
    padding-right: 40px;
`;

const FooterUrl = styled.a`
    font-family: 'Familjen Grotesk', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #4a6080;
    text-decoration: none;
    white-space: nowrap;

    &:hover { color: #a51c1c; }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Footer() {
    return (
        <FooterContainer>
            <FooterLeft>
                <FooterTitle>THE FORGE | The MILL</FooterTitle>
                <FooterAddress>
                    <p>Rensselaer Polytechnic Institute · School of Engineering</p>
                    <p>110 8th St, Troy, NY 12180</p>
                </FooterAddress>
            </FooterLeft>

            <FooterRight>
                <FooterUrl href="https://rpiforge.dev" target="_blank" rel="noopener noreferrer">
                    rpiforge.dev
                </FooterUrl>
            </FooterRight>
        </FooterContainer>
    );
}
