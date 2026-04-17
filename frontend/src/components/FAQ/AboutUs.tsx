import React from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';

// ── Figma Assets (fresh) ──────────────────────────────────────────────────
const FORGE_PHOTO = 'https://www.figma.com/api/mcp/asset/09344755-fef6-4d67-835d-d6a67d76e91e';
const RULER_HERO  = 'https://www.figma.com/api/mcp/asset/38734e6c-bd37-40a0-8ec8-db3a837c4103';
const RULER_MAIN  = 'https://www.figma.com/api/mcp/asset/02019811-b8fc-4937-bf9e-c260373092ea';
const LOC_PIN     = 'https://www.figma.com/api/mcp/asset/31583bbc-4b05-48fa-8877-c4caddcfd7bc';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  navy:      '#111c36',
  navyMid:   '#2d4a80',
  navyLight: '#31519c',
  red:       '#a51c1c',
  slate:     '#64748b',
  bgLight:   '#eef2f8',
  divider:   '#e2e8f0',
};

// =============================================================================
// Styled components
// =============================================================================

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`;

// ── Shared ruler ──────────────────────────────────────────────────────────
const RulerWrap = styled.div`
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 79px;
  height: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;

  img {
    transform: rotate(-90deg) scaleY(-1);
    width: 750px;
    height: 79px;
    object-fit: fill;
    flex-shrink: 0;
  }
`;

// =============================================================================
// HERO BANNER — red → navyLight gradient, "10+ Years of" left, stagger right
// Figma: h=279px, "10+ Years of" at left:113 top:139.5 font:100px
//        stagger text at left:880 centered vertically font:60px
// =============================================================================

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  min-height: 279px;
  background: linear-gradient(to right, ${C.red}, ${C.navyLight});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const HeroInner = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  /* left:113 → padding-left; right content at ~880px so use space-between */
  padding: 40px 80px 40px 113px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  gap: 40px;

  @media (max-width: 1024px) {
    padding: 40px 60px;
    gap: 32px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 24px;
    gap: 20px;
  }
`;

/* "10+ Years of" — Figma: font-size 100px, tracking 7px */
const HeroYears = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6.94vw, 100px);
  color: #fff;
  letter-spacing: 7px;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
`;

/* Staggered "Build-ing / Create-ing / Invent-ing" — Figma: font-size 60px, tracking 4.2px */
const HeroActions = styled.div`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(22px, 4.17vw, 60px);
  color: #fff;
  letter-spacing: 4.2px;
  line-height: 1.25;
  white-space: pre;
  text-align: left;
  flex-shrink: 0;
`;

// =============================================================================
// MAIN CONTENT SECTION — #eef2f8 background
// Figma: h=697px, ruler centered at top calc(50%-31.5px)
// Left column (left:174): Who We Are (top) + Where to Find Us (bottom)
// Right column (left:870): 513×513 photo centered vertically
// =============================================================================

const MainSection = styled.section`
  position: relative;
  width: 100%;
  background: ${C.bgLight};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
  }
`;

/*
 * MainInner uses a two-column flex layout.
 * Figma padding: left starts at x=174, top ≈28px, bottom ≈55px.
 * min-height matches Figma section height (697px).
 */
const MainInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 113px 55px 174px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  gap: 60px;
  min-height: 697px;

  @media (max-width: 1200px) { padding: 40px 80px 55px 80px; gap: 48px; }
  @media (max-width: 768px)  {
    flex-direction: column;
    padding: 40px 24px 56px 24px;
    gap: 40px;
    min-height: unset;
  }
`;

/*
 * Left column: justify-content space-between pushes
 * "Who We Are" to the top and "Where to Find Us" to the bottom,
 * matching Figma where WTF title is at top:373 and body ends ~336.
 */
const LeftCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WhoGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

/* "Who We Are" — Figma: font-size 50px, tracking 3.5px, black */
const WhoTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(32px, 3.47vw, 50px);
  color: #000;
  letter-spacing: 3.5px;
  line-height: 1.25;
  margin: 0 0 0 0;
`;

/* Body text block — Figma: w=583, font-size 20px, tracking 1.4px, black */
const WhoBody = styled.div`
  max-width: 583px;
  margin-top: 4px;

  p {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(14px, 1.39vw, 20px);
    color: #000;
    letter-spacing: 1.4px;
    line-height: 1.25;
    margin: 0;

    & + p { margin-top: 8px; }
  }
`;

/* ── Where to Find Us ────────────────────────────────────────── */

const LocationGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

/* "Where to Find Us" — Figma: font-size 50px, navy */
const LocationTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3.47vw, 50px);
  color: ${C.navy};
  line-height: 1.25;
  margin: 0 0 10px 0;
`;

/* Subtitle — Figma: font-size 16px, semibold, slate, tracking 1.12px, w=572 */
const LocationSubtitle = styled.p`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${C.slate};
  letter-spacing: 1.12px;
  line-height: 1.25;
  max-width: 572px;
  margin: 0 0 24px 0;
`;

const InfoCardsRow = styled.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
`;

/* Info cards — Figma: w=262, h=160, border 1px navyLight, bg bgLight */
const InfoCard = styled.div`
  width: 262px;
  height: 160px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: ${C.bgLight};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

/* Card header — Figma: h≈52, gradient from navy to navyMid/navyLight */
const InfoCardHeader = styled.div<{ $from: string; $to: string }>`
  background: linear-gradient(to right, ${p => p.$from}, ${p => p.$to});
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  flex-shrink: 0;
`;

const InfoCardTitle = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  letter-spacing: 1.26px;
  margin: 0;
`;

/* Hours rows — Figma: font-size 15px day, 10px time, divider between rows */
const HoursRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  flex: 1;
  border-bottom: 1px solid ${C.divider};

  &:last-child { border-bottom: none; }
`;

const HoursDay = styled.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${C.slate};
  letter-spacing: 1.05px;
`;

const HoursTime = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 10px;
  color: ${C.navyMid};
  letter-spacing: 0.7px;
  text-align: right;
`;

/* Location card body — text with red highlights */
const LocationBody = styled.div`
  padding: 14px 18px 16px 18px;
  flex: 1;
`;

const LocationText = styled.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${C.slate};
  letter-spacing: 1.05px;
  line-height: 1.35;
  margin: 0;

  strong {
    font-weight: 700;
    color: ${C.red};
  }
`;

/* ── Right column: photo ─────────────────────────────────────── */

/*
 * Figma: left=870, size=513×513, border-2 black, rounded-10.
 * Centered vertically in the 697px section.
 */
const RightCol = styled.div`
  flex-shrink: 0;
  width: clamp(260px, 35.6vw, 513px);
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 480px;
  }
`;

const ForgePhoto = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// =============================================================================
// Component
// =============================================================================

const AboutUs = () => {
  return (
    <PageWrapper>

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <HeroBanner>
        <RulerWrap style={{ top: 'calc(50% + 15.5px)' }}>
          <img src={RULER_HERO} alt="" aria-hidden="true" />
        </RulerWrap>

        <HeroInner>
          <HeroYears>10+ Years of</HeroYears>
          <HeroActions>
            {'Build-ing\n    Create-ing\n        Invent-ing'}
          </HeroActions>
        </HeroInner>
      </HeroBanner>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <MainSection>
        <RulerWrap style={{ top: 'calc(50% - 31.5px)' }}>
          <img src={RULER_MAIN} alt="" aria-hidden="true" />
        </RulerWrap>

        <MainInner>

          {/* Left column */}
          <LeftCol>

            {/* Who We Are — sits at the top of the column */}
            <WhoGroup>
              <WhoTitle>Who We Are</WhoTitle>
              <WhoBody>
                <p>
                  For over 10 years, The Forge has been a space where curiosity becomes
                  creation and ideas become reality.
                </p>
                <p>
                  What started as a small corner for adventurous students has grown into one
                  of RPI's most active spaces, driven entirely by the makers who call it home.
                </p>
                <p>
                  Our printers have logged over 1,000 days of total print time, and one
                  machine has produced enough material to wrap around the entire Earth.
                </p>
              </WhoBody>
            </WhoGroup>

            {/* Where to Find Us — pushed to the bottom by justify-content: space-between */}
            <LocationGroup>
              <LocationTitle>Where to Find Us</LocationTitle>
              <LocationSubtitle>
                We're on campus and easy to find. Look for the makerspace signs on the
                second floor of the DCC.
              </LocationSubtitle>

              <InfoCardsRow>

                {/* Hours card */}
                <InfoCard>
                  <InfoCardHeader $from={C.navy} $to={C.navyMid}>
                    <InfoCardTitle>Hours</InfoCardTitle>
                  </InfoCardHeader>
                  {[
                    { day: 'Monday - Friday', time: '9am - 6 pm'        },
                    { day: 'Saturday',        time: 'Closed'             },
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
                  <InfoCardHeader $from={C.navy} $to={C.navyLight}>
                    <InfoCardTitle>Location</InfoCardTitle>
                    <img
                      src={LOC_PIN}
                      alt=""
                      aria-hidden="true"
                      style={{ height: 30, width: 25, flexShrink: 0 }}
                    />
                  </InfoCardHeader>
                  <LocationBody>
                    <LocationText>
                      We are located in the basement of the{' '}
                      <strong>Center of Industrial Innovation</strong> building in{' '}
                      <strong>room CII2037A</strong>
                    </LocationText>
                  </LocationBody>
                </InfoCard>

              </InfoCardsRow>
            </LocationGroup>

          </LeftCol>

          {/* Right column — photo centered vertically */}
          <RightCol>
            <ForgePhoto>
              <img src={FORGE_PHOTO} alt="The Forge makerspace interior" />
            </ForgePhoto>
          </RightCol>

        </MainInner>
      </MainSection>

    </PageWrapper>
  );
};

export default AboutUs;
