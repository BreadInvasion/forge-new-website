import React from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import PageRuler from '../shared/PageRuler';

// ── Figma Assets ──────────────────────────────────────────────────────────
const RULER_SECTION = rulerMask;
const HERO_DECO = 'https://www.figma.com/api/mcp/asset/366c8e9b-0c94-4167-934e-fb6eff4d35f9';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  navy: '#111c36',
  navyMid: '#2d4a80',
  red: '#a51c1c',
  slate: '#64748b',
  lightBlue: '#bac8db',
  bgLight: '#eef2f8',
  divider: '#e2e8f0',
};

// ── Data ──────────────────────────────────────────────────────────────────
const DOS = [
  {
    title: 'Ask Questions',
    desc: "We welcome curiosity and excitement. Everyone will be coming in with different levels of experience so don't hesitate to ask questions.",
  },
  {
    title: 'Be Kind',
    desc: 'The Forge is a welcoming place due to our staff being student volunteers. We are not paid and often have exams when you do!',
  },
  {
    title: 'Have Fun',
    desc: 'Our space is for making and creating! We are here to help you realize your dreams, so let us know how we can help!',
  },
];

const DONTS = [
  {
    title: 'Assume',
    desc: "We know that many students walking in have experience with 3D printing. We have specific rules that don't change because we operate 24/7/365.",
  },
  {
    title: 'Rush',
    desc: 'We understand that everyone has deadlines, but our space is always changing and trying to help as many people as possible.',
  },
  {
    title: 'Make Boxes',
    desc: 'Unless the container being made is hyper specialized, please consider buying a box or using the laser cutter. Both options are cheaper and faster!',
  },
];

// =============================================================================
// Styled components
// =============================================================================

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`;

// ── Hero ──────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 362px;
  background: linear-gradient(to right, #2d0707, ${C.red});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const HeroDecoWrap = styled.div`
  position: absolute;
  right: 100px;
  top: 23px;
  width: 550px;
  height: 310px;
  transform: rotate(180deg) scaleY(-1);
  overflow: hidden;
  pointer-events: none;

  img {
    position: absolute;
    width: 122.18%;
    height: 216.89%;
    left: -3.51%;
    top: -4.18%;
    max-width: none;
    object-fit: cover;
    display: block;
  }
`;

const HeroInner = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 174px 60px 127px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 60px 80px;
  }

  @media (max-width: 640px) {
    padding: 48px 24px;
  }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 16px 0;
`;

const HeroSubtitle = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${C.lightBlue};
  line-height: 1.25;
  max-width: 680px;
  margin: 0;
`;

// ── Content section ───────────────────────────────────────────────────────

const ContentSection = styled.section`
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.03;
    pointer-events: none;
  }
`;

const SectionInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 120px 80px 174px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 48px 60px 64px 80px;
  }

  @media (max-width: 640px) {
    padding: 40px 24px 56px 24px;
  }
`;

// ── Do's and Don'ts ───────────────────────────────────────────────────────

const DosDontsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const DDColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const DDColTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 50px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0 0 4px 0;
`;

const DDItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DDItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CircleIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${C.navyMid};
  flex-shrink: 0;
`;

const TriangleIcon = styled.div`
  position: relative;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: polygon(50% 8%, 95% 90%, 5% 90%);
    background: ${C.red};
  }

  span {
    position: relative;
    z-index: 1;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 13px;
    color: #fff;
    line-height: 1;
    margin-top: 4px;
  }
`;

const DDItemTitle = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 30px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0;
`;

const DDItemDesc = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: ${C.navyMid};
  line-height: 1.35;
  margin: 0;
  max-width: 340px;
`;

// =============================================================================
// Component
// =============================================================================

export default function Etiquette() {
  return (
    <PageWrapper>

      <HeroSection>
        {/* White ruler in the dark hero */}
        <PageRuler src={RULER_SECTION} side="left" color="#ffffff" />
        <HeroDecoWrap>
          <img src={HERO_DECO} alt="" aria-hidden="true" />
        </HeroDecoWrap>

        <HeroInner>
          <HeroTitle>Etiquette</HeroTitle>
          <HeroSubtitle>
            Things to help you navigate our space and streamline your visit.
          </HeroSubtitle>
        </HeroInner>
      </HeroSection>

      <ContentSection>
        {/* Red ruler in the white content section */}
        <PageRuler src={RULER_SECTION} side="left" color={C.red} />
        <SectionInner>
          <DosDontsGrid>
            <DDColumn>
              <DDColTitle>Do</DDColTitle>
              {DOS.map(item => (
                <DDItem key={item.title}>
                  <DDItemHeader>
                    <CircleIcon />
                    <DDItemTitle>{item.title}</DDItemTitle>
                  </DDItemHeader>
                  <DDItemDesc>{item.desc}</DDItemDesc>
                </DDItem>
              ))}
            </DDColumn>

            <DDColumn>
              <DDColTitle>Don't</DDColTitle>
              {DONTS.map(item => (
                <DDItem key={item.title}>
                  <DDItemHeader>
                    <TriangleIcon>
                      <span>!</span>
                    </TriangleIcon>
                    <DDItemTitle>{item.title}</DDItemTitle>
                  </DDItemHeader>
                  <DDItemDesc>{item.desc}</DDItemDesc>
                </DDItem>
              ))}
            </DDColumn>
          </DosDontsGrid>
        </SectionInner>
      </ContentSection>
    </PageWrapper>
  );
} 