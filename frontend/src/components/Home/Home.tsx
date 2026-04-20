import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import PageRuler from '../shared/PageRuler';

// ---------------------------------------------------------------------------
// Figma asset URLs (hosted for 7 days after code generation).
// TODO: Download these images and replace with local imports, e.g.
//   import anvilImg from 'src/assets/img/home/anvil_hero.png';
// ---------------------------------------------------------------------------
const ANVIL_IMG  = 'https://www.figma.com/api/mcp/asset/e305a98f-4e8a-4f0d-9728-79c478ed49fa';
// Use the long-tick ruler graphic (same asset as RULER_2 on the Getting
// Started page) and recolor it to white via CSS filter. The original Home
// ruler asset had noticeably shorter ticks inside its canvas and read as a
// different graphic than the rulers on Getting Started.
const RULER_IMG  = 'https://www.figma.com/api/mcp/asset/7c80f8d8-834a-4822-b125-67a1c47398d7';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
// Layout philosophy: use flex containers with auto sizing so the page looks
// structurally identical on every display type (1440p laptop, 1080p desktop,
// 4K, ultrawide, Forge TV). Avoid absolute-positioned children driven by
// viewport-math offsets — those have to be tuned per resolution and drift
// out of place on the Forge TV.

/** Page wrapper that fills the viewport height minus NavBar and Footer.
 *  NavBar max-height = 72px, Footer min-height = 100px.
 *  `position: relative` scopes the shared <PageRuler /> to the whole page. */
const PageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 72px - 100px);
    min-height: 0;
    flex: 1 1 auto;
    overflow: hidden;
`;

// ── Hero ────────────────────────────────────────────────────────────────────

/** Hero is a flex row: text column on the left, image panel on the right.
 *  The page-level <PageRuler /> renders the left-edge ruler. */
const HeroSection = styled.section`
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    align-items: stretch;
    background: linear-gradient(to right, #2d4a80 10%, #a51c1c 100%);
    overflow: hidden;
`;

/** Text column — title stacked above the services list. Vertical centering
 *  comes from `justify-content: center`; `gap` controls the visual split
 *  between the two blocks the same way on every display. No viewport-math
 *  offsets required. */
const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    flex: 0 0 auto;
    width: min(477px, 45%);
    padding-left: clamp(80px, 9vw, 127px);
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: clamp(40px, 8vh, 120px);
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

const HeroServices = styled.p`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(16px, 3vh, 35px);
    color: #ffffff;
    line-height: 1.3;
    margin: 0;
    white-space: pre;
`;

/** Image panel pinned to the right edge of the hero. Capped at the design's
 *  native 920px (60% of a 1440px-wide hero) so the anvil doesn't balloon on
 *  wide displays like the 1920x1080 Forge TV — on those, the extra width
 *  becomes empty gradient between the text column and the image instead of
 *  making the anvil grotesquely large. `margin-left: auto` pushes the panel
 *  to the right; everything to its left is the hero's gradient background. */
const HeroImagePanel = styled.div`
    position: relative;
    flex: 0 0 min(920px, 60%);
    margin-left: auto;
    min-width: 0;
    align-self: stretch;
    overflow: hidden;
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

            {/* Single continuous vertical ruler down the left edge of the
                 page. White tint so it reads on the navy/red hero gradient. */}
            <PageRuler
                src={RULER_IMG}
                side="left"
                color="#ffffff"
                zIndex={1}
            />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <HeroSection>

                {/* Text column — title + services list */}
                <HeroContent>
                    <HeroTitle>
                        {'Build.\n  Create.\n      Invent.'}
                    </HeroTitle>
                    <HeroServices>
                        {'3D Print\n   Laser Cut\n       Sticker Print\n            and Much More!'}
                    </HeroServices>
                </HeroContent>

                {/* Hero image panel */}
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
