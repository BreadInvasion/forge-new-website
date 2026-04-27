import React, { useLayoutEffect, useRef } from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import stepDot from '../../assets/img/step-dot.svg?url';
import locPin from '../../assets/img/loc-pin.svg?url';
import heroMobileBg from '../../assets/img/background_mobile.png';
import PageRuler from '../shared/PageRuler';

// ---------------------------------------------------------------------------
// Figma asset URLs — hero background images (still active).
// ---------------------------------------------------------------------------
const HERO_BG_DESKTOP = 'https://www.figma.com/api/mcp/asset/2ee84860-092b-437d-a811-cd043d04c5d0';
const HERO_BG_MOBILE  = 'https://www.figma.com/api/mcp/asset/eac57d69-f072-4e3a-b856-5314d8f551a8';

// Local assets replace expired Figma URLs.
const RULER    = rulerMask;
const STEP_DOT = stepDot;
const LOC_PIN  = locPin;

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
  navy:        '#111c36',
  navyMid:     '#2d4a80',
  navyLight:   '#31519c',
  red:         '#a51c1c',
  redMuted:    'rgba(165,28,28,0.75)',
  slate:       '#64748b',
  lightBlue:   '#bac8db',
  bgLight:     '#eef2f8',
  divider:     '#e2e8f0',
};

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

/** Full-bleed section wrapper */
const Section = styled.section<{ bg?: string }>`
  position: relative;
  width: 100%;
  background: ${p => p.bg ?? '#fff'};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    background-position: 0 var(--pattern-y, 0px);
    opacity: 0.03;
    pointer-events: none;
  }
`;

/** Left-aligned content with Figma-matching horizontal margins */
const SectionInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 120px 0 174px;
  position: relative;

  @media (max-width: 1024px) {
    padding-left: 80px;
    padding-right: 60px;
  }

  @media (max-width: 768px) {
    padding-left: 20px !important;
    padding-right: 20px !important;
    padding-top: 28px !important;
    padding-bottom: 28px !important;
  }
`;

// ---------------------------------------------------------------------------
// Step label (red, tracking)
// ---------------------------------------------------------------------------
const StepLabel = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${C.red};
  letter-spacing: 1.12px;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 14px 0;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 26px;
    line-height: 32px;
    margin: 0 0 14px 0;
  }
`;

const SectionSubtitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: ${C.slate};
  letter-spacing: 1.12px;
  line-height: 1.25;
  max-width: 572px;
  margin: 0 0 40px 0;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0;
    margin: 0 0 14px 0;
    max-width: 100%;
  }
`;

// ============================================================
// HERO
// ============================================================
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 361px;
  background: linear-gradient(to right, ${C.navy}, ${C.navyLight});
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    min-height: 260px;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${heroMobileBg});
      background-size: cover;
      background-position: center center;
      opacity: 0.2;
      pointer-events: none;
      z-index: 0;
    }
  }
`;

const HeroInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 174px;
  position: relative;
  min-height: 361px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 36px 30px;
    min-height: 260px;
    position: relative;
    z-index: 1;
  }
`;

/** Decorative floating geometry in the hero right area */
const HeroDeco = styled.div<{ src: string; w: number; h: number; right: number; top: number }>`
  position: absolute;
  width: ${p => p.w}px;
  height: ${p => p.h}px;
  right: ${p => p.right}px;
  top: ${p => p.top}px;
  background-image: url(${p => p.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  overflow: hidden;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(40px, 5.2vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 20px 0;
  max-width: 820px;

  @media (max-width: 768px) {
    font-size: 30px;
    line-height: 36px;
    margin: 0 0 12px 0;
  }
`;

const HeroSubtitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${C.lightBlue};
  line-height: 1.25;
  max-width: 780px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
  }
`;

// ============================================================
// STEP PROGRESS BAR  (sits at top of Step-1 section)
// ============================================================
const StepBar = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  padding: 12px 0 8px 0;
  flex-wrap: wrap;

  /* Intermediate desktop: tighten gap so all 5 steps stay on one row */
  @media (max-width: 1300px) and (min-width: 769px) {
    gap: 16px;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    padding-left: 16px;
    padding-right: 16px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0;
    padding: 16px 20px;
    background: ${C.bgLight};
  }
`;

// Red rectangle that runs under the step progress bar. Starts just past the
// ruler on the left edge so it visually plugs into one of the ruler ticks
// (like the Admin page tab divider does). Full-bleed to the right edge.
const StepBarDivider = styled.div`
  height: 4px;
  width: 100%;
  margin: 0;
  background: ${C.red};
  position: relative;
  top: 9px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StepItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
`;

const StepDot = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  img { position: absolute; inset: 0; width: 100%; height: 100%; }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #fff;
    line-height: 1;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;

    span {
      font-size: 14px;
    }
  }
`;

const StepName = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  line-height: 1.25;
  white-space: nowrap;

  @media (max-width: 1300px) and (min-width: 769px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StepNameMobile = styled.span`
  display: none;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 11px;
  color: ${C.slate};
  line-height: normal;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 768px) {
    display: block;
  }
`;

// ============================================================
// FILE TYPES  (Step 1)
// ============================================================
const FileCardsGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const FileCard = styled.div`
  flex: 1 1 150px;
  max-width: 171px;
  min-height: 284px;
  border: 1px solid ${C.slate};
  border-radius: 5px;
  background: #fff;
  padding: 24px 16px 20px 16px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 0;
    padding: 14px;
    border-width: 0.5px;
  }
`;

const FileExtRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  margin-bottom: 10px;
`;

const FileDot = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${C.red};
`;

const FileExt = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${C.navy};
  letter-spacing: 1.68px;

  @media (max-width: 768px) {
    font-size: 22px;
    letter-spacing: 0;
  }
`;

const FileMachine = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${C.navy};
  letter-spacing: 1.4px;
  line-height: 1.25;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 13px;
    letter-spacing: 0;
    color: ${C.navy};
    margin: 0 0 6px 0;
  }
`;

const FileDesc = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.slate};
  line-height: 1.35;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 11px;
    font-weight: 500;
  }
`;

// ============================================================
// MATERIALS & PRICING  (Step 2)
// ============================================================
const PricingGrid = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 36px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 0;
  }
`;

const PricingCard = styled.div`
  flex: 1 1 300px;
  max-width: 352px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: ${C.bgLight};
  overflow: hidden;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
    border: 0.5px solid ${C.slate};
    overflow: visible;
    height: auto;
  }
`;

const PricingCardHeader = styled.div`
  padding: 16px 24px 10px 24px;
  border-bottom: 1px solid ${C.divider};

  @media (max-width: 768px) {
    padding: 12px 16px 12px 16px;
    border-bottom: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 16px;
      right: 16px;
      height: 0.5px;
      background: rgba(49, 81, 156, 0.8);
    }
  }
`;

const PricingCardTitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  letter-spacing: 1.68px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
    letter-spacing: 0;
  }
`;

const PricingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid ${C.divider};

  &:last-child { border-bottom: none; }

  @media (max-width: 768px) {
    padding: 10px 16px;
    border-bottom: none;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 16px;
      right: 16px;
      height: 0.5px;
      background: rgba(49, 81, 156, 0.8);
    }
  }
`;

const PricingMaterial = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;

  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 0;
  }
`;

const PricingAmount = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${C.navyLight};

  @media (max-width: 768px) {
    font-size: 14px;
    color: ${C.navyLight};
  }
`;

const PricingUnit = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${C.slate};
`;

const BannedBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 28px;
  background: ${C.red};
  border: 2px solid ${C.navy};
  border-radius: 10px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

// ============================================================
// MACHINES  (Step 3)
// ============================================================
const MachineGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: visible;
  }
`;

const MachineCard = styled.div`
  flex: 1 1 200px;
  max-width: 256px;
  min-height: 284px;
  border: 1px solid ${C.slate};
  border-radius: 5px;
  background: #fff;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    min-height: 260px;
    height: auto;
    overflow: visible;
    border: 1px solid ${C.slate};
    padding: 0 0 20px 0;
    flex-shrink: 0;
  }
`;

const MachineTag = styled.div`
  background: ${C.lightBlue};
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  margin: 12px 0 0 16px;
  align-self: flex-start;

  @media (max-width: 768px) {
    margin: 16px 0 0 16px;
  }
`;

const MachineTagText = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;

  @media (max-width: 768px) {
    font-size: 13px;
    letter-spacing: 0.9px;
  }
`;

const MachineName = styled.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  letter-spacing: 1.68px;
  line-height: 1.25;
  padding: 10px 16px 0 16px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 22px;
    letter-spacing: 1.4px;
    padding: 12px 16px 6px 16px;
  }
`;

const MachineDesc = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.slate};
  line-height: 1.25;
  letter-spacing: 1.05px;
  padding: 8px 16px 0 16px;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.6px;
    font-weight: 500;
    flex: 0 0 auto;
    padding: 4px 16px 0 16px;
  }
`;

const MachineBestFor = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.red};
  letter-spacing: 1.05px;
  padding: 10px 16px 6px 16px;
  margin: 0;

  @media (max-width: 768px) {
    padding: 14px 16px 8px 16px;
    letter-spacing: 0.9px;
  }
`;

const MachineTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px;

  @media (max-width: 768px) {
    padding: 0 16px 0 16px;
  }
`;

const MachineUseTag = styled.span`
  background: ${C.redMuted};
  border-radius: 5px;
  padding: 4px 8px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 13px;
    letter-spacing: 0.6px;
  }
`;

// ============================================================
// WHERE TO FIND US  (Step 4)
// ============================================================
const LocationGrid = styled.div`
  display: flex;
  gap: 72px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const InfoCard = styled.div`
  flex: 1 1 380px;
  max-width: 426px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: ${C.bgLight};
  overflow: hidden;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const InfoCardHeader = styled.div<{ from: string; to: string }>`
  background: linear-gradient(to right, ${p => p.from}, ${p => p.to});
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoCardHeaderTitle = styled.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #fff;
  letter-spacing: 2.52px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: 1.4px;
  }
`;

const HoursRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  border-bottom: 1px solid ${C.divider};

  &:last-child { border-bottom: none; }
`;

const HoursDay = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;

  @media (max-width: 768px) {
    font-size: 15px;
    letter-spacing: 1.05px;
  }
`;

const HoursTime = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${C.navyMid};

  @media (max-width: 768px) {
    font-size: 15px;
    letter-spacing: 1.05px;
    color: ${C.navyLight};
  }
`;

const LocationBody = styled.div`
  padding: 18px 28px 20px 28px;
`;

const LocationText = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
  line-height: 1.35;
  margin: 0;

  strong { font-weight: 700; color: ${C.red}; }
`;

// ============================================================
// REGISTER CTA  (Step 5)
// ============================================================
// Mirrors the InfoCard chrome used in Step 4 (navy gradient header + light
// body) so the final step feels like a visual sibling to "Where to Find Us"
// rather than a one-off. Sized a little wider since it's the page's closing
// call-to-action.

// Two-column layout for Step 5: heading / copy on the left, RegisterCard on
// the right. Wraps to a stacked column on narrow viewports.
const RegisterLayout = styled.div`
  display: flex;
  gap: 56px;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const RegisterTextCol = styled.div`
  flex: 1 1 320px;
  max-width: 520px;
  min-width: 0;
`;

const RegisterCardCol = styled.div`
  flex: 1 1 420px;
  max-width: 560px;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const RegisterCard = styled.div`
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
  width: 100%;

  @media (max-width: 768px) {
    border: 1px solid ${C.slate};
    border-radius: 6px;
  }
`;

const RegisterCardHeader = styled.div`
  background: linear-gradient(to right, ${C.navy}, ${C.navyLight});
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RegisterCardTitle = styled.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #fff;
  letter-spacing: 2.52px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: 1.4px;
  }
`;

const RegisterCardBody = styled.div`
  padding: 24px 28px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;

  @media (max-width: 768px) {
    padding: 18px 20px 20px 20px;
    gap: 14px;
  }
`;

const RegisterCardText = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
  line-height: 1.4;
  margin: 0;

  strong { font-weight: 700; color: ${C.red}; }

  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 0;
    line-height: 20px;
    color: ${C.navy};

    strong { color: ${C.red}; }
  }
`;

const RegisterBulletList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RegisterBullet = styled.li`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: ${C.navyMid};
  letter-spacing: 1.05px;
  line-height: 1.4;
  padding-left: 26px;
  position: relative;

  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 0;
    line-height: 20px;
    color: ${C.navy};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${C.red};
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.3 8.2l2.4 2.4 5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>");
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }
`;

const RegisterBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 40px;
  background: ${C.red};
  border: 2px solid ${C.navy};
  border-radius: 10px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #fff;
  letter-spacing: 1.2px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(80, 16, 14, 0.35);
  transition: background-color 0.12s ease, transform 0.06s ease, opacity 0.15s;

  &:hover {
    background-color: #861717;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 0 rgba(80, 16, 14, 0.35);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 48px;
    font-size: 15px;
    border-radius: 4px;
    padding: 0 18px;
    border: none;
    box-shadow: none;
  }
`;

// ============================================================
// FILE TYPES DATA
// ============================================================
const FILE_TYPES = [
  { ext: 'STL', machine: 'FFF & Resin 3D Printing', desc: 'Standard 3D model format. Export from Fusion 360, Blender, NX, etc.' },
  { ext: 'SVG', machine: 'Laser Cutter & Sticker Printer', desc: 'Vector format required. Use Illustrator, Inkscape, or Figma. Outline all paths.' },
  { ext: 'DXF', machine: 'Laser Cutter', desc: 'CAD vector format from Fusion 360, AutoCAD, or SolidWorks exports.' },
  { ext: 'PNG', machine: 'Sticker Printer & Laser Cutter', desc: 'White background preferred for vinyl and stickers.' },
  { ext: '3MF', machine: 'FFF 3D Printing', desc: 'A modern, zipped file format designed specifically for 3D printing. Export from Fusion 360, Blender, NX, etc.' },
  { ext: 'PDF', machine: 'Sticker Printer & Laser Cutter', desc: 'Vector PDF only — not a rasterized export. Verify in Acrobat before visiting.' },
];

// ============================================================
// MACHINES DATA
// ============================================================
const MACHINES = [
  {
    tag: 'Cut & Engrave',
    name: 'Laser Cutter',
    desc: 'Cuts and engraves flat sheet materials with precision. Great for 2D shapes and custom designs.',
    uses: ['Wood', 'Acrylic', 'More'],
  },
  {
    tag: '3D Models',
    name: 'FDM 3D Printers',
    desc: 'Builds 3D objects layer by layer with plastic filament. Best for prototypes and functional parts.',
    uses: ['Prototypes', 'More'],
  },
  {
    tag: 'High Resolution',
    name: 'Resin Printer',
    desc: 'UV-cured resin for ultra-fine detail. Ideal for miniatures, molds, and complex geometries.',
    uses: ['Mini Figures', 'More'],
  },
  {
    tag: 'Decals & Stickers',
    name: 'Vinyl/Sticker Printer',
    desc: 'Cuts adhesive vinyl into custom shapes. Perfect for stickers, decals, and iron-on transfers.',
    uses: ['Stickers', 'Decals'],
  },
];

// ============================================================
// STEPS DATA
// ============================================================
const STEPS = [
  { n: 1, label: 'File Types',          mobileLabel: 'Files' },
  { n: 2, label: 'Materials & Pricing', mobileLabel: 'Materials' },
  { n: 3, label: 'Pick a Machine',      mobileLabel: 'Machines' },
  { n: 4, label: 'Where to Find Us',    mobileLabel: 'Location' },
  { n: 5, label: 'Register!',           mobileLabel: 'Register' },
];

// ============================================================
// COMPONENT
// ============================================================
export default function GettingStarted() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.querySelectorAll<HTMLElement>('[data-pattern]').forEach(el => {
      el.style.setProperty('--pattern-y', `-${el.offsetTop}px`);
    });
  }, []);

  return (
    <PageWrapper ref={wrapperRef}>

      {/* Per-section rulers. Each <PageRuler> measures its own document Y
          and shifts the tiled background phase accordingly, so the ticks
          read as ONE continuous ruler down the whole page even though the
          hero and each step use different tick graphics (white / red / blue
          alternation). See shared/PageRuler.tsx for the math. */}

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <HeroSection>
        <PageRuler src={RULER} side="left" color="#ffffff" zIndex={1} />
        <HeroInner>
          {/* Decorative background shapes — anchored inside HeroInner so
              they track the 1440px max-width content container rather than
              the full-viewport `<HeroSection>`. Previously on the 1920x1080
              Forge TV the decorations floated ~240px away from the text,
              pinned to the right edge of the screen. */}
          <HeroDeco src={HERO_BG_MOBILE}  w={321} h={315} right={12}  top={23}  />
          <HeroDeco src={HERO_BG_DESKTOP} w={283} h={101} right={336} top={265} />
          <HeroTitle>Getting Started at The Forge</HeroTitle>
          <HeroSubtitle>
            Everything you need to know before your first visit — what machines we have,
            where to find us, what files to bring, and what materials cost.
          </HeroSubtitle>
        </HeroInner>
      </HeroSection>

      {/* ── STEP 1: FILE TYPES ─────────────────────────────────────────────── */}
      <Section data-pattern bg="#fff">
        <PageRuler src={RULER} side="left" color={C.red} />

        {/* Step progress bar */}
        <StepBar>
          {STEPS.map(s => (
            <StepItem key={s.n}>
              <StepDot>
                <img src={STEP_DOT} alt="" aria-hidden="true" />
                <span>{s.n}</span>
              </StepDot>
              <StepName>{s.label}</StepName>
              <StepNameMobile>{s.mobileLabel}</StepNameMobile>
            </StepItem>
          ))}
        </StepBar>

        {/* Red bar under the step progress — matches the Figma mockup and
            lines up with the ruler tick on the left edge. */}
        <StepBarDivider aria-hidden="true" />

        <SectionInner style={{ paddingTop: 48, paddingBottom: 64 }}>
          <StepLabel>STEP 1</StepLabel>
          <SectionTitle>What file type do you need?</SectionTitle>
          <SectionSubtitle>
            Prepare your files before you visit. Different machines need different formats —
            check below so you're ready to go.
          </SectionSubtitle>

          <FileCardsGrid>
            {FILE_TYPES.map(f => (
              <FileCard key={f.ext}>
                <FileExtRow>
                  <FileDot>.</FileDot>
                  <FileExt>{f.ext}</FileExt>
                </FileExtRow>
                <FileMachine>{f.machine}</FileMachine>
                <FileDesc>{f.desc}</FileDesc>
              </FileCard>
            ))}
          </FileCardsGrid>
        </SectionInner>
      </Section>

      {/* ── STEP 2: MATERIALS & PRICING ────────────────────────────────────── */}
      <Section data-pattern bg={C.bgLight}>
        <PageRuler src={RULER} side="left" color={C.navyMid} />
        <SectionInner style={{ paddingTop: 64, paddingBottom: 64 }}>
          <StepLabel>STEP 2</StepLabel>
          <SectionTitle>Materials &amp; Pricing</SectionTitle>
          <SectionSubtitle>
            We stock everything you need. Pay only for what you use — priced per gram, mL,
            or inch depending on the material. Before you come to the space check out the{' '}
            <strong style={{ fontWeight: 800, color: C.red }}>banned filaments page.</strong>
          </SectionSubtitle>

          <PricingGrid>
            {/* Filament */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Filament</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'PLA',  price: '$0.06', unit: '/gram' },
                { mat: 'PETG', price: '$0.09', unit: '/gram' },
                { mat: 'TPU',  price: '$0.09', unit: '/gram' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>

            {/* Resin */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Resin</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'Clear', price: '$0.18', unit: '/mL' },
                { mat: 'Grey',  price: '$0.18', unit: '/mL' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>

            {/* Vinyl */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Vinyl</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'Standard',     price: '$0.20', unit: '/in' },
                { mat: 'Holographic',  price: '$0.20', unit: '/in' },
                { mat: 'Ink',          price: '$2.00', unit: '/cc' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>
          </PricingGrid>

          <BannedBtn href="../faq/materials" style={{ marginTop: 24 }}>Banned Filaments →</BannedBtn>
        </SectionInner>
      </Section>

      {/* ── STEP 3: MACHINES ───────────────────────────────────────────────── */}
      <Section data-pattern bg="#fff">
        <PageRuler src={RULER} side="left" color={C.red} />
        <SectionInner style={{ paddingTop: 64, paddingBottom: 64 }}>
          <StepLabel>STEP 3</StepLabel>
          <SectionTitle>Pick a Machine</SectionTitle>
          <SectionSubtitle>
            Find the right tool for your project. Not sure? Ask a volunteer — we're always
            on-site to help.
          </SectionSubtitle>

          <MachineGrid>
            {MACHINES.map(m => (
              <MachineCard key={m.name}>
                <MachineTag>
                  <MachineTagText>{m.tag}</MachineTagText>
                </MachineTag>
                <MachineName>{m.name}</MachineName>
                <MachineDesc>{m.desc}</MachineDesc>
                <MachineBestFor>BEST FOR</MachineBestFor>
                <MachineTags>
                  {m.uses.map(u => (
                    <MachineUseTag key={u}>{u}</MachineUseTag>
                  ))}
                </MachineTags>
              </MachineCard>
            ))}
          </MachineGrid>
        </SectionInner>
      </Section>

      {/* ── STEP 4: WHERE TO FIND US ───────────────────────────────────────── */}
      <Section data-pattern bg={C.bgLight}>
        <PageRuler src={RULER} side="left" color={C.navyMid} />
        <SectionInner style={{ paddingTop: 64, paddingBottom: 80 }}>
          <StepLabel>STEP 4</StepLabel>
          <SectionTitle>Where to Find Us</SectionTitle>
          <SectionSubtitle>
            We're on campus and easy to find. Look for the makerspace signs on the second
            floor of the DCC.
          </SectionSubtitle>

          <LocationGrid>
            {/* Hours card */}
            <InfoCard>
              <InfoCardHeader from={C.navy} to={C.navyMid}>
                <InfoCardHeaderTitle>Hours</InfoCardHeaderTitle>
              </InfoCardHeader>
              {[
                { day: 'Monday – Friday', time: '9 am – 6 pm' },
                { day: 'Saturday',        time: 'Closed' },
                { day: 'Sunday',          time: 'Check the Calendar' },
              ].map(r => (
                <HoursRow key={r.day}>
                  <HoursDay>{r.day}</HoursDay>
                  <HoursTime>{r.time}</HoursTime>
                </HoursRow>
              ))}
            </InfoCard>

            {/* Location card */}
            <InfoCard>
              <InfoCardHeader from={C.navy} to={C.navyLight}>
                <InfoCardHeaderTitle>Location</InfoCardHeaderTitle>
                <img src={LOC_PIN} alt="" aria-hidden="true" style={{ height: 40, width: 34, marginLeft: 8 }} />
              </InfoCardHeader>
              <LocationBody>
                <LocationText>
                  We are located in the basement of the{' '}
                  <strong>Center of Industrial Innovation</strong> building in{' '}
                  <strong>room CII2037A</strong>
                </LocationText>
              </LocationBody>
            </InfoCard>
          </LocationGrid>
        </SectionInner>
      </Section>

      {/* ── STEP 5: REGISTER ───────────────────────────────────────────────── */}
      {/* Closing call-to-action — nudges visitors to create a Forge account so
          they can sign in on-site and start a machine. Reuses the card chrome
          from Step 4 so it feels like a sibling section rather than a bolt-on.
          Two-column layout: heading / blurb on the left, Register card on the
          right. Collapses to a stacked column on narrow viewports. */}
      <Section data-pattern bg="#fff">
        <PageRuler src={RULER} side="left" color={C.red} />
        <SectionInner style={{ paddingTop: 64, paddingBottom: 80 }}>
          <RegisterLayout>
            <RegisterTextCol>
              <StepLabel>STEP 5</StepLabel>
              <SectionTitle>Register for a Forge Account</SectionTitle>
              <SectionSubtitle style={{ marginBottom: 0 }}>
                Create your account before you come by — it only takes a minute and
                lets us link your machine usage, charges, and reservations to your RCSID.
              </SectionSubtitle>
            </RegisterTextCol>

            <RegisterCardCol>
              <RegisterCard>
                <RegisterCardHeader>
                  <RegisterCardTitle>Register!</RegisterCardTitle>
                </RegisterCardHeader>
                <RegisterCardBody>
                  <RegisterCardText>
                    Sign up with your <strong>RCSID</strong> and <strong>RIN</strong> so
                    volunteers can check you in at any machine the moment you walk in.
                  </RegisterCardText>
                  <RegisterBulletList>
                    <RegisterBullet>Track your usage and semester balance in one place.</RegisterBullet>
                    <RegisterBullet>Reserve machines and get notified when they're free.</RegisterBullet>
                    <RegisterBullet>Pick up where you left off on any printer or cutter.</RegisterBullet>
                  </RegisterBulletList>
                  <RegisterBtn href="/register">Create an Account</RegisterBtn>
                </RegisterCardBody>
              </RegisterCard>
            </RegisterCardCol>
          </RegisterLayout>
        </SectionInner>
      </Section>

    </PageWrapper>
  );
}
