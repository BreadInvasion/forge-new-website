import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

// ---------------------------------------------------------------------------
// Figma asset URLs (hosted for 7 days after code generation).
// TODO: Download these images and replace with local imports, e.g.
//   import anvilImg from 'src/assets/img/home/anvil_hero.png';
// ---------------------------------------------------------------------------
const ANVIL_IMG  = 'https://www.figma.com/api/mcp/asset/e305a98f-4e8a-4f0d-9728-79c478ed49fa';
const RULER_IMG  = 'https://www.figma.com/api/mcp/asset/6ec9052a-dfc2-46ee-946b-c83d3607a3ea';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

/** Page wrapper that fills the viewport height minus NavBar and Footer.
 *  NavBar max-height = 72px, Footer min-height = 100px. */
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 72px - 100px);
    min-height: 0;
    flex: 1 1 auto;
    overflow: hidden;
`;

// ── Hero ────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    background: linear-gradient(to right, #2d4a80 10%, #a51c1c 100%);
    overflow: hidden;
`;

/** Vertical ruler along the left edge — sized to viewport height.
 *  Capped at 750px so that on tall desktop monitors (e.g. the Forge
 *  TV at 1920x1080 where `100vh - 263px` = 817px) the ruler artwork
 *  doesn't stretch into an elongated, warped-looking strip. */
const RulerWrap = styled.div`
    position: absolute;
    left: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1;

    img {
        transform: rotate(-90deg) scaleY(-1);
        width: min(calc(100vh - 72px - 100px - 91px), 750px);
        height: 70px;
        object-fit: fill;
        flex-shrink: 0;
    }
`;

/** "Build. Create. Invent." block
 *  The vertical offset is clamped so `10vh` doesn't push the title
 *  absurdly high on tall viewports (Forge TV 1080p, ultrawides, etc.)
 *  — capped at ~80px above center. */
const HeroTextBlock = styled.div`
    position: absolute;
    left: clamp(80px, 9vw, 127px);
    top: 50%;
    transform: translateY(calc(-50% - min(10vh, 80px)));
    width: min(477px, 45%);
    z-index: 2;
`;

const HeroTitle = styled.h1`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(40px, 9vh, 100px);
    line-height: 1.15;
    color: #ffffff;
    white-space: pre;
    margin: 0;
`;

/** Services list beneath the title — offset below center is clamped so the
 *  block doesn't fall out toward the InfoBar on tall viewports. */
const HeroServices = styled.p`
    position: absolute;
    left: clamp(80px, 9vw, 127px);
    top: calc(50% + min(22vh, 180px));
    transform: translateY(-50%);
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(16px, 3vh, 35px);
    color: #ffffff;
    line-height: 1.3;
    margin: 0;
    white-space: pre;
    z-index: 2;
`;

/** Full-height image panel on the right */
const HeroImagePanel = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: min(920px, 60%);
    height: 100%;
    /* make sure it sits behind text */
    z-index: 0;

    img {
        position: absolute;
        height: 103.28%;
        left: -58.18%;
        top: -2.27%;
        width: 158.18%;
        max-width: none;
        object-fit: cover;
    }
`;

// ── Info Bar ────────────────────────────────────────────────────────────────

const InfoBar = styled.div`
    position: relative;
    width: 100%;
    height: clamp(70px, 10vh, 91px);
    background: #ffffff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow: hidden;

    /* Red top accent */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #a51c1c;
    }

    /* Red right accent */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background: #a51c1c;
    }
`;

const MembershipText = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px 0 clamp(40px, 8vw, 100px);

    p {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 700;
        font-size: clamp(18px, 3vw, 50px);
        color: #111c36;
        text-align: center;
        white-space: nowrap;
        margin: 0;
    }
`;

const GetStartedButton = styled(Link)`
    flex-shrink: 0;
    margin-right: clamp(24px, 6vw, 80px);
    width: clamp(160px, 20vw, 260px);
    height: clamp(36px, 6vh, 50px);
    background: #a51c1c;
    border: 2px solid #111c36;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.85;
    }

    span {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 600;
        font-size: clamp(16px, 2.2vw, 30px);
        color: #ffffff;
    }
`;


// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
    return (
        <PageWrapper>

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <HeroSection>

                {/* Vertical ruler decoration */}
                <RulerWrap>
                    <img src={RULER_IMG} alt="" aria-hidden="true" />
                </RulerWrap>

                {/* "Build. Create. Invent." */}
                <HeroTextBlock>
                    <HeroTitle>
                        {'Build.\n  Create.\n      Invent.'}
                    </HeroTitle>
                </HeroTextBlock>

                {/* Services list */}
                <HeroServices>
                    {'3D Print\n   Laser Cut\n       Sticker Print\n            and Much More!'}
                </HeroServices>

                {/* Hero image */}
                <HeroImagePanel>
                    <img
                        src={ANVIL_IMG}
                        alt="The Forge makerspace tools and equipment"
                    />
                </HeroImagePanel>

            </HeroSection>

            {/* ── Info Bar ─────────────────────────────────────────────── */}
            <InfoBar>
                <MembershipText>
                    <p>Membership is Only $20 Per Semester!</p>
                </MembershipText>
                <GetStartedButton to="/getting-started">
                    <span>Get Started</span>
                </GetStartedButton>
            </InfoBar>

        </PageWrapper>
    );
}
