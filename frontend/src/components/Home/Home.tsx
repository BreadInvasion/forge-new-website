import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import bgPattern from '../../assets/img/background.svg?url';
import anvilMobileImg from '../../assets/img/background_mobile_crop.png';
import mobileBenchys from '../../assets/img/mobile_benchys.png';
import anvilDesktopImg from '../../assets/img/anvil_with_benchys_right.png';
import PageRuler from '../shared/PageRuler';

const RULER_IMG = rulerMask;

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

/** Page wrapper — on desktop fills exactly the viewport minus NavBar + Footer
 *  so nothing scrolls. On mobile clamps to the same viewport-minus-navbar
 *  height with overflow hidden so the hero + info bar are a fixed, non-scrollable
 *  full-screen block. */
const PageWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 72px - 100px);
    min-height: 0;
    flex: 1 1 auto;
    overflow: hidden;

    @media (max-width: 768px) {
        height: auto;
        min-height: 0;
        overflow: visible;
        flex: 1 1 auto;
    }
`;

// ── Hero ────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    align-items: stretch;
    background: linear-gradient(to right, #2d4a80 10%, #a51c1c 100%);
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Mobile anvil background — baked into the section as a pseudo-element
     * so it can't shift or scroll independently of its container. Using
     * background-image (not an <img>) avoids the object-position reflow that
     * iOS Safari triggers when the address bar appears/disappears. */
    &::after {
        content: '';
        display: none;

        @media (max-width: 768px) {
            display: block;
            position: absolute;
            inset: 0;
            background-image: url(${anvilMobileImg});
            background-size: 75%;
            background-position: right top;
            background-repeat: no-repeat;
            opacity: 0.6;
            pointer-events: none;
            z-index: 1;
            height: 120%;
            object-fit: cover;
            object-position: right;

        }
    }
`;

/** Benchy scatter — mobile only, far right lower half of hero.
 *  mix-blend-mode: screen makes the black background transparent. */
const MobileBenchyScatter = styled.img`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: absolute;
        right: -30%;
        bottom: 5%;
        width: 70%;
        mix-blend-mode: screen;
        opacity: 0.85;
        pointer-events: none;
        z-index: 1;
    }
`;

/** Text column */
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

    /* At intermediate widths, don't let the image panel compress us */
    @media (max-width: 1300px) and (min-width: 769px) {
        flex-shrink: 0;
        width: min(540px, 48%);
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 50px 32px 22px 32px;  /* increase the top value */
        align-items: flex-start;
        gap: clamp(20px, 5vh, 40px);
        z-index: 2;

    }
`;

const HeroTitle = styled.h1`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(40px, 9vh, 100px);
    line-height: 1.2;
    color: #ffffff;
    margin: 0;

    @media (max-width: 768px) {
        font-size: clamp(36px, 12vw, 64px);
    }
`;

/** One line of the staggered hero title. */
const TitleLine = styled.span<{ $ml?: string }>`
    display: block;
    margin-left: ${p => p.$ml ?? '0'};
`;

const HeroServices = styled.p`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(16px, 3vh, 35px);
    color: #ffffff;
    line-height: 1.35;
    margin: 0;

    @media (max-width: 768px) {
        font-size: clamp(14px, 4.5vw, 24px);
    }
`;

/** One line of the staggered services list. */
const ServiceLine = styled.span<{ $ml?: string }>`
    display: block;
    margin-left: ${p => p.$ml ?? '0'};
`;

/** Image panel — right side on desktop, hidden on mobile (MobileBg replaces it). */
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
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        /* Keep focus on the right side where the anvil + benchys sit */
        object-position: right center;
    }

    /* At intermediate widths the image panel can squeeze the text column because
       it won't shrink. Allow it to give ground so HeroContent keeps enough room
       for the staggered service lines without wrapping. */
    @media (max-width: 1300px) and (min-width: 769px) {
        flex: 0 1 52%;
    }

    @media (max-width: 768px) {
        display: none;
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
    /* Red accents as borders — frees up both pseudo-elements */
    border-top: 4px solid #a51c1c;
    border-right: 4px solid #a51c1c;

    /* Repeating navy geometric pattern */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${bgPattern});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.12;
        pointer-events: none;
        z-index: 0;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
        padding: 12px 20px;
        gap: 8px;
        align-items: center;
        border-right: none;
    }
`;

const MembershipText = styled.div`
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px 0 clamp(40px, 8vw, 100px);

    @media (max-width: 768px) {
        padding: 0 20px;
        flex: unset;
    }

    p {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 700;
        font-size: clamp(18px, 3vw, 50px);
        color: #111c36;
        text-align: center;
        white-space: nowrap;
        margin: 0;

        @media (max-width: 768px) {
            white-space: normal;
            font-size: clamp(13px, 4vw, 18px);
        }
    }
`;

const GetStartedButton = styled(Link)`
    position: relative;
    z-index: 1;
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

    &:hover { opacity: 0.85; }

    span {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 600;
        font-size: clamp(16px, 2.2vw, 30px);
        color: #ffffff;
    }

    @media (max-width: 768px) {
        width: clamp(130px, 50vw, 200px);
        margin-right: 0;
        height: 34px;

        span { font-size: 16px; }
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

    
                {/* Benchy scatter — mobile only, bottom-right */}
                <MobileBenchyScatter
                    src={mobileBenchys}
                    alt=""
                    aria-hidden="true"
                />

                {/* Text column */}
                <HeroContent>
                    <HeroTitle>
                        <TitleLine>Build.</TitleLine>
                        <TitleLine $ml="0.6em">Create.</TitleLine>
                        <TitleLine $ml="1.8em">Invent.</TitleLine>
                    </HeroTitle>
                    <HeroServices>
                        <ServiceLine>3D Print</ServiceLine>
                        <ServiceLine $ml="0.8em">Laser Cut</ServiceLine>
                        <ServiceLine $ml="2em">Sticker Print</ServiceLine>
                        <ServiceLine $ml="3.2em">and Much More!</ServiceLine>
                    </HeroServices>
                </HeroContent>

                {/* Desktop-only: right-side image panel */}
                <HeroImagePanel>
                    <img
                        src={anvilDesktopImg}
                        alt="The Forge makerspace tools and equipment"
                    />
                </HeroImagePanel>

                <PageRuler
                    src={RULER_IMG}
                    side="left"
                    color="#ffffff"
                    zIndex={1}
                />

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
