import React from 'react';
import styled from 'styled-components';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import bgPattern from '../../assets/img/background.svg?url';
import anvilDesktopImg from '../../assets/img/anvil_with_benchys_right.png';
import anvilMobileImg from '../../assets/img/background_mobile_crop.png';
import mobileBenchysImg from '../../assets/img/mobile_benchys.png';
import PageRuler from './PageRuler';

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
    navy:      '#111c36',
    navyMid:   '#2d4a80',
    navyLight: '#31519c',
    red:       '#a51c1c',
    white:     '#ffffff',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface HeroBannerProps {
    /** Primary large heading content — pass JSX or a string */
    title: React.ReactNode;
    /** Optional secondary content (services list, subtitle, etc.) */
    subtitle?: React.ReactNode;
    /**
     * Controls the visual weight of the banner.
     * - "hero"   — tall, full-weight (landing page)
     * - "banner" — shorter, for interior pages
     */
    variant?: 'hero' | 'banner';
    /** Show the anvil image. Defaults to true. */
    showAnvil?: boolean;
    /** Extra className on the root element */
    className?: string;
}

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const Root = styled.section<{ $variant: 'hero' | 'banner' }>`
    position: relative;
    width: 100%;
    background: linear-gradient(to right, ${C.red} 0%, ${C.navyLight} 100%);
    overflow: hidden;
    flex-shrink: 0;

    /* Hero: fills available height minus navbar+footer on desktop */
    ${p => p.$variant === 'hero' && `
        display: flex;
        align-items: stretch;
        flex: 1 1 auto;
        min-height: 0;

        @media (max-width: 768px) {
            flex-direction: column;
            min-height: 360px;
        }
    `}

    /* Banner: fixed height, content centred vertically */
    ${p => p.$variant === 'banner' && `
        display: flex;
        align-items: center;
        min-height: clamp(160px, 20vw, 279px);

        @media (max-width: 768px) {
            min-height: clamp(140px, 40vw, 220px);
        }
    `}
`;

/* Repeating navy geometric background pattern */
const BgPattern = styled.div`
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
`;

/* ── Mobile anvil background (hero variant only) ─────────────────────────── */
const MobileAnvilBg = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: absolute;
        inset: 0;
        background-image: url(${anvilMobileImg});
        background-size: 72%;
        background-position: right 10% top 8%;
        background-repeat: no-repeat;
        opacity: 0.55;
        pointer-events: none;
        z-index: 1;
    }
`;

/* ── Mobile benchy scatter (hero variant only) ───────────────────────────── */
const MobileBenchyScatter = styled.img`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: absolute;
        right: -18%;
        bottom: 0;
        width: 65%;
        mix-blend-mode: screen;
        opacity: 0.8;
        pointer-events: none;
        z-index: 2;
    }
`;

/* ── Text column ─────────────────────────────────────────────────────────── */
const ContentCol = styled.div<{ $variant: 'hero' | 'banner' }>`
    position: relative;
    z-index: 3;

    ${(p: { $variant: 'hero' | 'banner' }) => p.$variant === 'hero' && `
        flex: 0 0 auto;
        width: min(477px, 45%);
        padding-left: clamp(80px, 9vw, 127px);
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: clamp(40px, 8vh, 120px);

        @media (max-width: 1300px) and (min-width: 769px) {
            flex-shrink: 0;
            width: min(540px, 48%);
        }

        @media (max-width: 768px) {
            width: 100%;
            padding: 50px 32px 180px 32px;
            align-items: flex-start;
            gap: clamp(20px, 5vh, 40px);
        }
    `}

    ${p => p.$variant === 'banner' && `
        max-width: 1440px;
        width: 100%;
        margin: 0 auto;
        padding: 40px clamp(40px, 8vw, 113px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 24px;
            gap: 16px;
        }
    `}
`;

const TitleBlock = styled.div``;

/* ── Desktop image panel (hero variant, hidden on mobile) ────────────────── */
const DesktopImagePanel = styled.div`
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
        object-position: right center;
    }

    @media (max-width: 1300px) and (min-width: 769px) {
        flex: 0 1 52%;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

/* ── Banner-variant decorative anvil (right side, faded) ─────────────────── */
const BannerAnvilAccent = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 45%;
    background-image: url(${anvilDesktopImg});
    background-size: contain;
    background-position: right center;
    background-repeat: no-repeat;
    opacity: 0.18;
    pointer-events: none;
    z-index: 1;

    @media (max-width: 768px) {
        width: 55%;
        opacity: 0.12;
    }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HeroBanner: React.FC<HeroBannerProps> = ({
    title,
    subtitle,
    variant = 'hero',
    showAnvil = true,
    className,
}) => {
    return (
        <Root $variant={variant} className={className}>

            {/* Background pattern */}
            <BgPattern />

            {/* Mobile-only anvil bg + benchy scatter (hero only) */}
            {variant === 'hero' && showAnvil && (
                <>
                    <MobileAnvilBg />
                    <MobileBenchyScatter
                        src={mobileBenchysImg}
                        alt=""
                        aria-hidden="true"
                    />
                </>
            )}

            {/* Banner-variant: faded anvil accent on the right */}
            {variant === 'banner' && showAnvil && <BannerAnvilAccent />}

            {/* Text content */}
            <ContentCol $variant={variant}>
                <TitleBlock>
                    {title}
                </TitleBlock>
                {subtitle && subtitle}
            </ContentCol>

            {/* Desktop image panel (hero variant only) */}
            {variant === 'hero' && showAnvil && (
                <DesktopImagePanel>
                    <img
                        src={anvilDesktopImg}
                        alt="The Forge makerspace tools and equipment"
                    />
                </DesktopImagePanel>
            )}

            {/* Ruler decoration */}
            <PageRuler
                src={rulerMask}
                side="left"
                color={C.white}
                zIndex={4}
            />

        </Root>
    );
};

export default HeroBanner;
