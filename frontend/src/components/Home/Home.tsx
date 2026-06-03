import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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

    @media (max-width: 900px) {
        height: auto;
        min-height: calc(100svh - 56px); /* fill screen minus navbar */
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

    @media (max-width: 900px) {
        height: auto;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        overflow: visible;
        background: linear-gradient(to right, #2d4a80 10%, #a51c1c 100%);
    }
`;

/** Benchy scatter — mobile only, far right lower half of hero.
 *  mix-blend-mode: screen makes the black background transparent. */
const MobileBenchyScatter = styled.img`
    display: none;
`;

/** Max-width content wrapper inside HeroSection — keeps content ≤ 1440 px centred
 *  while the gradient background stays full-bleed. */
const HeroInner = styled.div`
    position: relative;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`;

/** Text column */
const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    flex: 0 0 auto;
    width: min(477px, 45%);
    padding-left: clamp(100px, 11vw, 160px);
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

    @media (max-width: 900px) {
        position: relative;
        width: 100%;
        padding: clamp(24px, 6vw, 48px) clamp(20px, 5vw, 40px) 16px;
        gap: clamp(16px, 4vw, 28px);
        justify-content: flex-start;
        align-items: flex-start;
        z-index: 2;
        flex: 0 0 auto;
    }
`;

const HeroTitle = styled.h1`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(40px, 9vh, 100px);
    line-height: 1.2;
    color: #ffffff;
    margin: 0;

    @media (max-width: 900px) {
        font-size: clamp(52px, 15vw, 80px);
        line-height: 1.15;
        margin: 0;
    }
`;

/** One line of the staggered hero title. */
const TitleLine = styled.span<{ $ml?: string }>`
    display: block;
    margin-left: ${(p: { $ml?: string }) => p.$ml ?? '0'};
`;

const HeroServices = styled.p`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(16px, 3vh, 35px);
    color: #ffffff;
    line-height: 1.35;
    margin: 0;

    @media (max-width: 900px) {
        font-size: clamp(18px, 5vw, 26px);
        line-height: 1.4;
        margin: 0;
    }
`;

/** One line of the staggered services list. */
const ServiceLine = styled.span<{ $ml?: string }>`
    display: block;
    margin-left: ${(p: { $ml?: string }) => p.$ml ?? '0'};
`;

/** Desktop image panel */
const HeroImagePanel = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    /* Fade left edge so image doesn't clash with text */
    mask-image: linear-gradient(to right, transparent 25%, black 55%);
    -webkit-mask-image: linear-gradient(to right, transparent 25%, black 55%);

    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: right center;
    }

    @media (max-width: 900px) {
        display: none;
    }
`;

/** Mobile image panel — exact Figma crop, upper-right, hidden on desktop */
const MobileImagePanel = styled.div`
    display: none;

    @media (max-width: 900px) {
        display: block;
        position: relative;
        width: 100%;
        /* Fixed pixel height — never resizes when browser chrome shows/hides */
        height: 280px;
        flex-shrink: 0;
        margin-top: auto; /* push to bottom of hero */
        background-image: url(${anvilDesktopImg});
        background-size: cover;
        background-position: center 30%;
        background-repeat: no-repeat;
        /* Fade top edge to blend with text above */
        mask-image: linear-gradient(to bottom, transparent 0%, black 30%);
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 30%);

        img { display: none; }
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
    justify-content: center;
    gap: 24px;
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

    @media (max-width: 900px) {
        /* Figma: single row, 50px tall, text left + button right */
        flex-direction: row;
        height: 50px;
        padding: 0 12px;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        border-right: none;
    }
`;

/** Inner wrapper for InfoBar — caps content at 1440 px and centres it. */
const InfoBarInner = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
        gap: 8px;
        align-items: center;
    }
`;

const MembershipText = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0 20px;

    @media (max-width: 900px) {
        padding: 0;
        flex: 1;
        justify-content: flex-start;
    }

    p {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 700;
        font-size: clamp(18px, 3vw, 50px);
        color: #111c36;
        text-align: center;
        white-space: nowrap;
        margin: 0;

        @media (max-width: 900px) {
            white-space: nowrap;
            font-size: 16px;
            text-align: left;
        }
    }
`;

const GetStartedButton = styled(Link)`
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    margin-right: 0;
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

    @media (max-width: 900px) {
        /* Figma: 78×18px pill */
        width: 78px;
        height: 22px;
        flex-shrink: 0;
        margin-right: 0;
        border-radius: 10px;

        span { font-size: 12px; }
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

                {/* Desktop image panel */}
                <HeroImagePanel>
                    <img
                        src={anvilDesktopImg}
                        alt="The Forge makerspace tools and equipment"
                    />
                </HeroImagePanel>

                {/* Mobile image panel — Figma crop offsets, upper-right */}
                <MobileImagePanel>
                    <img
                        src={anvilDesktopImg}
                        alt=""
                        aria-hidden="true"
                    />
                </MobileImagePanel>

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
